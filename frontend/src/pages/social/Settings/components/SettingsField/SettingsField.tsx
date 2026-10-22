import { useState, type FormEvent } from 'react'
import styles from './styles.module.css'
import FormField from '../../../../../components/FormField/FormField'
import Button from '../../../../../components/Button/Button'
import Alert from '../../../../../components/Alert/Alert'
import { getErrorMessage } from '../../../../../utils/requestError'

interface SettingsFieldProps {
  label: string
  initialValue: string
  validate: (value: string) => string
  onSave: (value: string) => Promise<string>
  hint?: string
  multiline?: boolean
  maxLength?: number
}

const SettingsField = ({ label, initialValue, validate, onSave, hint, multiline, maxLength }: SettingsFieldProps) => {
  const [value, setValue] = useState(initialValue)
  const [savedValue, setSavedValue] = useState(initialValue)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSuccess('')

    const validation = validate(value)
    setError(validation)
    if (validation) return

    setIsSaving(true)

    try {
      const saved = await onSave(value.trim())
      setValue(saved)
      setSavedValue(saved)
      setSuccess('Salvo!')
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className={styles.field} onSubmit={handleSubmit} noValidate>
      <FormField
        label={label}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setError('')
          setSuccess('')
        }}
        error={error}
        hint={hint}
        multiline={multiline}
        maxLength={maxLength}
      />
      <div className={styles.footer}>
        <Alert type="success">{success}</Alert>
        <Button type="submit" variant="outline" isLoading={isSaving} disabled={value.trim() === savedValue}>Salvar</Button>
      </div>
    </form>
  )
}

export default SettingsField
