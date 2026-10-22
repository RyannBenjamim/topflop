import { useEffect, useRef, useState, type FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import styles from "./styles.module.css"
import AuthBox from "../../../components/AuthBox/AuthBox"
import FormField from "../../../components/FormField/FormField"
import Button from "../../../components/Button/Button"
import Alert from "../../../components/Alert/Alert"
import Spinner from "../../../components/Spinner/Spinner"
import { resendVerification, verifyEmail } from "../../../api/auth.service"
import { getErrorMessage } from "../../../utils/requestError"
import { validateEmail } from "../../../utils/validators"

type Status = 'loading' | 'success' | 'error'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'error')
  const [message, setMessage] = useState(token ? '' : 'O link de verificação está incompleto.')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  const [isResending, setIsResending] = useState(false)
  const requested = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token || requested.current) return
    requested.current = true

    verifyEmail(token)
      .then(res => {
        setStatus('success')
        setMessage(res.message)
      })
      .catch(error => {
        setStatus('error')
        setMessage(getErrorMessage(error))
      })
  }, [token])

  const handleResend = async (e: FormEvent) => {
    e.preventDefault()

    const validation = validateEmail(email)
    setEmailError(validation)
    if (validation) return

    setIsResending(true)
    setResendMessage('')

    try {
      const response = await resendVerification(email.trim())
      setResendMessage(response.message)
    } catch (error) {
      setEmailError(getErrorMessage(error))
    } finally {
      setIsResending(false)
    }
  }

  if (status === 'loading') {
    return (
      <AuthBox title="Verificando e-mail">
        <Spinner />
      </AuthBox>
    )
  }

  if (status === 'success') {
    return (
      <AuthBox title="E-mail verificado!" subtitle="Sua conta está pronta para avaliar filmes.">
        <Alert type="success">{message}</Alert>
        <div className={styles.login}>
          <Button icon="fa-solid fa-right-to-bracket" onClick={() => navigate('/login')}>Ir para o login</Button>
        </div>
      </AuthBox>
    )
  }

  return (
    <AuthBox title="Não foi possível verificar" footer={<Link to="/login">Voltar para o login</Link>}>
      <Alert type="error">{message}</Alert>

      <form className={styles.form} onSubmit={handleResend} noValidate>
        <FormField
          label="Receber um novo link"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        <Alert type="success">{resendMessage}</Alert>
        <Button type="submit" variant="outline" isLoading={isResending}>Reenviar link</Button>
      </form>
    </AuthBox>
  )
}

export default VerifyEmail
