import styles from './styles/styles.module.css'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import Center from '../../../components/Center/Center'
import Spinner from '../../../components/Spinner/Spinner'
import CardMessage from '../../../components/CardMessage/CardMessage'
import HeaderProfile, { type ProfileStats } from './components/HeaderProfile/HeaderProfile'
import YearHighlights from './components/YearHighlights/YearHighlights'
import { findOne } from '../../../api/users.service'
import { findByAuthor } from '../../../api/reviews.service'
import { findAllByUser as findHighlights } from '../../../api/cinema/highlights.service'
import { findAllByUser as findWatchlist } from '../../../api/cinema/watchlist.service'
import { getFollowers, getFollowing } from '../../../api/follows.service'
import { loadUsers } from '../../../hooks/useUsersDirectory'
import { useAuth } from '../../../hooks/useAuth'
import type { ProfileOutletContext, User } from '../../../types/users'
import { getErrorMessage } from '../../../utils/requestError'

const tabs: { name: string, path: string, count: keyof ProfileStats }[] = [
  { name: 'Reviews', path: '', count: 'reviews' },
  { name: 'Top & Flop', path: 'top-flop', count: 'highlights' },
  { name: 'Lista', path: 'lista', count: 'watchlist' },
  { name: 'Seguidores', path: 'seguidores', count: 'followers' },
  { name: 'Seguindo', path: 'seguindo', count: 'following' },
]

const Profile = () => {
  const { username } = useParams<{ username: string }>()
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [followersVersion, setFollowersVersion] = useState(0)

  useEffect(() => {
    if (!user) return

    let isMounted = true

    async function loadProfile() {
      try {
        setProfileUser(null)
        setStats(null)
        setError('')

        let userId = user!.id

        if (username) {
          const users = await loadUsers()
          const found = users.find(item => item.username.toLowerCase() === username.toLowerCase())
          if (!found) throw new Error('Usuário não encontrado.')
          userId = found.id
        }

        const response = await findOne(userId)
        if (isMounted) setProfileUser(response.data)
      } catch (error) {
        if (isMounted) setError(getErrorMessage(error))
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [user, username])

  const loadStats = useCallback((userId: string) => {
    Promise.all([
      findByAuthor(userId),
      findHighlights(userId),
      findWatchlist(userId),
      getFollowers(userId),
      getFollowing(userId),
    ])
      .then(([reviews, highlights, watchlist, followers, following]) => setStats({
        reviews: reviews.data.length,
        highlights: highlights.data.length,
        watchlist: watchlist.data.length,
        followers: followers.data.length,
        following: following.data.length,
      }))
      .catch(error => console.error('Failed to fetch the profile numbers', error))
  }, [])

  useEffect(() => {
    if (profileUser) loadStats(profileUser.id)
  }, [profileUser, followersVersion, loadStats])

  if (error) {
    return (
      <div className={styles.profile}>
        <Center><CardMessage text={error} /></Center>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className={styles.profile}>
        <Center><Spinner /></Center>
      </div>
    )
  }

  const basePath = username ? `/perfil/${username}` : '/perfil'
  const activeTab = pathname.replace(basePath, '').replace(/^\//, '')

  const context: ProfileOutletContext = {
    profileUser,
    isMyProfile: profileUser.id === user?.id,
    followersVersion,
  }

  return (
    <div className={styles.profile}>
      <Center>
        <HeaderProfile
          profileUser={profileUser}
          isMyProfile={context.isMyProfile}
          stats={stats}
          basePath={basePath}
          onFollowChange={() => setFollowersVersion(version => version + 1)}
        />

        <YearHighlights
          key={profileUser.id}
          userId={profileUser.id}
          displayName={profileUser.name || profileUser.username}
          isMyProfile={context.isMyProfile}
          basePath={basePath}
        />

        <div className={styles.tabs} role="tablist">
          {tabs.map(tab => (
            <Link
              key={tab.path}
              role="tab"
              aria-selected={activeTab === tab.path}
              to={tab.path ? `${basePath}/${tab.path}` : basePath}
              state={{ keepScroll: true }}
              className={activeTab === tab.path ? styles.active : undefined}
            >
              {tab.name}
              {stats && <span>{stats[tab.count]}</span>}
            </Link>
          ))}
        </div>

        <div className={styles.content}>
          <Suspense fallback={<Spinner />}>
            <Outlet context={context} />
          </Suspense>
        </div>
      </Center>
    </div>
  )
}

export default Profile
