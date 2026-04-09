import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Activity, Moon, Utensils, Dumbbell, Target, CalendarDays, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PieChart, Pie, Cell, Legend
} from 'recharts';
import type { User } from '../types';
import { getAnalytics, getGoals } from '../services/api';

interface Props { user: User }

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DashboardPage({ user }: Props) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(14);

  const today = format(new Date(), 'yyyy-MM-dd');
  const from = format(subDays(new Date(), period), 'yyyy-MM-dd');

  useEffect(() => {
    Promise.all([
      getAnalytics(user.id, { from, to: today }),
      getGoals(user.id)
    ]).then(([a, g]) => { setAnalytics(a); setGoals(g); }).finally(() => setLoading(false));
  }, [user.id, period]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500">Carregando dados...</p>
      </div>
    </div>
  );

  const { summary, entries, meals_by_date, exercises_by_date, sleep_by_date, moods_by_date } = analytics || {};

  // Prepare chart data
  const chartData = (entries || []).map((e: any) => ({
    date: format(new Date(e.entry_date + 'T12:00:00'), 'dd/MM', { locale: ptBR }),
    produtividade: e.productivity_score || 0,
    trabalho: e.work_hours || 0,
    autocuidado: e.selfcare_hours || 0,
    procrastinacao: e.procrastination_hours || 0,
  }));

  const sleepChartData = (sleep_by_date || []).map((s: any) => ({
    date: format(new Date(s.entry_date + 'T12:00:00'), 'dd/MM', { locale: ptBR }),
    horas: s.total_hours || 0,
    qualidade: (s.quality_score || 0) * 2,
  }));

  const moodChartData = (moods_by_date || []).map((m: any) => ({
    date: format(new Date(m.entry_date + 'T12:00:00'), 'dd/MM', { locale: ptBR }),
    humor: parseFloat(m.avg_mood?.toFixed(1) || '0'),
    energia: parseFloat(m.avg_energy?.toFixed(1) || '0'),
    ansiedade: parseFloat(m.avg_anxiety?.toFixed(1) || '0'),
  }));

  const calChartData = (meals_by_date || []).map((m: any) => ({
    date: format(new Date(m.entry_date + 'T12:00:00'), 'dd/MM', { locale: ptBR }),
    calorias: m.total_calories || 0,
  }));

  const timeDistData = entries?.length ? [
    { name: 'Trabalho', value: Math.round(entries.reduce((s: number, e: any) => s + (e.work_hours || 0), 0) / entries.length) },
    { name: 'Autocuidado', value: Math.round(entries.reduce((s: number, e: any) => s + (e.selfcare_hours || 0), 0) / entries.length) },
    { name: 'Procrastinação', value: Math.round(entries.reduce((s: number, e: any) => s + (e.procrastination_hours || 0), 0) / entries.length) },
  ] : [];

  const goalCategories = ['health', 'work', 'personal', 'financial', 'relationship', 'spiritual'];
  const goalEmojis: Record<string, string> = { health: '💪', work: '💼', personal: '🌟', financial: '💰', relationship: '❤️', spiritual: '🙏' };
  const goalLabels: Record<string, string> = { health: 'Saúde', work: 'Trabalho', personal: 'Pessoal', financial: 'Financeiro', relationship: 'Relacionamentos', spiritual: 'Espiritual' };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Olá, {user.name}! Aqui está sua visão geral.</p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30].map(d => (
            <button key={d} onClick={() => setPeriod(d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${period === d ? 'bg-emerald-500 text-white' : 'bg-white text-gray-600 border border-emerald-100 hover:border-emerald-300'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Quick action */}
      <div className="card bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">Registro de hoje</h2>
            <p className="text-emerald-100 text-sm">{format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}</p>
          </div>
          <Link to={`/tracking/${today}`} className="bg-white text-emerald-700 font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors text-sm">
            Registrar agora →
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Produtividade Média" value={`${summary?.avg_productivity || 0}%`} icon={<TrendingUp size={20} />}
          color="emerald" subtitle={`${summary?.total_days || 0} dias registrados`} />
        <StatCard title="Sono Médio" value={`${summary?.avg_sleep_hours || 0}h`} icon={<Moon size={20} />}
          color="blue" subtitle={`Meta: ${user.sleep_goal_hours || 8}h`}
          status={summary?.avg_sleep_hours >= (user.sleep_goal_hours || 8) ? 'good' : 'warn'} />
        <StatCard title="Humor Médio" value={`${summary?.avg_mood || 0}/10`} icon={<Activity size={20} />}
          color="purple" subtitle="Escala 1-10" />
        <StatCard title="Dias com Exercício" value={`${summary?.exercise_days || 0}`} icon={<Dumbbell size={20} />}
          color="yellow" subtitle={`de ${summary?.total_days || 0} dias`} />
      </div>

      {/* Compulsion alert */}
      {summary?.total_compulsions > 0 && (
        <div className="card border-l-4 border-orange-400 bg-orange-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-orange-500 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-orange-800">
                {summary.total_compulsions} episódio{summary.total_compulsions > 1 ? 's' : ''} de compulsão alimentar nos últimos {period} dias
              </p>
              <p className="text-sm text-orange-600">Registre os gatilhos para identificar padrões e trabalhar a causa raiz.</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity over time */}
        {chartData.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-500" /> Produtividade</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}%`]} />
                <Line type="monotone" dataKey="produtividade" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Time distribution */}
        {timeDistData.length > 0 && timeDistData.some(d => d.value > 0) && (
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><CalendarDays size={18} className="text-emerald-500" /> Distribuição de Tempo</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={timeDistData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {timeDistData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sleep chart */}
        {sleepChartData.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Moon size={18} className="text-blue-500" /> Sono</h3>
            <div className="flex items-center gap-4 mb-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-400 inline-block" /> Horas dormidas</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-200 inline-block border-dashed border-t-2 border-blue-300" /> Meta ({user.sleep_goal_hours || 8}h)</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={sleepChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eff6ff" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 12]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}h`]} />
                <Bar dataKey="horas" fill="#93c5fd" radius={[4, 4, 0, 0]}>
                  {sleepChartData.map((s: any, i: number) => (
                    <Cell key={i} fill={s.horas >= (user.sleep_goal_hours || 8) ? '#3b82f6' : '#fca5a5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Mood chart */}
        {moodChartData.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Activity size={18} className="text-purple-500" /> Humor & Energia</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={moodChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#faf5ff" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="humor" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Humor" />
                <Line type="monotone" dataKey="energia" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Energia" />
                <Line type="monotone" dataKey="ansiedade" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} name="Ansiedade" />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Calories chart */}
        {calChartData.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Utensils size={18} className="text-orange-500" /> Calorias Diárias</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={calChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fff7ed" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v} kcal`]} />
                <Bar dataKey="calorias" radius={[4, 4, 0, 0]}>
                  {calChartData.map((d: any, i: number) => (
                    <Cell key={i} fill={
                      d.calorias > (user.daily_calorie_goal ?? 2000) * 1.15 ? '#ef4444' :
                      d.calorias > (user.daily_calorie_goal ?? 2000) * 0.85 ? '#10b981' : '#f59e0b'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Goals section */}
      {goals.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><Target size={18} className="text-emerald-500" /> Meus Objetivos</h3>
            <Link to="/goals" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Gerenciar →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {goals.map(goal => (
              <div key={goal.id} className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2 mb-1">
                  <span>{goalEmojis[goal.category] || '🎯'}</span>
                  <span className="text-xs font-semibold text-emerald-700 uppercase">{goalLabels[goal.category]}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{goal.title}</p>
                {goal.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{goal.description}</p>}
                {goal.deadline && <p className="text-xs text-emerald-600 mt-1">📅 Prazo: {format(new Date(goal.deadline + 'T12:00:00'), "dd/MM/yyyy")}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!entries || entries.length === 0) && (
        <div className="card text-center py-10">
          <p className="text-4xl mb-3">📊</p>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Nenhum dado ainda</h3>
          <p className="text-gray-500 text-sm mb-4">Comece a registrar seu dia para ver os gráficos e análises aqui.</p>
          <Link to={`/tracking/${today}`} className="btn-primary inline-block">Fazer primeiro registro →</Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color, subtitle, status }: {
  title: string; value: string; icon: React.ReactNode; color: string; subtitle?: string; status?: 'good' | 'warn';
}) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  };
  return (
    <div className={`card ${colors[color]} border`}>
      <div className="flex items-center justify-between mb-2">
        <span className="opacity-70">{icon}</span>
        {status && <span>{status === 'good' ? '✅' : '⚠️'}</span>}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-semibold mt-0.5 opacity-80">{title}</p>
      {subtitle && <p className="text-xs opacity-60 mt-0.5">{subtitle}</p>}
    </div>
  );
}
