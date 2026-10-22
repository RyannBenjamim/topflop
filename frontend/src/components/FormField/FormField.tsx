import { useId, type ChangeEvent } from 'react'
import styles from './styles.module.css'

interface FormFieldProps {
  label?: string
  name?: string
  type?: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder?: string
  error?: string
  hint?: string
  multiline?: boolean
  maxLength?: number
  autoComplete?: string
}

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  hint,
  multiline = false,
  maxLength,
  autoComplete,
}: FormFieldProps) => {
  const id = useId()

  return (
    <div className={styles.field}>
      {label && <label htmlFor={id}>{label}</label>}

      {multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={error ? styles.invalid : undefined}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={error ? styles.invalid : undefined}
          aria-invalid={Boolean(error)}
        />
      )}

      {error
        ? <p className={styles.error}>{error}</p>
        : hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}

export default FormField
