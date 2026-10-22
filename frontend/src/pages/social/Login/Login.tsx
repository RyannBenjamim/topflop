import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "./styles.module.css"
import AuthBox from "../../../components/AuthBox/AuthBox"
import FormField from "../../../components/FormField/FormField"
import Button from "../../../components/Button/Button"
import Alert from "../../../components/Alert/Alert"
import { resendVerification, signin } from "../../../api/auth.service"
import { useAuth } from "../../../hooks/useAuth"
import { getErrorMessage, isRequestError } from "../../../utils/requestError"
import { validateEmail, validatePassword } from "../../../utils/validators"

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ email?: string, password?: string }>({})
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [needsVerification, setNeedsVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setNeedsVerification(false)

    const nextErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    }
    setErrors(nextErrors)
    if (nextErrors.email || nextErrors.password) return

    setIsLoading(true)

    try {
      const response = await signin(form.email.trim(), form.password)
      login(response.access_token)
      navigate('/')
    } catch (error) {
      if (isRequestError(error) && error.errorType === 'EmailNotVerified') {
        setNeedsVerification(true)
        setError('Seu e-mail ainda não foi verificado. Confira sua caixa de entrada.')
      } else {
        setError(getErrorMessage(error))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)

    try {
      const response = await resendVerification(form.email.trim())
      setError('')
      setNeedsVerification(false)
      setInfo(response.message)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthBox
      title="Entrar"
      subtitle="Avalie filmes e descubra o que é Top e o que é Flop."
      footer={<>Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></>}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <FormField
          label="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormField
          label="Senha"
          type="password"
          name="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Link to="/esqueci-senha" className={styles.forgot}>Esqueci minha senha</Link>

        <Alert type="error">
          {error && (
            <>
              <p>{error}</p>
              {needsVerification && (
                <button type="button" className={styles.resend} onClick={handleResend} disabled={isResending}>
                  {isResending ? 'Enviando...' : 'Reenviar e-mail de verificação'}
                </button>
              )}
            </>
          )}
        </Alert>
        <Alert type="success">{info}</Alert>

        <Button type="submit" isLoading={isLoading}>Entrar</Button>
      </form>
    </AuthBox>
  )
}

export default Login
