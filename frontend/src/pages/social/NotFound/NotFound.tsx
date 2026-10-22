import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import Center from '../../../components/Center/Center'
import CardMessage from '../../../components/CardMessage/CardMessage'

const NotFound = () => {
  return (
    <div className={styles.not_found}>
      <Center>
        <h2>404</h2>
        <CardMessage text="Essa página foi um Flop: ela não existe.">
          <Link to="/">Voltar para o início</Link>
        </CardMessage>
      </Center>
    </div>
  )
}

export default NotFound
