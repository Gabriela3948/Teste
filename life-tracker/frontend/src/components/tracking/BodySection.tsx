import { useState } from 'react';
import type { BodyEntry } from '../../types';
import { saveBody } from '../../services/api';

interface Props {
  userId: string;
  date: string;
  body?: BodyEntry;
  onRefresh: () => void;
}

const ENERGY_OPTIONS = [
  { value: 'great', label: 'Ótima', emoji: '⚡' },
  { value: 'good', label: 'Boa', emoji: '😊' },
  { value: 'ok', label: 'Regular', emoji: '😐' },
  { value: 'tired', label: 'Cansada', emoji: '😴' },
  { value: 'exhausted', label: 'Exausta', emoji: '😫' },
];

const SYMPTOMS = ['Dor de cabeça', 'Cansaço excessivo', 'Inchaço', 'Dor muscular', 'Náusea', 'Tensão', 'Dor nas costas', 'Falta de ar', 'Tontura', 'Outros'];

export default function BodySection({ userId, date, body, onRefresh }: Props) {
  const [form, setForm] = useState({
    weight: body?.weight ? String(body.weight) : '',
    energy_feeling: body?.energy_feeling || '',
    physical_symptoms: body?.physical_symptoms || '',
    body_notes: body?.body_notes || '',
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    body?.physical_symptoms ? body.physical_symptoms.split(', ') : []
  );
  const [saving, setSaving] = useState(false);

  const toggleSymptom = (s: string) =>
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveBody(userId, date, {
        ...form,
        weight: form.weight ? Number(form.weight) : undefined,
        physical_symptoms: selectedSymptoms.join(', ')
      });
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h3 className="section-title">Como está seu corpo?</h3>

      <div className="mb-4">
        <label className="label">Peso hoje (kg)</label>
        <input className="input-field w-40" type="number" step="0.1" placeholder="65.0" value={form.weight}
          onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
      </div>

      <div className="mb-4">
        <label className="label">Nível de energia física</label>
        <div className="flex gap-2 flex-wrap">
          {ENERGY_OPTIONS.map(e => (
            <button key={e.value} onClick={() => setForm(f => ({ ...f, energy_feeling: e.value }))}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${form.energy_feeling === e.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}>
              <span>{e.emoji}</span>
              <span className="text-sm font-medium">{e.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="label">Sintomas físicos</label>
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map(s => (
            <button key={s} onClick={() => toggleSymptom(s)}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${selectedSymptoms.includes(s) ? 'bg-red-100 text-red-700 border-red-200' : 'bg-white border-gray-200 text-gray-600 hover:border-red-200'}`}>
              {s}
            </button>
          ))}
        </div>
        {selectedSymptoms.length === 0 && (
          <p className="text-xs text-emerald-600 mt-2">✅ Nenhum sintoma? Ótimo!</p>
        )}
      </div>

      <div className="mb-4">
        <label className="label">Observações sobre o corpo</label>
        <textarea className="input-field resize-none" rows={3}
          placeholder="Como seu corpo está se sentindo? Alguma dor específica? Inchaço? Tensão? Algo diferente do habitual?"
          value={form.body_notes} onChange={e => setForm(f => ({ ...f, body_notes: e.target.value }))} />
      </div>

      <button onClick={handleSave} className="btn-primary w-full" disabled={saving}>
        {saving ? 'Salvando...' : body ? 'Atualizar registro corporal' : 'Salvar registro corporal'}
      </button>
    </div>
  );
}
