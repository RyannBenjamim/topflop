import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link } from "react-router-dom"
import styles from "./styles.module.css"
import AuthBox from "../../../components/AuthBox/AuthBox"
import FormField from "../../../components/FormField/FormField"
import Button from "../../../components/Button/Button"
import Alert from "../../../components/Alert/Alert"
import { register, resendVerification } from "../../../api/auth.service"
import { getErrorMessage } from "../../../utils/requestError"
import {
  validateEmail,
  validateName,
  validatePassword,
  validateUsername,
} from "../../../utils/validators"

const emptyForm = { name: '', username: '', email: '', password: '', confirm: '' }

type FormKey = keyof typeof emptyForm

const SignUp = () => {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<FormKey, string>>>({})
  const [error, setError] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [info, setInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FormKey
    setForm(current => ({ ...current, [name]: e.target.value }))
    setErrors(current => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const nextErrors = {
      name: validateName(form.name),
      username: validateUsername(form.username),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirm: form.confirm !== form.password ? 'As senhas não conferem.' : '',
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setIsLoading(true)

    try {
      await register({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      setRegisteredEmail(form.email.trim())
      setForm(emptyForm)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setInfo('')

    try {
      const response = await resendVerification(registeredEmail)
      setInfo(response.message)
    } catch (error) {
      setInfo(getErrorMessage(error))
    } finally {
      setIsResending(false)
    }
  }

  if (registeredEmail) {
    return (
      <AuthBox
        title="Confirme seu e-mail"
        subtitle={<>Enviamos um link de verificação para <strong>{registeredEmail}</strong>. Abra o e-mail para ativar sua conta.</>}
        footer={<>Já confirmou? <Link to="/login">Entrar</Link></>}
      >
        <Alert type="info">{info}</Alert>
        <Button variant="outline" onClick={handleResend} isLoading={isResending}>
          Reenviar e-mail de verificação
        </Button>
      </AuthBox>
    )
  }

  return (
    <AuthBox
      title="Criar conta"
      subtitle="Publique reviews, monte sua lista e escolha o Top e o Flop do ano."
      footer={<>Já tem conta? <Link to="/login">Entrar</Link></>}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <FormField label="Nome" name="name" autoComplete="name" value={form.name} onChange={handleChange} error={errors.name} />
        <FormField
          label="Usuário"
          name="username"
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          hint="Letras, números e _ (3 a 30 caracteres)."
        />
        <FormField label="E-mail" type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} error={errors.email} />
        <FormField label="Senha" type="password" name="password" autoComplete="new-password" value={form.password} onChange={handleChange} error={errors.password} />
        <FormField label="Confirmar senha" type="password" name="confirm" autoComplete="new-password" value={form.confirm} onChange={handleChange} error={errors.confirm} />

        <Alert type="error">{error}</Alert>

        <Button type="submit" variant="accent" isLoading={isLoading}>Criar conta</Button>
      </form>
    </AuthBox>
  )
}

export default SignUp
