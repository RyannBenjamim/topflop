import { Link } from 'react-router-dom'
import CardMessage from '../CardMessage/CardMessage'
import type { FeedTab } from '../../hooks/useReviewFeed'

interface FeedEmptyProps {
  tab: FeedTab
  followingIds: Set<string> | null
}

const FeedEmpty = ({ tab, followingIds }: FeedEmptyProps) => {
  if (tab === 'recent') {
    return <CardMessage text="Ainda não há reviews no TopFlop. Pesquise um filme e publique a primeira!" />
  }

  if (followingIds?.size === 0) {
    return (
      <CardMessage text="Você ainda não segue ninguém. Siga outras pessoas para ver as reviews delas aqui.">
        <Link to="/comunidade">Encontrar pessoas</Link>
      </CardMessage>
    )
  }

  return (
    <CardMessage text="As pessoas que você segue ainda não publicaram reviews.">
      <Link to="/comunidade">Seguir mais gente</Link>
    </CardMessage>
  )
}

export default FeedEmpty
