import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import styles from "./styles.module.css"
import AuthBox from "../../../components/AuthBox/AuthBox"
import FormField from "../../../components/FormField/FormField"
import Button from "../../../components/Button/Button"
import Alert from "../../../components/Alert/Alert"
import { forgotPassword } from "../../../api/auth.service"
import { getErrorMessage } from "../../../utils/requestError"
import { validateEmail } from "../../../utils/validators"

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')

    const validation = validateEmail(email)
    setEmailError(validation)
    if (validation) return

    setIsLoading(true)

    try {
      const response = await forgotPassword(email.trim())
      setInfo(response.message)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthBox
      title="Esqueci minha senha"
      subtitle="Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha."
      footer={<Link to="/login">Voltar para o login</Link>}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <FormField
          label="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setEmailError('')
          }}
          error={emailError}
        />

        <Alert type="error">{error}</Alert>
        <Alert type="success">{info}</Alert>

        <Button type="submit" isLoading={isLoading}>Enviar link</Button>
      </form>
    </AuthBox>
  )
}

export default ForgotPassword
