import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Download, Loader, Calendar, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import type { User } from '../types';
import { generateWeeklyReport, generateMonthlyReport, getReportHistory } from '../services/api';

interface Props { user: User }

const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function ReportsPage({ user }: Props) {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleGenerateWeekly = async () => {
    setLoading(true);
    setReport(null);
    try {
      const data = await generateWeeklyReport(user.id, selectedDate, true);
      setReport({ type: 'weekly', ...data });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMonthly = async () => {
    setLoading(true);
    setReport(null);
    try {
      const data = await generateMonthlyReport(user.id, selectedYear, selectedMonth, true);
      setReport({ type: 'monthly', ...data });
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    if (!reportRef.current) return;
    const { default: html2canvas } = await import('html2canvas');
    const { default: jsPDF } = await import('jspdf');

    const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const filename = report?.type === 'weekly'
      ? `lifetrack-semanal-${report.week_start}.pdf`
      : `lifetrack-${monthNames[selectedMonth - 1]}-${selectedYear}.pdf`;
    pdf.save(filename);
  };

  const analysis = report?.ai_analysis;

  return (
    <div className="max-w-4xl mx-auto animate-slide-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald-800">Relatórios</h1>
          <p className="text-gray-500 text-sm">Análises detalhadas geradas por IA</p>
        </div>
        {report && (
          <button onClick={exportPDF} className="btn-primary flex items-center gap-2 py-2">
            <Download size={16} /> Exportar PDF
          </button>
        )}
      </div>

      {/* Tab + Controls */}
      <div className="card mb-6">
        <div className="flex gap-2 mb-4">
          <button onClick={() => { setActiveTab('weekly'); setReport(null); }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'weekly' ? 'bg-emerald-500 text-white' : 'text-gray-500 hover:bg-emerald-50'}`}>
            📅 Semanal
          </button>
          <button onClick={() => { setActiveTab('monthly'); setReport(null); }}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'monthly' ? 'bg-emerald-500 text-white' : 'text-gray-500 hover:bg-emerald-50'}`}>
            📊 Mensal
          </button>
        </div>

        {activeTab === 'weekly' ? (
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="label">Selecione uma data da semana</label>
              <input className="input-field" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} max={format(new Date(), 'yyyy-MM-dd')} />
              <p className="text-xs text-gray-400 mt-1">O relatório cobrirá a semana inteira da data selecionada</p>
            </div>
            <button onClick={handleGenerateWeekly} className="btn-primary flex items-center gap-2" disabled={loading}>
              {loading ? <Loader size={16} className="animate-spin" /> : <FileText size={16} />}
              {loading ? 'Gerando...' : 'Gerar relatório'}
            </button>
          </div>
        ) : (
          <div className="flex gap-3 items-end">
            <div>
              <label className="label">Mês</label>
              <select className="input-field" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
                {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Ano</label>
              <select className="input-field" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button onClick={handleGenerateMonthly} className="btn-primary flex items-center gap-2" disabled={loading}>
              {loading ? <Loader size={16} className="animate-spin" /> : <FileText size={16} />}
              {loading ? 'Gerando...' : 'Gerar relatório'}
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="card text-center py-12">
          <Loader size={40} className="animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Analisando seus dados com IA...</p>
          <p className="text-gray-400 text-sm mt-1">Isso pode levar alguns segundos</p>
        </div>
      )}

      {/* Report content */}
      {report && analysis && (
        <div ref={reportRef} className="space-y-5 bg-white p-1">
          {/* Report header */}
          <div className="card bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">LifeTrack — Relatório {report.type === 'weekly' ? 'Semanal' : 'Mensal'}</h2>
                <p className="text-emerald-200 text-sm">
                  {report.type === 'weekly'
                    ? `${format(new Date(report.week_start + 'T12:00:00'), "dd/MM/yyyy")} a ${format(new Date(report.week_end + 'T12:00:00'), "dd/MM/yyyy")}`
                    : `${monthNames[selectedMonth - 1]} de ${selectedYear}`
                  }
                </p>
              </div>
            </div>
            <p className="text-emerald-100 text-sm">{analysis.summary}</p>
          </div>

          {/* Score */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ScoreCard label="Score Geral" value={`${analysis.overall_score || analysis.monthly_score || 0}%`} color="emerald" />
            {analysis.avg_productivity && <ScoreCard label="Produtividade" value={`${analysis.avg_productivity}%`} color="blue" />}
            {analysis.best_day && <div className="card bg-emerald-50 border-emerald-200"><p className="text-xs text-gray-500 mb-1">Melhor Dia</p><p className="font-bold text-emerald-700">{analysis.best_day}</p></div>}
            {analysis.worst_day && <div className="card bg-red-50 border-red-100"><p className="text-xs text-gray-500 mb-1">Dia Crítico</p><p className="font-bold text-red-600">{analysis.worst_day}</p></div>}
          </div>

          {/* Patterns */}
          {analysis.patterns_identified?.length > 0 && (
            <div className="card border-l-4 border-yellow-400">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-500" /> Padrões Identificados</h3>
              <ul className="space-y-2">
                {analysis.patterns_identified.map((p: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-yellow-500 font-bold mt-0.5">→</span><span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Wins vs Losses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(analysis.weekly_wins || analysis.month_highlights)?.length > 0 && (
              <div className="card border-l-4 border-emerald-400">
                <h3 className="font-bold text-emerald-700 mb-3 flex items-center gap-2"><CheckCircle size={18} /> Conquistas</h3>
                <ul className="space-y-2">
                  {(analysis.weekly_wins || analysis.month_highlights).map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-800"><span>✅</span><span>{w}</span></li>
                  ))}
                </ul>
              </div>
            )}

            {(analysis.weekly_losses || analysis.month_failures || analysis.recurring_failures)?.length > 0 && (
              <div className="card border-l-4 border-red-400">
                <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2"><XCircle size={18} /> Falhas / Pontos de Melhoria</h3>
                <ul className="space-y-2">
                  {(analysis.weekly_losses || analysis.month_failures || analysis.recurring_failures).map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-800"><span>❌</span><span>{w}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Trends */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analysis.mood_trend && <TrendCard title="Tendência de Humor" content={analysis.mood_trend} emoji="🧠" />}
            {analysis.sleep_trend && <TrendCard title="Tendência de Sono" content={analysis.sleep_trend} emoji="😴" />}
            {analysis.nutrition_trend && <TrendCard title="Tendência Nutricional" content={analysis.nutrition_trend} emoji="🍽️" />}
            {analysis.exercise_consistency && <TrendCard title="Consistência nos Exercícios" content={analysis.exercise_consistency} emoji="🏃" />}
          </div>

          {/* Behavioral insights */}
          {(analysis.behavioral_insights || analysis.compulsion_analysis) && (
            <div className="card border-2 border-purple-200 bg-purple-50">
              <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2"><span>🔍</span> Insights Comportamentais</h3>
              <p className="text-sm text-gray-700">{analysis.behavioral_insights || analysis.compulsion_analysis}</p>
            </div>
          )}

          {/* Time drains */}
          {analysis.biggest_time_drains?.length > 0 && (
            <div className="card border-l-4 border-orange-400">
              <h3 className="font-bold text-orange-700 mb-3 flex items-center gap-2"><span>⏳</span> Maiores Drenadores de Tempo</h3>
              <div className="space-y-2">
                {analysis.biggest_time_drains.map((d: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                    <span className="text-orange-400 font-bold">{i + 1}</span>
                    <span className="text-sm text-gray-700">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goal progress */}
          {analysis.goal_progress_summary && (
            <div className="card border-l-4 border-blue-400">
              <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2"><span>🎯</span> Progresso nos Objetivos</h3>
              <p className="text-sm text-gray-700">{analysis.goal_progress_summary || analysis.goal_achievement}</p>
            </div>
          )}

          {/* Recommendations */}
          {(analysis.recommendations_for_next_week || analysis.next_month_strategy)?.length > 0 && (
            <div className="card bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200">
              <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span>💡</span> Estratégia para {report.type === 'weekly' ? 'Próxima Semana' : 'Próximo Mês'}
              </h3>
              <div className="space-y-3">
                {(analysis.recommendations_for_next_week || analysis.next_month_strategy).map((r: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-emerald-100">
                    <span className="text-emerald-500 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                    <p className="text-sm text-gray-700">{r}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
            <p>Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })} • LifeTrack — Sistema de Evolução Pessoal</p>
            <p>{user.name} • {user.disc_profile ? `Perfil DISC: ${user.disc_profile}` : ''}</p>
          </div>
        </div>
      )}

      {!loading && !report && (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">📊</p>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Selecione o período e gere um relatório</h3>
          <p className="text-gray-500 text-sm">A IA vai analisar todos os seus dados e gerar insights detalhados com recomendações personalizadas.</p>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return (
    <div className={`card text-center ${colors[color] || colors.emerald} border`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs font-semibold mt-1">{label}</p>
    </div>
  );
}

function TrendCard({ title, content, emoji }: { title: string; content: string; emoji: string }) {
  return (
    <div className="card">
      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm">
        <span>{emoji}</span>{title}
      </h4>
      <p className="text-xs text-gray-600">{content}</p>
    </div>
  );
}
