import styles from './styles.module.css'
import Logo from '../../../../../components/Logo/Logo'

const year = new Date().getFullYear()

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Logo size="medium" className={styles.logo} />
      <p className={styles.tmdb}>Dados de filmes fornecidos pelo TMDB</p>
      <a href="https://ryancostaportfolio.netlify.app/" target="_blank" rel="noreferrer">
        <p className={styles.credit}>© {year} - Ryan Costa Benjamim</p>
      </a>
    </footer>
  )
}

export default Footer
