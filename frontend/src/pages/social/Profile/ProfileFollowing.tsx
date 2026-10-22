import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import styles from './styles/profile-following.module.css'
import UserCard from '../../../components/UserCard/UserCard'
import CardMessage from '../../../components/CardMessage/CardMessage'
import Spinner from '../../../components/Spinner/Spinner'
import { getFollowing } from '../../../api/follows.service'
import type { Following } from '../../../types/follows'
import type { ProfileOutletContext } from '../../../types/users'
import { formatRelativeTime } from '../../../utils/formatRelativeTime'

const ProfileFollowing = () => {
  const { profileUser } = useOutletContext<ProfileOutletContext>()
  const [following, setFollowing] = useState<Following[] | null>(null)

  useEffect(() => {
    getFollowing(profileUser.id)
      .then(res => setFollowing(res.data))
      .catch(() => setFollowing([]))
  }, [profileUser.id])

  if (!following) return <Spinner />

  if (following.length === 0) return <CardMessage text="Ainda não segue ninguém." />

  return (
    <div className={styles.list}>
      {following.map(item => (
        <UserCard key={item.following.id} user={item.following} subtitle={`desde ${formatRelativeTime(item.createdAt)}`} />
      ))}
    </div>
  )
}

export default ProfileFollowing
