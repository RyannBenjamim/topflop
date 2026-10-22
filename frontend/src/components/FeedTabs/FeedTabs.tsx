import styles from './styles.module.css'
import type { FeedTab } from '../../hooks/useReviewFeed'

const feedTabs: { id: FeedTab, label: string, icon: string }[] = [
  { id: 'recent', label: 'Recentes', icon: 'fa-clock' },
  { id: 'friends', label: 'Amigos', icon: 'fa-user-group' },
]

interface FeedTabsProps {
  active: FeedTab
  onChange: (tab: FeedTab) => void
}

const FeedTabs = ({ active, onChange }: FeedTabsProps) => {
  return (
    <div className={styles.feed_tabs} role="tablist">
      {feedTabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={active === tab.id ? styles.active : undefined}
          onClick={() => onChange(tab.id)}
        >
          <i className={`fa-solid ${tab.icon}`}></i>
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default FeedTabs
