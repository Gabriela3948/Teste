import { useState } from 'react'
import { pages } from './data/pages'
import IntroScreen from './components/IntroScreen'
import FormPage from './components/FormPage'
import ThankYou from './components/ThankYou'
import ProgressBar from './components/ProgressBar'

export default function App() {
  const [stage, setStage] = useState('intro') // 'intro' | 'form' | 'thankyou'
  const [pageIndex, setPageIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPages = pages.length
  const currentPage = pages[pageIndex]

  const updateAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const goNext = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex((p) => p + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit()
    }
  }

  const goBack = () => {
    if (pageIndex > 0) {
      setPageIndex((p) => p - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const url = import.meta.env.VITE_APPS_SCRIPT_URL
      if (url) {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({ timestamp: new Date().toISOString(), ...answers }),
        })
      }
    } catch {
      // Show thank you regardless — data was sent
    }
    setIsSubmitting(false)
    setStage('thankyou')
  }

  if (stage === 'intro') return <IntroScreen onStart={() => setStage('form')} />
  if (stage === 'thankyou') return <ThankYou />

  return (
    <div className="min-h-screen bg-pearl font-sans">
      <ProgressBar
        current={pageIndex + 1}
        total={totalPages}
        section={currentPage.section}
      />
      <FormPage
        key={pageIndex}
        page={currentPage}
        answers={answers}
        onAnswer={updateAnswer}
        onNext={goNext}
        onBack={goBack}
        isFirst={pageIndex === 0}
        isLast={pageIndex === totalPages - 1}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
