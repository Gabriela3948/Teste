import { useState } from 'react';
import type { User } from '../types';
import { createUser, updateUser, saveDiscResults, createGoal } from '../services/api';
import ProfileStep from '../components/onboarding/ProfileStep';
import DiscTestStep from '../components/onboarding/DiscTestStep';
import GoalsStep from '../components/onboarding/GoalsStep';

interface Props {
  onComplete: (id: string, user: User) => void;
  existingUser?: User | null;
}

const STEPS = ['Perfil', 'Teste DISC', 'Objetivos'];

export default function OnboardingPage({ onComplete, existingUser }: Props) {
  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(existingUser?.id || null);
  const [loading, setLoading] = useState(false);

  const handleProfileComplete = async (data: Partial<User>) => {
    setLoading(true);
    try {
      if (userId) {
        await updateUser(userId, data);
        setStep(1);
      } else {
        const user = await createUser(data);
        setUserId(user.id);
        setStep(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDiscComplete = async (profile: string, scores: Record<string, number>) => {
    if (!userId) return;
    setLoading(true);
    try {
      await saveDiscResults(userId, { disc_profile: profile, disc_scores: scores });
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalsComplete = async (goals: Array<{ category: string; title: string; description: string; deadline: string }>) => {
    if (!userId) return;
    setLoading(true);
    try {
      for (const goal of goals) {
        await createGoal(userId, { ...goal, category: goal.category as import('../types').Goal['category'], priority: 1 });
      }
      await updateUser(userId, { onboarding_completed: 1 });
      const user = await import('../services/api').then(m => m.getUser(userId));
      onComplete(userId, user);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <div className="text-center pt-10 pb-6 px-4">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white text-3xl">🌿</span>
        </div>
        <h1 className="text-3xl font-bold text-emerald-800">LifeTrack</h1>
        <p className="text-gray-500 mt-1">Seu sistema de evolução pessoal</p>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center mb-8 px-4">
        <div className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                i === step ? 'bg-emerald-500 text-white shadow-sm' :
                i < step ? 'bg-emerald-100 text-emerald-700' :
                'bg-gray-100 text-gray-400'
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-white text-emerald-600' : 'bg-gray-300 text-gray-500'
                }`}>{i < step ? '✓' : i + 1}</span>
                {label}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-8 ${i < step ? 'bg-emerald-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-start justify-center px-4 pb-10">
        <div className="w-full max-w-2xl">
          {step === 0 && <ProfileStep onComplete={handleProfileComplete} loading={loading} existing={existingUser} />}
          {step === 1 && <DiscTestStep onComplete={handleDiscComplete} loading={loading} />}
          {step === 2 && <GoalsStep onComplete={handleGoalsComplete} loading={loading} />}
        </div>
      </div>
    </div>
  );
}
