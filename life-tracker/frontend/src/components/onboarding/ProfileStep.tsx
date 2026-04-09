import { useState } from 'react';
import type { User } from '../../types';

interface Props {
  onComplete: (data: Partial<User>) => void;
  loading: boolean;
  existing?: User | null;
}

export default function ProfileStep({ onComplete, loading, existing }: Props) {
  const [form, setForm] = useState({
    name: existing?.name || '',
    email: existing?.email || '',
    birth_date: existing?.birth_date || '',
    weight: existing?.weight || '',
    height: existing?.height || '',
    occupation: existing?.occupation || '',
    lifestyle: existing?.lifestyle || 'sedentary',
    pre_existing_conditions: existing?.pre_existing_conditions || '',
    medications: existing?.medications || '',
    sleep_goal_hours: existing?.sleep_goal_hours || 8,
    daily_calorie_goal: existing?.daily_calorie_goal || 2000,
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      ...form,
      weight: form.weight ? Number(form.weight) : undefined,
      height: form.height ? Number(form.height) : undefined,
      sleep_goal_hours: Number(form.sleep_goal_hours),
      daily_calorie_goal: Number(form.daily_calorie_goal),
    });
  };

  return (
    <div className="card animate-slide-in">
      <h2 className="text-2xl font-bold text-emerald-800 mb-2">Sobre você</h2>
      <p className="text-gray-500 mb-6 text-sm">Essas informações ajudam o sistema a te conhecer e personalizar as análises.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Nome completo *</label>
            <input className="input-field" type="text" value={form.name} onChange={set('name')} required placeholder="Seu nome" />
          </div>
          <div>
            <label className="label">E-mail</label>
            <input className="input-field" type="email" value={form.email} onChange={set('email')} placeholder="seu@email.com" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Data de nascimento</label>
            <input className="input-field" type="date" value={form.birth_date} onChange={set('birth_date')} />
          </div>
          <div>
            <label className="label">Peso (kg)</label>
            <input className="input-field" type="number" step="0.1" value={form.weight} onChange={set('weight')} placeholder="65.0" />
          </div>
          <div>
            <label className="label">Altura (cm)</label>
            <input className="input-field" type="number" value={form.height} onChange={set('height')} placeholder="165" />
          </div>
        </div>

        <div>
          <label className="label">Ocupação / Profissão *</label>
          <input className="input-field" type="text" value={form.occupation} onChange={set('occupation')} required placeholder="Ex: Empreendedora, Enfermeira, Estudante..." />
        </div>

        <div>
          <label className="label">Estilo de vida atual</label>
          <select className="input-field" value={form.lifestyle} onChange={set('lifestyle')}>
            <option value="sedentary">Sedentário (quase nenhum exercício)</option>
            <option value="light">Leve (1-2x por semana)</option>
            <option value="moderate">Moderado (3-4x por semana)</option>
            <option value="active">Ativo (5+ vezes por semana)</option>
            <option value="very_active">Muito ativo (atleta / treinos intensos)</option>
          </select>
        </div>

        <div>
          <label className="label">Condições pré-existentes / Doenças</label>
          <textarea className="input-field resize-none" rows={2} value={form.pre_existing_conditions} onChange={set('pre_existing_conditions')} placeholder="Ex: Hipotireoidismo, ansiedade, endometriose... (ou 'nenhuma')" />
        </div>

        <div>
          <label className="label">Medicamentos em uso</label>
          <input className="input-field" type="text" value={form.medications} onChange={set('medications')} placeholder="Ex: Levotiroxina 50mcg (ou 'nenhum')" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Meta de sono (horas/noite)</label>
            <input className="input-field" type="number" step="0.5" min="5" max="12" value={form.sleep_goal_hours} onChange={set('sleep_goal_hours')} />
          </div>
          <div>
            <label className="label">Meta calórica diária (kcal)</label>
            <input className="input-field" type="number" step="50" min="1000" max="5000" value={form.daily_calorie_goal} onChange={set('daily_calorie_goal')} />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Salvando...' : 'Continuar →'}
        </button>
      </form>
    </div>
  );
}
