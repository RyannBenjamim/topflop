import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import Center from '../../../../../components/Center/Center'
import InputSearch from '../../../../../components/InputSearch/InputSearch'
import Avatar from '../../../../../components/Avatar/Avatar'
import Logo from '../../../../../components/Logo/Logo'
import NotificationBell from '../../../../../components/NotificationBell/NotificationBell'
import ConfirmModal from '../../../../../components/ConfirmModal/ConfirmModal'
import { useAuth } from '../../../../../hooks/useAuth'

const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? styles.active : undefined)

const iconClass = ({ isActive }: { isActive: boolean }) => `${styles.icon_link} ${isActive ? styles.active : ''}`

const Header = () => {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const displayName = profile?.name || profile?.username

  return (
    <header className={styles.header}>
      <Center>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <Logo size="small" />
          </Link>

          <div className={styles.input}>
            <InputSearch text="Pesquise por um filme" width="100%" />
          </div>

          <nav className={styles.desktop_nav}>
            <ul>
              <li>
                <NavLink className={iconClass} to="/comunidade" title="Comunidade" aria-label="Comunidade">
                  <i className="fa-solid fa-users"></i>
                </NavLink>
              </li>
              <li>
                <NavLink className={iconClass} to="/minha-lista" title="Minha lista" aria-label="Minha lista">
                  <i className="fa-solid fa-bookmark"></i>
                </NavLink>
              </li>
              <li><NotificationBell className={styles.bell} /></li>
              <li>
                <Link className={styles.profile} to="/perfil" title="Meu perfil">
                  <Avatar name={displayName} size="small" />
                </Link>
              </li>
              <li>
                <button className={styles.logout} onClick={() => setIsLogoutOpen(true)} title="Sair">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </li>
            </ul>
          </nav>

          <div className={styles.mobile_actions}>
            <NotificationBell />
            <button className={`${styles.logout} ${styles.mobile_logout}`} onClick={() => setIsLogoutOpen(true)} title="Sair" aria-label="Sair">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </Center>

      <nav className={styles.mobile_nav}>
        <NavLink className={navClass} to="/" end aria-label="Início">
          <i className="fa-solid fa-house"></i>
        </NavLink>
        <NavLink className={navClass} to="/busca" aria-label="Pesquisar">
          <i className="fa-solid fa-magnifying-glass"></i>
        </NavLink>
        <NavLink className={navClass} to="/minha-lista" aria-label="Minha lista">
          <i className="fa-solid fa-bookmark"></i>
        </NavLink>
        <NavLink className={navClass} to="/comunidade" aria-label="Comunidade">
          <i className="fa-solid fa-users"></i>
        </NavLink>
        <NavLink className={navClass} to="/perfil" aria-label="Meu perfil">
          <i className="fa-solid fa-user"></i>
        </NavLink>
      </nav>

      <ConfirmModal
        open={isLogoutOpen}
        icon="fa-solid fa-arrow-right-from-bracket"
        title="Sair da conta?"
        message="Você vai precisar entrar de novo para avaliar filmes e ver suas notificações."
        confirmText="Sair"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutOpen(false)}
      />
    </header>
  )
}

export default Header
