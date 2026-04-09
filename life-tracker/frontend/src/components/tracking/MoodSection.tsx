import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { MoodEntry } from '../../types';
import { createMood, deleteMood } from '../../services/api';

interface Props {
  userId: string;
  date: string;
  moods: MoodEntry[];
  onRefresh: () => void;
}

const TIME_OF_DAY = [
  { value: 'morning', label: 'Manhã', emoji: '🌅' },
  { value: 'afternoon', label: 'Tarde', emoji: '☀️' },
  { value: 'evening', label: 'Noite', emoji: '🌆' },
  { value: 'night', label: 'Madrugada', emoji: '🌙' },
];

const EMOTIONS = ['Feliz', 'Ansiosa', 'Triste', 'Com raiva', 'Frustrada', 'Motivada', 'Cansada', 'Estressada', 'Grata', 'Entediada', 'Esperançosa', 'Sobrecarregada', 'Tranquila', 'Irritada', 'Orgulhosa', 'Culpada'];

function ScoreSlider({ label, value, onChange, color = 'emerald' }: { label: string; value: number; onChange: (v: number) => void; color?: string }) {
  const colors: Record<string, string> = { emerald: 'accent-emerald-500', red: 'accent-red-500', yellow: 'accent-yellow-500' };
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="label text-xs mb-0">{label}</label>
        <span className="text-sm font-bold text-emerald-700">{value}/10</span>
      </div>
      <input type="range" min="1" max="10" value={value} onChange={e => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-full appearance-none bg-gray-200 ${colors[color] || colors.emerald}`} />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>Péssimo</span><span>Incrível</span>
      </div>
    </div>
  );
}

export default function MoodSection({ userId, date, moods, onRefresh }: Props) {
  const [form, setForm] = useState({
    time_of_day: 'morning', mood_score: 7, energy_level: 7, anxiety_level: 3,
    emotions: [] as string[], triggers: '', observations: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);

  const toggleEmotion = (emotion: string) =>
    setForm(f => ({ ...f, emotions: f.emotions.includes(emotion) ? f.emotions.filter(e => e !== emotion) : [...f.emotions, emotion] }));

  const handleAdd = async () => {
    setAdding(true);
    try {
      await createMood(userId, date, { ...form, time_of_day: form.time_of_day as MoodEntry['time_of_day'], emotions: form.emotions.join(', ') });
      setForm({ time_of_day: 'morning', mood_score: 7, energy_level: 7, anxiety_level: 3, emotions: [], triggers: '', observations: '' });
      setShowForm(false);
      onRefresh();
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMood(userId, date, id);
    onRefresh();
  };

  const avgMood = moods.length ? (moods.reduce((s, m) => s + m.mood_score, 0) / moods.length).toFixed(1) : null;

  const getMoodEmoji = (score: number) => {
    if (score >= 9) return '😄';
    if (score >= 7) return '🙂';
    if (score >= 5) return '😐';
    if (score >= 3) return '😔';
    return '😢';
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="section-title mb-0">Humor & Emoções</h3>
          {avgMood && <p className="text-sm text-gray-500 mt-1">Humor médio do dia: <span className="font-bold text-emerald-700">{avgMood}/10</span> {getMoodEmoji(parseFloat(avgMood))}</p>}
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary py-2 px-4 flex items-center gap-2">
          <Plus size={16} /> Registrar
        </button>
      </div>

      {showForm && (
        <div className="bg-emerald-50 rounded-xl p-4 mb-4 space-y-4">
          <div>
            <label className="label text-xs">Período do dia</label>
            <div className="flex gap-2">
              {TIME_OF_DAY.map(t => (
                <button key={t.value} onClick={() => setForm(f => ({ ...f, time_of_day: t.value }))}
                  className={`flex-1 flex flex-col items-center py-2 rounded-xl text-sm border transition-colors ${form.time_of_day === t.value ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-emerald-200 text-gray-600 hover:bg-emerald-50'}`}>
                  <span>{t.emoji}</span>
                  <span className="text-xs mt-0.5">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <ScoreSlider label="Humor geral" value={form.mood_score} onChange={v => setForm(f => ({ ...f, mood_score: v }))} />
          <ScoreSlider label="Nível de energia" value={form.energy_level} onChange={v => setForm(f => ({ ...f, energy_level: v }))} color="yellow" />
          <ScoreSlider label="Ansiedade (1 = calma, 10 = muito ansiosa)" value={form.anxiety_level} onChange={v => setForm(f => ({ ...f, anxiety_level: v }))} color="red" />

          <div>
            <label className="label text-xs">Como você está se sentindo? (selecione todas que se aplicam)</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {EMOTIONS.map(e => (
                <button key={e} onClick={() => toggleEmotion(e)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${form.emotions.includes(e) ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-emerald-200 text-gray-600 hover:bg-emerald-50'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label text-xs">Gatilhos emocionais (o que causou essa emoção?)</label>
            <input className="input-field text-sm" placeholder="Ex: briga com alguém, tarefa não concluída, notícia ruim..." value={form.triggers}
              onChange={e => setForm(f => ({ ...f, triggers: e.target.value }))} />
          </div>

          <div>
            <label className="label text-xs">Observações profundas</label>
            <textarea className="input-field text-sm resize-none" rows={3}
              placeholder="Como você está realmente? O que está pensando? Há algo que precisa resolver? Seja completamente honesta consigo mesma..."
              value={form.observations} onChange={e => setForm(f => ({ ...f, observations: e.target.value }))} />
          </div>

          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary py-2 px-4 text-sm" disabled={adding}>
              {adding ? 'Salvando...' : '+ Registrar humor'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary py-2 px-4 text-sm">Cancelar</button>
          </div>
        </div>
      )}

      {moods.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">🧠</p>
          <p className="text-sm">Registre seu humor ao longo do dia para mapear padrões emocionais.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {moods.map(mood => {
            const timeInfo = TIME_OF_DAY.find(t => t.value === mood.time_of_day);
            return (
              <div key={mood.id} className="p-4 rounded-xl border border-emerald-100 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span>{timeInfo?.emoji}</span>
                    <span className="font-semibold text-sm text-gray-700">{timeInfo?.label}</span>
                    <span className="text-2xl">{getMoodEmoji(mood.mood_score)}</span>
                    <span className="font-bold text-emerald-700">{mood.mood_score}/10</span>
                  </div>
                  <button onClick={() => handleDelete(mood.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
                  {mood.energy_level && <span>⚡ Energia: {mood.energy_level}/10</span>}
                  {mood.anxiety_level && <span>😰 Ansiedade: {mood.anxiety_level}/10</span>}
                </div>
                {mood.emotions && <p className="text-xs text-emerald-700 mt-1.5 font-medium">{mood.emotions}</p>}
                {mood.triggers && <p className="text-xs text-gray-500 mt-1">🎯 Gatilho: {mood.triggers}</p>}
                {mood.observations && <p className="text-xs text-gray-600 mt-1 italic">"{mood.observations}"</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
