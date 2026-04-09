import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Brain, Save, Loader } from 'lucide-react';
import type { User, DailyData } from '../types';
import { getDailyEntry, saveDailyEntry, analyzeDailyEntry } from '../services/api';
import TasksSection from '../components/tracking/TasksSection';
import MealsSection from '../components/tracking/MealsSection';
import ExerciseSection from '../components/tracking/ExerciseSection';
import MoodSection from '../components/tracking/MoodSection';
import SleepSection from '../components/tracking/SleepSection';
import BodySection from '../components/tracking/BodySection';
import MenstrualSection from '../components/tracking/MenstrualSection';
import AIAnalysisPanel from '../components/tracking/AIAnalysisPanel';

interface Props {
  user: User;
}

export default function DailyTrackingPage({ user }: Props) {
  const { date: dateParam } = useParams();
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');
  const currentDate = dateParam || today;

  const [data, setData] = useState<DailyData>({ tasks: [], meals: [], exercises: [], moods: [] });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'tarefas' | 'alimentacao' | 'exercicios' | 'humor' | 'sono' | 'corpo' | 'ciclo'>('tarefas');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const d = await getDailyEntry(user.id, currentDate);
      setData(d);
      setNotes(d.entry?.general_notes || '');
    } finally {
      setLoading(false);
    }
  }, [user.id, currentDate]);

  useEffect(() => { loadData(); }, [loadData]);

  const saveNotes = async () => {
    setSaving(true);
    try {
      await saveDailyEntry(user.id, currentDate, { general_notes: notes });
    } finally {
      setSaving(false);
    }
  };

  const runAnalysis = async () => {
    setSaving(true);
    try {
      await saveDailyEntry(user.id, currentDate, { general_notes: notes });
    } finally {
      setSaving(false);
    }
    setAnalyzing(true);
    try {
      const analysis = await analyzeDailyEntry(user.id, currentDate);
      setData(d => ({ ...d, entry: { ...(d.entry || { id: '', user_id: user.id, entry_date: currentDate }), ai_analysis: analysis } }));
    } finally {
      setAnalyzing(false);
    }
  };

  const navDate = (dir: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + dir);
    navigate(`/tracking/${format(d, 'yyyy-MM-dd')}`);
  };

  const displayDate = format(parseISO(currentDate), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const isToday = currentDate === today;

  const TABS = [
    { id: 'tarefas', label: 'Tarefas', emoji: '✅', count: data.tasks.length },
    { id: 'alimentacao', label: 'Alimentação', emoji: '🍽️', count: data.meals.length },
    { id: 'exercicios', label: 'Exercícios', emoji: '🏃', count: data.exercises.length },
    { id: 'humor', label: 'Humor', emoji: '🧠', count: data.moods.length },
    { id: 'sono', label: 'Sono', emoji: '😴', count: data.sleep ? 1 : 0 },
    { id: 'corpo', label: 'Corpo', emoji: '💪', count: data.body ? 1 : 0 },
    { id: 'ciclo', label: 'Ciclo', emoji: '🌸', count: data.menstrual ? 1 : 0 },
  ] as const;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="animate-spin text-emerald-500 mx-auto mb-3" size={32} />
          <p className="text-gray-500">Carregando registro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-slide-in">
      {/* Date header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald-800">Registro Diário</h1>
          <p className="text-emerald-600 font-medium capitalize mt-0.5">{displayDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navDate(-1)} className="p-2 rounded-xl hover:bg-emerald-100 text-emerald-700 transition-colors"><ChevronLeft size={20} /></button>
          {!isToday && <button onClick={() => navigate('/tracking')} className="text-xs btn-secondary py-2 px-3">Hoje</button>}
          <button onClick={() => navDate(1)} className="p-2 rounded-xl hover:bg-emerald-100 text-emerald-700 transition-colors" disabled={currentDate >= today}><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-white rounded-2xl border border-emerald-100 p-1 mb-6 flex gap-1 overflow-x-auto">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.id ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-700'
            }`}>
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="space-y-6">
        {activeTab === 'tarefas' && (
          <TasksSection userId={user.id} date={currentDate} tasks={data.tasks} onRefresh={loadData} />
        )}
        {activeTab === 'alimentacao' && (
          <MealsSection userId={user.id} date={currentDate} meals={data.meals} calorieGoal={user.daily_calorie_goal || 2000} onRefresh={loadData} />
        )}
        {activeTab === 'exercicios' && (
          <ExerciseSection userId={user.id} date={currentDate} exercises={data.exercises} onRefresh={loadData} />
        )}
        {activeTab === 'humor' && (
          <MoodSection userId={user.id} date={currentDate} moods={data.moods} onRefresh={loadData} />
        )}
        {activeTab === 'sono' && (
          <SleepSection userId={user.id} date={currentDate} sleep={data.sleep} goalHours={user.sleep_goal_hours || 8} onRefresh={loadData} />
        )}
        {activeTab === 'corpo' && (
          <BodySection userId={user.id} date={currentDate} body={data.body} onRefresh={loadData} />
        )}
        {activeTab === 'ciclo' && (
          <MenstrualSection userId={user.id} date={currentDate} menstrual={data.menstrual} onRefresh={loadData} />
        )}
      </div>

      {/* Notes + Analysis */}
      <div className="mt-6 card">
        <h3 className="section-title">Observações do Dia</h3>
        <textarea
          className="input-field resize-none mb-4"
          rows={4}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="O que aconteceu hoje? Como você se sentiu? Houve algum gatilho emocional? Algo que te orgulha ou arrependimento? Seja honesta..."
        />
        <div className="flex gap-3">
          <button onClick={saveNotes} className="btn-secondary flex items-center gap-2" disabled={saving}>
            <Save size={16} />{saving ? 'Salvando...' : 'Salvar notas'}
          </button>
          <button onClick={runAnalysis} className="btn-primary flex items-center gap-2 flex-1 justify-center" disabled={analyzing}>
            <Brain size={16} />
            {analyzing ? (
              <><Loader size={14} className="animate-spin" /> Analisando com IA...</>
            ) : (
              'Analisar meu dia com IA'
            )}
          </button>
        </div>
      </div>

      {/* AI Analysis result */}
      {data.entry?.ai_analysis && (
        <div className="mt-6">
          <AIAnalysisPanel analysis={data.entry.ai_analysis} />
        </div>
      )}
    </div>
  );
}
