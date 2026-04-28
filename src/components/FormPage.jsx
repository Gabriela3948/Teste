import { useEffect, useState } from 'react'
import TextInput from './inputs/TextInput'
import TextArea from './inputs/TextArea'
import SingleSelect from './inputs/SingleSelect'
import MultiSelect from './inputs/MultiSelect'
import RangeSlider from './inputs/RangeSlider'
import SwatchSelect from './inputs/SwatchSelect'

const INPUT_MAP = {
  text:          TextInput,
  textarea:      TextArea,
  single_select: SingleSelect,
  multi_select:  MultiSelect,
  slider:        RangeSlider,
  swatch:        SwatchSelect,
}

export default function FormPage({
  page,
  answers,
  onAnswer,
  onNext,
  onBack,
  isFirst,
  isLast,
  isSubmitting,
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`
        max-w-2xl mx-auto px-4 py-10 md:py-14 transition-all duration-400
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
      `}
    >
      <div className="space-y-5">
        {page.questions.map((question) => {
          const Component = INPUT_MAP[question.type]
          if (!Component) return null

          return (
            <div
              key={question.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-ivory/70"
            >
              <h2 className="font-serif text-2xl md:text-3xl text-obsidian leading-snug mb-1">
                {question.question}
              </h2>
              {question.subtitle && (
                <p className="text-slate text-sm font-sans mb-4 leading-relaxed">
                  {question.subtitle}
                </p>
              )}
              <div className={question.subtitle ? '' : 'mt-3'}>
                <Component
                  question={question}
                  value={answers[question.id]}
                  onChange={(val) => onAnswer(question.id, val)}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-8 px-1">
        {!isFirst ? (
          <button
            onClick={onBack}
            className="text-slate hover:text-obsidian transition-colors text-sm font-medium font-sans flex items-center gap-1.5"
          >
            ← Voltar
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onNext}
          disabled={isSubmitting}
          className="bg-obsidian text-pearl px-8 py-3 rounded-full text-sm font-medium font-sans hover:bg-obsidian/90 transition-all active:scale-[0.97] disabled:opacity-50 tracking-wide"
        >
          {isSubmitting ? 'Enviando...' : isLast ? 'Concluir ✦' : 'Continuar →'}
        </button>
      </div>
    </div>
  )
}
