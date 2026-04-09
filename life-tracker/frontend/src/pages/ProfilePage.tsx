import { useState } from 'react';
import { Check } from 'lucide-react';
import type { User } from '../types';
import { updateUser } from '../services/api';

interface Props { user: User; onRefresh: () => void; }

const DISC_PROFILES: Record<string, { name: string; description: string; strengths: string[]; challenges: string[] }> = {
  D: { name: 'Dominância', description: 'Orientada a resultados e desafios. Você é direta, decidida e focada em resultados rápidos.',
    strengths: ['Tomada de decisão rápida', 'Liderança natural', 'Foco em resultados', 'Proatividade'],
    challenges: ['Impaciência', 'Pode ser muito direta', 'Dificuldade em delegar', 'Risco de burnout'] },
  I: { name: 'Influência', description: 'Entusiasta e comunicativa. Você energiza as pessoas ao redor e prospera em ambientes colaborativos.',
    strengths: ['Comunicação', 'Motivação de pessoas', 'Criatividade', 'Positividade'],
    challenges: ['Foco e conclusão de tarefas', 'Organização', 'Consistência', 'Pode se dispersar'] },
  S: { name: 'Estabilidade', description: 'Confiável e empática. Você é o pilar que sustenta equipes e relacionamentos com paciência.',
    strengths: ['Consistência', 'Empatia', 'Confiabilidade', 'Trabalho em equipe'],
    challenges: ['Resistência a mudanças', 'Dificuldade em dizer não', 'Pode evitar conflitos necessários', 'Assertividade'] },
  C: { name: 'Conformidade', description: 'Analítica e precisa. Você busca excelência com dados, processos claros e alta qualidade.',
    strengths: ['Análise profunda', 'Precisão', 'Qualidade', 'Pensamento sistemático'],
    challenges: ['Análise paralisante', 'Perfeccionismo', 'Pode ser muito crítica', 'Velocidade de decisão'] },
};

export default function ProfilePage({ user, onRefresh }: Props) {
  const [form, setForm] = useState({
    name: user.name || '', email: user.email || '', birth_date: user.birth_date || '',
    weight: user.weight || '', height: user.height || '', occupation: user.occupation || '',
    lifestyle: user.lifestyle || 'sedentary', pre_existing_conditions: user.pre_existing_conditions || '',
    medications: user.medications || '', sleep_goal_hours: user.sleep_goal_hours || 8,
    daily_calorie_goal: user.daily_calorie_goal || 2000,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(user.id, { ...form, weight: Number(form.weight), height: Number(form.height) });
      onRefresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const discInfo = user.disc_profile ? DISC_PROFILES[user.disc_profile] : null;
  let discScores: Record<string, number> | null = null;
  try {
    if (user.disc_scores) discScores = JSON.parse(user.disc_scores);
  } catch(e) {}

  return (
    <div className="max-w-3xl mx-auto animate-slide-in">
      <h1 className="text-2xl font-bold text-emerald-800 mb-6">Perfil</h1>

      {/* DISC profile */}
      {discInfo && (
        <div className="card mb-6 border-2 border-emerald-200">
          <h3 className="font-bold text-emerald-800 mb-3">Seu Perfil DISC: {user.disc_profile} — {discInfo.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{discInfo.description}</p>
          {discScores && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              {Object.entries(discScores).map(([key, val]) => (
                <div key={key} className={`text-center p-2 rounded-xl ${key === user.disc_profile ? 'bg-emerald-100' : 'bg-gray-50'}`}>
                  <p className={`text-2xl font-bold ${key === user.disc_profile ? 'text-emerald-700' : 'text-gray-400'}`}>{val}</p>
                  <p className="text-xs font-medium mt-1 text-gray-600">{key}</p>
                  <div className="h-1.5 bg-gray-200 rounded-full mt-1.5"><div className={`h-full rounded-full ${key === user.disc_profile ? 'bg-emerald-500' : 'bg-gray-300'}`} style={{ width: `${(val / 10) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-emerald-700 mb-2">Pontos fortes:</p>
              {discInfo.strengths.map((s, i) => <p key={i} className="text-xs text-gray-600 flex items-start gap-1.5 mb-1"><span className="text-emerald-500">✓</span>{s}</p>)}
            </div>
            <div>
              <p className="text-xs font-bold text-red-600 mb-2">Desafios:</p>
              {discInfo.challenges.map((c, i) => <p key={i} className="text-xs text-gray-600 flex items-start gap-1.5 mb-1"><span className="text-red-400">→</span>{c}</p>)}
            </div>
          </div>
        </div>
      )}

      {/* Edit profile */}
      <div className="card">
        <h3 className="font-bold text-emerald-800 mb-4">Informações Pessoais</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Nome</label><input className="input-field" type="text" value={form.name} onChange={set('name')} /></div>
            <div><label className="label">E-mail</label><input className="input-field" type="email" value={form.email} onChange={set('email')} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="label">Nascimento</label><input className="input-field" type="date" value={form.birth_date} onChange={set('birth_date')} /></div>
            <div><label className="label">Peso (kg)</label><input className="input-field" type="number" step="0.1" value={form.weight} onChange={set('weight')} /></div>
            <div><label className="label">Altura (cm)</label><input className="input-field" type="number" value={form.height} onChange={set('height')} /></div>
          </div>
          <div><label className="label">Ocupação</label><input className="input-field" type="text" value={form.occupation} onChange={set('occupation')} /></div>
          <div>
            <label className="label">Estilo de vida</label>
            <select className="input-field" value={form.lifestyle} onChange={set('lifestyle')}>
              <option value="sedentary">Sedentário</option>
              <option value="light">Leve (1-2x/sem)</option>
              <option value="moderate">Moderado (3-4x/sem)</option>
              <option value="active">Ativo (5+x/sem)</option>
              <option value="very_active">Muito ativo</option>
            </select>
          </div>
          <div><label className="label">Condições pré-existentes</label>
            <textarea className="input-field resize-none" rows={2} value={form.pre_existing_conditions} onChange={set('pre_existing_conditions')} /></div>
          <div><label className="label">Medicamentos</label><input className="input-field" value={form.medications} onChange={set('medications')} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Meta de sono (h)</label><input className="input-field" type="number" step="0.5" value={form.sleep_goal_hours} onChange={set('sleep_goal_hours')} /></div>
            <div><label className="label">Meta calórica (kcal)</label><input className="input-field" type="number" step="50" value={form.daily_calorie_goal} onChange={set('daily_calorie_goal')} /></div>
          </div>
          <button onClick={handleSave} className={`btn-primary w-full flex items-center justify-center gap-2 ${saved ? 'bg-emerald-600' : ''}`} disabled={saving}>
            {saved ? <><Check size={16} />Salvo!</> : saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}
