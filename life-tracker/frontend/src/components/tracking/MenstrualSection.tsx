import { useState } from 'react';
import type { MenstrualEntry } from '../../types';
import { saveMenstrual } from '../../services/api';

interface Props {
  userId: string;
  date: string;
  menstrual?: MenstrualEntry;
  onRefresh: () => void;
}

const PHASES = [
  { value: 'menstruation', label: 'Menstruação', emoji: '🔴', desc: 'Fase de sangramento' },
  { value: 'follicular', label: 'Folicular', emoji: '🌱', desc: 'Pré-ovulação, energia crescente' },
  { value: 'ovulation', label: 'Ovulação', emoji: '🌕', desc: 'Pico de energia e foco' },
  { value: 'luteal', label: 'Lútea', emoji: '🌖', desc: 'Pré-menstrual, introspecção' },
];

const FLOW_OPTIONS = [
  { value: 'none', label: 'Sem fluxo', emoji: '⭕' },
  { value: 'light', label: 'Leve', emoji: '🔸' },
  { value: 'moderate', label: 'Moderado', emoji: '🔶' },
  { value: 'heavy', label: 'Intenso', emoji: '🔴' },
];

const SYMPTOMS = ['Cólicas', 'Inchaço', 'Sensibilidade nos seios', 'Alterações de humor', 'Fadiga', 'Dor de cabeça', 'Desejos alimentares', 'Acne', 'TPM', 'Náusea'];

export default function MenstrualSection({ userId, date, menstrual, onRefresh }: Props) {
  const [form, setForm] = useState({
    phase: menstrual?.phase || 'follicular',
    flow_intensity: menstrual?.flow_intensity || 'none',
    cramps_level: menstrual?.cramps_level || 0,
    mood_impact: menstrual?.mood_impact || '',
    notes: menstrual?.notes || '',
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    menstrual?.symptoms ? menstrual.symptoms.split(', ') : []
  );
  const [saving, setSaving] = useState(false);

  const toggleSymptom = (s: string) =>
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveMenstrual(userId, date, { ...form, symptoms: selectedSymptoms.join(', ') });
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h3 className="section-title">Ciclo Menstrual</h3>
      <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 mb-4">
        <p className="text-xs text-pink-700">Rastrear seu ciclo ajuda a entender padrões de humor, energia e produtividade ao longo do mês.</p>
      </div>

      <div className="mb-4">
        <label className="label">Fase do ciclo</label>
        <div className="grid grid-cols-2 gap-2">
          {PHASES.map(p => (
            <button key={p.value} onClick={() => setForm(f => ({ ...f, phase: p.value as typeof form.phase }))}
              className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left ${form.phase === p.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}>
              <span className="text-xl">{p.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{p.label}</p>
                <p className="text-xs text-gray-500">{p.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="label">Intensidade do fluxo</label>
        <div className="flex gap-2">
          {FLOW_OPTIONS.map(f => (
            <button key={f.value} onClick={() => setForm(form => ({ ...form, flow_intensity: f.value as typeof form.flow_intensity }))}
              className={`flex-1 flex flex-col items-center py-2 rounded-xl border-2 transition-all ${form.flow_intensity === f.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}>
              <span>{f.emoji}</span>
              <span className="text-xs font-medium text-gray-600 mt-1">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between">
          <label className="label mb-1">Nível de cólicas</label>
          <span className="text-sm font-bold text-emerald-700">{form.cramps_level}/10</span>
        </div>
        <input type="range" min="0" max="10" value={form.cramps_level}
          onChange={e => setForm(f => ({ ...f, cramps_level: Number(e.target.value) }))}
          className="w-full h-2 rounded-full appearance-none bg-gray-200 accent-pink-500" />
        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
          <span>Sem cólica</span><span>Intensa</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="label">Sintomas</label>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map(s => (
            <button key={s} onClick={() => toggleSymptom(s)}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${selectedSymptoms.includes(s) ? 'bg-pink-100 text-pink-700 border-pink-200' : 'bg-white border-gray-200 text-gray-600 hover:border-pink-200'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="label">Impacto no humor</label>
        <input className="input-field" placeholder="Como o ciclo está afetando seu humor hoje?" value={form.mood_impact}
          onChange={e => setForm(f => ({ ...f, mood_impact: e.target.value }))} />
      </div>

      <div className="mb-4">
        <label className="label">Notas</label>
        <textarea className="input-field resize-none" rows={2} placeholder="Observações adicionais..." value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      </div>

      <button onClick={handleSave} className="btn-primary w-full" disabled={saving}>
        {saving ? 'Salvando...' : menstrual ? 'Atualizar ciclo' : 'Registrar ciclo'}
      </button>
    </div>
  );
}
