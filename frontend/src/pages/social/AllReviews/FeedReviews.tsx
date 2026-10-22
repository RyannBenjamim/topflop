import { useSearchParams } from 'react-router-dom'
import ReviewsShell from './ReviewsShell'
import Spinner from '../../../components/Spinner/Spinner'
import CardMessage from '../../../components/CardMessage/CardMessage'
import FeedTabs from '../../../components/FeedTabs/FeedTabs'
import FeedEmpty from '../../../components/FeedTabs/FeedEmpty'
import PagedReviews from '../../../components/PagedReviews/PagedReviews'
import { useReviewFeed, type FeedTab } from '../../../hooks/useReviewFeed'

const FeedReviews = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab: FeedTab = searchParams.get('aba') === 'amigos' ? 'friends' : 'recent'
  const { feed, error, followingIds } = useReviewFeed(activeTab)

  const changeTab = (tab: FeedTab) => {
    setSearchParams(tab === 'friends' ? { aba: 'amigos' } : {})
  }

  return (
    <ReviewsShell
      back={{ to: '/', label: 'Voltar para o início' }}
      title="Feed de reviews"
      subtitle="Todas as reviews publicadas no TopFlop, das mais recentes para as mais antigas."
    >
      <FeedTabs active={activeTab} onChange={changeTab} />

      {feed === null && !error && <Spinner />}
      {error && <CardMessage text={error} />}
      {feed && !error && feed.length === 0 && <FeedEmpty tab={activeTab} followingIds={followingIds} />}
      {feed && feed.length > 0 && <PagedReviews key={activeTab} reviews={feed} showMovie showAuthor />}
    </ReviewsShell>
  )
}

export default FeedReviews
