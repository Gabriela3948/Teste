import { useState } from 'react';
import type { SleepEntry } from '../../types';
import { saveSleep } from '../../services/api';

interface Props {
  userId: string;
  date: string;
  sleep?: SleepEntry;
  goalHours: number;
  onRefresh: () => void;
}

export default function SleepSection({ userId, date, sleep, goalHours, onRefresh }: Props) {
  const [form, setForm] = useState({
    bedtime: sleep?.bedtime || '',
    wake_time: sleep?.wake_time || '',
    quality_score: sleep?.quality_score || 3,
    interruptions: sleep?.interruptions || 0,
    notes: sleep?.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [savedHours, setSavedHours] = useState(sleep?.total_hours);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveSleep(userId, date, form);
      setSavedHours(result.total_hours);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const qualityEmojis = ['', '😫', '😴', '😐', '😊', '🌟'];

  const hoursStatus = savedHours
    ? savedHours >= goalHours ? 'good' : savedHours >= goalHours - 1 ? 'ok' : 'bad'
    : null;

  return (
    <div className="card">
      <h3 className="section-title">Sono</h3>
      <p className="text-sm text-gray-500 mb-4">Meta: {goalHours}h por noite</p>

      {savedHours && (
        <div className={`mb-4 p-4 rounded-xl flex items-center gap-4 ${
          hoursStatus === 'good' ? 'bg-emerald-50 border border-emerald-200' :
          hoursStatus === 'ok' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="text-4xl font-bold">{savedHours ? `${savedHours}h` : '--'}</div>
          <div>
            <p className={`font-semibold ${hoursStatus === 'good' ? 'text-emerald-700' : hoursStatus === 'ok' ? 'text-yellow-700' : 'text-red-700'}`}>
              {hoursStatus === 'good' ? '✅ Dentro da meta!' : hoursStatus === 'ok' ? '⚠️ Quase na meta' : '❌ Abaixo da meta'}
            </p>
            <p className="text-xs text-gray-500">Meta: {goalHours}h · Dormiu: {savedHours}h</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">Hora que dormiu</label>
          <input className="input-field" type="time" value={form.bedtime} onChange={e => setForm(f => ({ ...f, bedtime: e.target.value }))} />
        </div>
        <div>
          <label className="label">Hora que acordou</label>
          <input className="input-field" type="time" value={form.wake_time} onChange={e => setForm(f => ({ ...f, wake_time: e.target.value }))} />
        </div>
      </div>

      <div className="mb-4">
        <label className="label">Qualidade do sono</label>
        <div className="flex gap-2">
          {[1,2,3,4,5].map(score => (
            <button key={score} onClick={() => setForm(f => ({ ...f, quality_score: score }))}
              className={`flex-1 flex flex-col items-center py-3 rounded-xl border-2 transition-all ${form.quality_score === score ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}>
              <span className="text-2xl">{qualityEmojis[score]}</span>
              <span className="text-xs font-medium text-gray-600 mt-1">{score}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="label">Quantas vezes acordou durante a noite?</label>
        <div className="flex gap-2">
          {[0,1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setForm(f => ({ ...f, interruptions: n }))}
              className={`w-10 h-10 rounded-xl border-2 text-sm font-bold transition-all ${form.interruptions === n ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
              {n === 5 ? '5+' : n}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="label">Observações</label>
        <textarea className="input-field resize-none" rows={2} placeholder="Tive pesadelos, insônia, dormiu tarde por causa de..." value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      </div>

      <button onClick={handleSave} className="btn-primary w-full" disabled={saving}>
        {saving ? 'Salvando...' : sleep ? 'Atualizar registro de sono' : 'Registrar sono'}
      </button>
    </div>
  );
}
