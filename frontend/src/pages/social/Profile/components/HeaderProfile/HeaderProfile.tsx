import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import Avatar from '../../../../../components/Avatar/Avatar'
import FollowButton from '../../../../../components/FollowButton/FollowButton'
import { checkStatus } from '../../../../../api/follows.service'
import type { User } from '../../../../../types/users'

export interface ProfileStats {
  reviews: number
  highlights: number
  watchlist: number
  followers: number
  following: number
}

interface HeaderProfileProps {
  profileUser: User
  isMyProfile: boolean
  stats: ProfileStats | null
  basePath: string
  onFollowChange: () => void
}

const memberSince = (date: string) =>
  new Date(date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

const HeaderProfile = ({ profileUser, isMyProfile, stats, basePath, onFollowChange }: HeaderProfileProps) => {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null)

  useEffect(() => {
    if (isMyProfile) return

    checkStatus(profileUser.id)
      .then(res => setIsFollowing(res.data.isFollowing))
      .catch(() => setIsFollowing(false))
  }, [profileUser.id, isMyProfile])

  const displayName = profileUser.name || profileUser.username

  return (
    <header className={styles.header}>
      <Avatar name={displayName} size="large" />

      <div className={styles.info}>
        <div className={styles.title_row}>
          <div>
            <h1>{displayName}</h1>
            <p className={styles.username}>@{profileUser.username}</p>
          </div>

          {isMyProfile && (
            <Link to="/conta" className={styles.edit}>
              <i className="fa-solid fa-gear"></i> Editar perfil
            </Link>
          )}

          {!isMyProfile && isFollowing !== null && (
            <FollowButton
              key={profileUser.id}
              userId={profileUser.id}
              isFollowing={isFollowing}
              onChange={(value) => {
                setIsFollowing(value)
                onFollowChange()
              }}
            />
          )}
        </div>

        <p className={styles.bio}>
          {profileUser.bio || (isMyProfile ? 'Você ainda não escreveu uma bio.' : 'Sem bio.')}
        </p>

        <div className={styles.stats}>
          <Link to={basePath}><strong>{stats?.reviews ?? '–'}</strong> reviews</Link>
          <Link to={`${basePath}/seguidores`}><strong>{stats?.followers ?? '–'}</strong> seguidores</Link>
          <Link to={`${basePath}/seguindo`}><strong>{stats?.following ?? '–'}</strong> seguindo</Link>
        </div>

        <p className={styles.since}>No TopFlop desde {memberSince(profileUser.createdAt)}</p>
      </div>
    </header>
  )
}

export default HeaderProfile
