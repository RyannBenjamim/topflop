import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import Center from '../../../components/Center/Center'
import Spinner from '../../../components/Spinner/Spinner'
import Button from '../../../components/Button/Button'
import Alert from '../../../components/Alert/Alert'
import SettingsField from './components/SettingsField/SettingsField'
import { remove, updateBio, updateName, updateUsername } from '../../../api/users.service'
import { invalidateUsers } from '../../../hooks/useUsersDirectory'
import { useAuth } from '../../../hooks/useAuth'
import { getErrorMessage, isRequestError } from '../../../utils/requestError'
import { validateBio, validateNameUpdate, validateUsername } from '../../../utils/validators'

const Settings = () => {
  const { user, profile, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const saveName = async (name: string) => {
    const response = await updateName(name)
    updateProfile(response.data)
    invalidateUsers()
    return response.data.name ?? ''
  }

  const saveUsername = async (username: string) => {
    try {
      const response = await updateUsername(username)
      updateProfile(response.data)
      invalidateUsers()
      return response.data.username
    } catch (error) {
      if (isRequestError(error) && error.errorCode === 'UNIQUE_CONSTRAINT') {
        throw new Error('Esse nome de usuário já está em uso.')
      }
      throw error
    }
  }

  const saveBio = async (bio: string) => {
    const response = await updateBio(bio)
    updateProfile(response.data)
    return response.data.bio ?? ''
  }

  const handleDelete = async () => {
    if (!user || !profile) return

    const confirmation = window.prompt(`Para excluir sua conta, digite seu usuário (${profile.username}):`)
    if (confirmation === null) return

    if (confirmation.trim() !== profile.username) {
      setDeleteError('O usuário digitado não confere. Nada foi excluído.')
      return
    }

    setIsDeleting(true)
    setDeleteError('')

    try {
      await remove(user.id)
      invalidateUsers()
      logout()
      navigate('/login', { replace: true })
    } catch (error) {
      setDeleteError(isRequestError(error) && error.errorCode === 'FOREIGN_KEY_CONSTRAINT'
        ? 'A API não permite excluir uma conta que ainda tem reviews, comentários, curtidas, seguidores ou itens na lista.'
        : getErrorMessage(error))
      setIsDeleting(false)
    }
  }

  return (
    <div className={styles.settings}>
      <Center>
        <div className={styles.top}>
          <h3>Editar perfil</h3>
          <Link to="/perfil"><i className="fa-solid fa-angle-left"></i> Voltar ao perfil</Link>
        </div>

        {!profile ? (
          <Spinner />
        ) : (
          <>
            <section className={styles.card}>
              <SettingsField
                label="Nome"
                initialValue={profile.name ?? ''}
                validate={validateNameUpdate}
                onSave={saveName}
                maxLength={50}
                hint="Na edição, a API só aceita letras, números e _ (3 a 50 caracteres)."
              />
              <SettingsField
                label="Usuário"
                initialValue={profile.username}
                validate={validateUsername}
                onSave={saveUsername}
                maxLength={30}
                hint="Letras, números e _ (3 a 30 caracteres)."
              />
              <SettingsField
                label="Bio"
                initialValue={profile.bio ?? ''}
                validate={validateBio}
                onSave={saveBio}
                multiline
                maxLength={300}
              />
            </section>

            <section className={`${styles.card} ${styles.danger}`}>
              <div>
                <h4>Excluir conta</h4>
                <p>Remove sua conta do TopFlop de forma permanente.</p>
              </div>
              <Alert type="error">{deleteError}</Alert>
              <Button variant="danger" icon="fa-solid fa-trash" onClick={handleDelete} isLoading={isDeleting}>
                Excluir minha conta
              </Button>
            </section>
          </>
        )}
      </Center>
    </div>
  )
}

export default Settings
