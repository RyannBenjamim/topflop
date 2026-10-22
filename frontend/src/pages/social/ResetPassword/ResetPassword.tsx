import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link, useSearchParams } from "react-router-dom"
import styles from "./styles.module.css"
import AuthBox from "../../../components/AuthBox/AuthBox"
import FormField from "../../../components/FormField/FormField"
import Button from "../../../components/Button/Button"
import Alert from "../../../components/Alert/Alert"
import { resetPassword } from "../../../api/auth.service"
import { getErrorMessage } from "../../../utils/requestError"
import { validatePassword } from "../../../utils/validators"

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState<{ password?: string, confirm?: string }>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return
    setError('')

    const nextErrors = {
      password: validatePassword(form.password),
      confirm: form.confirm !== form.password ? 'As senhas não conferem.' : '',
    }
    setErrors(nextErrors)
    if (nextErrors.password || nextErrors.confirm) return

    setIsLoading(true)

    try {
      const response = await resetPassword(token, form.password)
      setSuccess(response.message)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <AuthBox title="Link inválido" footer={<Link to="/esqueci-senha">Solicitar um novo link</Link>}>
        <Alert type="error">O link de recuperação está incompleto.</Alert>
      </AuthBox>
    )
  }

  if (success) {
    return (
      <AuthBox title="Tudo certo!" footer={<Link to="/login">Ir para o login</Link>}>
        <Alert type="success">{success}</Alert>
      </AuthBox>
    )
  }

  return (
    <AuthBox
      title="Redefinir senha"
      subtitle="Escolha uma nova senha para a sua conta."
      footer={<Link to="/esqueci-senha">Solicitar um novo link</Link>}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <FormField
          label="Nova senha"
          type="password"
          name="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <FormField
          label="Confirmar nova senha"
          type="password"
          name="confirm"
          autoComplete="new-password"
          value={form.confirm}
          onChange={handleChange}
          error={errors.confirm}
        />

        <Alert type="error">{error}</Alert>

        <Button type="submit" isLoading={isLoading}>Redefinir senha</Button>
      </form>
    </AuthBox>
  )
}

export default ResetPassword
