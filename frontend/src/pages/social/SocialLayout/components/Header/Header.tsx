import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import Center from '../../../../../components/Center/Center'
import InputSearch from '../../../../../components/InputSearch/InputSearch'
import Avatar from '../../../../../components/Avatar/Avatar'
import Logo from '../../../../../components/Logo/Logo'
import NotificationBell from '../../../../../components/NotificationBell/NotificationBell'
import ConfirmModal from '../../../../../components/ConfirmModal/ConfirmModal'
import { useAuth } from '../../../../../hooks/useAuth'
import { useNotifications } from '../../../../../hooks/useNotifications'

const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? styles.active : undefined)

const iconClass = ({ isActive }: { isActive: boolean }) => `${styles.icon_link} ${isActive ? styles.active : ''}`

const drawerClass = ({ isActive }: { isActive: boolean }) => `${styles.drawer_link} ${isActive ? styles.active : ''}`

const drawerLinks = [
  { to: '/', label: 'Início', icon: 'fa-solid fa-house', end: true },
  { to: '/busca', label: 'Pesquisar', icon: 'fa-solid fa-magnifying-glass' },
  { to: '/minha-lista', label: 'Minha lista', icon: 'fa-solid fa-bookmark' },
  { to: '/comunidade', label: 'Comunidade', icon: 'fa-solid fa-users' },
  { to: '/notificacoes', label: 'Notificações', icon: 'fa-solid fa-bell' },
  { to: '/perfil', label: 'Meu perfil', icon: 'fa-solid fa-user' },
  { to: '/conta', label: 'Configurações', icon: 'fa-solid fa-gear' }
]

const Header = () => {
  const { profile, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const openLogout = () => {
    setIsMenuOpen(false)
    setIsLogoutOpen(true)
  }

  const badge = unreadCount > 9 ? '9+' : unreadCount

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

          <button
            className={styles.menu_button}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </Center>

      <nav className={styles.mobile_nav}>
        <NavLink className={navClass} to="/minha-lista" aria-label="Minha lista">
          <i className="fa-solid fa-bookmark"></i>
        </NavLink>
        <NavLink className={navClass} to="/busca" aria-label="Pesquisar">
          <i className="fa-solid fa-magnifying-glass"></i>
        </NavLink>
        <NavLink className={navClass} to="/" end aria-label="Início">
          <i className="fa-solid fa-house"></i>
        </NavLink>
        <NavLink className={navClass} to="/notificacoes" aria-label="Notificações">
          <span className={styles.nav_icon}>
            <i className="fa-solid fa-bell"></i>
            {unreadCount > 0 && <span className={styles.badge}>{badge}</span>}
          </span>
        </NavLink>
        <NavLink className={navClass} to="/perfil" aria-label="Meu perfil">
          <i className="fa-solid fa-user"></i>
        </NavLink>
      </nav>

      <div
        className={`${styles.drawer_overlay} ${isMenuOpen ? styles.open : ''}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="mobile-menu"
        className={`${styles.drawer} ${isMenuOpen ? styles.open : ''}`}
        aria-label="Menu"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <div className={styles.drawer_header}>
          <Link to="/perfil" className={styles.drawer_profile} onClick={() => setIsMenuOpen(false)}>
            <Avatar name={displayName} size="small" />
            <div>
              <strong>{displayName}</strong>
              {profile?.username && <span>@{profile.username}</span>}
            </div>
          </Link>
          <button className={styles.menu_button} onClick={() => setIsMenuOpen(false)} aria-label="Fechar menu">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav className={styles.drawer_nav}>
          {drawerLinks.map(link => (
            <NavLink key={link.to} className={drawerClass} to={link.to} end={link.end} onClick={() => setIsMenuOpen(false)}>
              <i className={link.icon}></i>
              <span>{link.label}</span>
              {link.to === '/notificacoes' && unreadCount > 0 && <span className={styles.drawer_badge}>{badge}</span>}
            </NavLink>
          ))}
        </nav>

        <button className={styles.drawer_logout} onClick={openLogout}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Sair</span>
        </button>
      </aside>

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
