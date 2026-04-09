const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function analyzeDailyEntry(data) {
  const {
    user, goals, tasks, meals, exercises,
    moods, sleep, body, menstrual, entry_date
  } = data;

  const totalCalories = meals.reduce((sum, m) => sum + (m.estimated_calories || 0), 0);
  const totalExerciseMin = exercises.reduce((sum, e) => sum + e.duration_minutes, 0);
  const completedTasks = tasks.filter(t => t.completed).length;
  const workTasks = tasks.filter(t => t.category === 'work');
  const procrastinationTasks = tasks.filter(t => t.category === 'procrastination');
  const avgMood = moods.length
    ? (moods.reduce((sum, m) => sum + m.mood_score, 0) / moods.length).toFixed(1)
    : 'N/A';

  const prompt = `Você é um coach de vida brutal e honesto. Analise os dados do dia ${entry_date} desta pessoa e forneça um relatório completo em português.

PERFIL:
- Nome: ${user.name}
- Peso: ${user.weight}kg | Altura: ${user.height}cm
- Ocupação: ${user.occupation}
- Condições pré-existentes: ${user.pre_existing_conditions || 'Nenhuma'}
- Perfil DISC: ${user.disc_profile || 'Não informado'}
- Meta calórica diária: ${user.daily_calorie_goal} kcal
- Meta de sono: ${user.sleep_goal_hours}h

OBJETIVOS ATIVOS:
${goals.map(g => `- [${g.category}] ${g.title}: ${g.description || ''} (Prazo: ${g.deadline || 'Sem prazo'})`).join('\n') || 'Nenhum objetivo cadastrado'}

DADOS DO DIA:

TAREFAS (${completedTasks}/${tasks.length} concluídas):
${tasks.map(t => `- [${t.completed ? 'FEITO' : 'NÃO FEITO'}] [${t.category}] ${t.title} (${t.duration_minutes}min)`).join('\n') || 'Nenhuma tarefa'}

ALIMENTAÇÃO (Total estimado: ${totalCalories} kcal):
${meals.map(m => `- ${m.meal_type}: ${m.description} (~${m.estimated_calories || 0} kcal) ${m.compulsion_flag ? '⚠️ COMPULSÃO' : ''}`).join('\n') || 'Nenhuma refeição registrada'}

EXERCÍCIOS (Total: ${totalExerciseMin} minutos):
${exercises.map(e => `- ${e.exercise_type}: ${e.duration_minutes}min (${e.intensity})`).join('\n') || 'Nenhum exercício'}

HUMOR (Média: ${avgMood}/10):
${moods.map(m => `- ${m.time_of_day}: ${m.mood_score}/10 | Energia: ${m.energy_level}/10 | Ansiedade: ${m.anxiety_level}/10 | Emoções: ${m.emotions || 'N/A'} | Gatilhos: ${m.triggers || 'Nenhum'}`).join('\n') || 'Nenhum registro de humor'}

SONO:
${sleep ? `- Dormiu: ${sleep.bedtime || 'N/A'} | Acordou: ${sleep.wake_time || 'N/A'} | Total: ${sleep.total_hours || 'N/A'}h | Qualidade: ${sleep.quality_score}/5` : 'Não registrado'}

CORPO:
${body ? `- Peso: ${body.weight || 'N/A'}kg | Energia: ${body.energy_feeling || 'N/A'} | Sintomas: ${body.physical_symptoms || 'Nenhum'}` : 'Não registrado'}

${menstrual ? `CICLO MENSTRUAL:
- Fase: ${menstrual.phase} | Fluxo: ${menstrual.flow_intensity} | Cólicas: ${menstrual.cramps_level}/10 | Sintomas: ${menstrual.symptoms || 'N/A'}` : ''}

OBSERVAÇÕES DO DIA:
${data.general_notes || 'Nenhuma observação'}

---

Forneça uma análise BRUTALMENTE HONESTA no seguinte formato JSON:

{
  "productivity_score": <0-100>,
  "work_percentage": <0-100>,
  "selfcare_percentage": <0-100>,
  "procrastination_percentage": <0-100>,
  "calorie_analysis": "<análise das calorias>",
  "sleep_analysis": "<análise do sono>",
  "mood_analysis": "<análise profunda do humor>",
  "compulsion_flags": ["<lista de comportamentos compulsivos ou sabotadores identificados>"],
  "time_drains": ["<atividades que estão drenando tempo sem resultado>"],
  "highlights": ["<pontos positivos do dia>"],
  "failures": ["<falhas e erros do dia, seja brutal>"],
  "goal_progress": "<como o dia contribuiu ou não para os objetivos>",
  "recommendations": ["<recomendação 1>", "<recomendação 2>", "<recomendação 3>", "<recomendação 4>", "<recomendação 5>"],
  "summary": "<resumo honesto e direto do dia em 3-4 linhas>",
  "tomorrow_focus": "<uma coisa principal para focar amanhã>"
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return { summary: text, recommendations: [], failures: [], highlights: [] };
}

async function generateWeeklyReport(data) {
  const { user, goals, dailyEntries, weekStart, weekEnd } = data;

  const prompt = `Você é um coach de vida especialista. Gere um relatório semanal COMPLETO e HONESTO em português para ${user.name}.

PERÍODO: ${weekStart} a ${weekEnd}

OBJETIVOS:
${goals.map(g => `- ${g.title} (${g.category})`).join('\n')}

DADOS DA SEMANA:
${dailyEntries.map(day => {
  const analysis = day.ai_analysis ? JSON.parse(day.ai_analysis) : {};
  return `
DATA: ${day.entry_date}
- Produtividade: ${analysis.productivity_score || day.productivity_score || 'N/A'}%
- Trabalho: ${analysis.work_percentage || day.work_hours || 'N/A'}%
- Autocuidado: ${analysis.selfcare_percentage || day.selfcare_hours || 'N/A'}%
- Procrastinação: ${analysis.procrastination_percentage || day.procrastination_hours || 'N/A'}%
- Resumo IA: ${analysis.summary || 'N/A'}`;
}).join('\n---')}

Gere um relatório JSON completo:
{
  "overall_score": <0-100>,
  "avg_productivity": <0-100>,
  "best_day": "<data>",
  "worst_day": "<data>",
  "patterns_identified": ["<padrão 1>", "<padrão 2>"],
  "recurring_failures": ["<falha recorrente>"],
  "biggest_time_drains": ["<dreno de tempo>"],
  "mood_trend": "<tendência de humor na semana>",
  "sleep_trend": "<tendência de sono>",
  "nutrition_trend": "<tendência nutricional>",
  "exercise_consistency": "<consistência nos exercícios>",
  "goal_progress_summary": "<progresso em relação aos objetivos>",
  "weekly_wins": ["<conquista>"],
  "weekly_losses": ["<falha>"],
  "recommendations_for_next_week": ["<recomendação>"],
  "focus_areas": ["<área para focar>"],
  "behavioral_insights": "<insights profundos sobre comportamento>",
  "summary": "<resumo executivo da semana>"
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  return { summary: text };
}

async function generateMonthlyReport(data) {
  const { user, goals, weeklyData, year, month } = data;
  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  const prompt = `Gere um relatório mensal executivo COMPLETO para ${user.name} - ${monthNames[month-1]} ${year}.

OBJETIVOS:
${goals.map(g => `- ${g.title}: ${g.description || ''}`).join('\n')}

RESUMO SEMANAL:
${weeklyData.map(w => `Semana ${w.week_start}: Score ${w.overall_score || 'N/A'}% - ${w.summary || 'N/A'}`).join('\n')}

Retorne JSON:
{
  "monthly_score": <0-100>,
  "evolution_trend": "<crescimento ou regressão>",
  "month_highlights": ["<destaque>"],
  "month_failures": ["<falha do mês>"],
  "behavioral_patterns": ["<padrão identificado>"],
  "compulsion_analysis": "<análise de compulsões e sabotagens do mês>",
  "goal_achievement": "<% de objetivos alcançados ou progresso>",
  "health_summary": "<resumo de saúde: sono, alimentação, exercício>",
  "emotional_summary": "<resumo emocional do mês>",
  "productivity_evolution": "<evolução da produtividade>",
  "next_month_strategy": ["<estratégia>"],
  "long_term_recommendations": ["<recomendação de longo prazo>"],
  "summary": "<análise executiva do mês>"
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  return { summary: text };
}

async function estimateCalories(description, mealType) {
  const prompt = `Estime as calorias desta refeição/alimento em português. Seja preciso.
Refeição: "${description}" (${mealType})
Retorne apenas um JSON: {"calories": <número>, "breakdown": "<descrição breve dos principais itens e calorias>"}`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    });
    const text = response.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('Calorie estimation error:', e.message);
  }
  return { calories: 0, breakdown: 'Estimativa indisponível' };
}

module.exports = { analyzeDailyEntry, generateWeeklyReport, generateMonthlyReport, estimateCalories };
