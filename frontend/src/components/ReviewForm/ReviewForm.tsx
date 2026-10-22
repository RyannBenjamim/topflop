import { useState, type ChangeEvent, type FormEvent } from 'react'
import styles from './styles.module.css'
import FormField from '../FormField/FormField'
import Button from '../Button/Button'
import Alert from '../Alert/Alert'
import TopBadge from '../TopBadge/TopBadge'
import type { ReviewFormValues } from '../../types/reviews'
import { validateReview, type ReviewFormErrors } from '../../utils/validators'
import { getErrorMessage } from '../../utils/requestError'

interface ReviewFormProps {
  initialValues?: Partial<ReviewFormValues>
  onSubmit: (values: ReviewFormValues) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
}

const defaultValues: ReviewFormValues = { title: '', content: '', topPercentage: 50 }

const ReviewForm = ({ initialValues, onSubmit, onCancel, submitLabel = 'Publicar review' }: ReviewFormProps) => {
  const [form, setForm] = useState<ReviewFormValues>({ ...defaultValues, ...initialValues })
  const [errors, setErrors] = useState<ReviewFormErrors>({})
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(current => ({ ...current, [name]: name === 'topPercentage' ? Number(value) : value }))
    setErrors(current => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const nextErrors = validateReview(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSaving(true)

    try {
      await onSubmit({
        title: form.title.trim(),
        content: form.content.trim(),
        topPercentage: form.topPercentage,
      })
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <FormField
        label="Título"
        name="title"
        maxLength={120}
        placeholder="Resuma sua opinião em uma frase"
        value={form.title}
        onChange={handleChange}
        error={errors.title}
      />

      <div className={styles.score}>
        <label htmlFor="review-top">Quanto esse filme é Top?</label>
        <div className={styles.range}>
          <input
            id="review-top"
            type="range"
            name="topPercentage"
            min={1}
            max={100}
            value={form.topPercentage}
            onChange={handleChange}
          />
          <TopBadge value={form.topPercentage} />
        </div>
        {errors.topPercentage && <p className={styles.error}>{errors.topPercentage}</p>}
      </div>

      <FormField
        label="Review"
        name="content"
        multiline
        maxLength={5000}
        placeholder="O que funcionou, o que não funcionou e por quê?"
        value={form.content}
        onChange={handleChange}
        error={errors.content}
        hint={`${form.content.trim().length}/5000 caracteres (mínimo 20)`}
      />

      <Alert type="error">{error}</Alert>

      <div className={styles.actions}>
        {onCancel && <Button variant="ghost" onClick={onCancel} disabled={isSaving}>Cancelar</Button>}
        <Button type="submit" isLoading={isSaving}>{submitLabel}</Button>
      </div>
    </form>
  )
}

export default ReviewForm
