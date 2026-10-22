import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import styles from './styles/profile-followers.module.css'
import UserCard from '../../../components/UserCard/UserCard'
import CardMessage from '../../../components/CardMessage/CardMessage'
import Spinner from '../../../components/Spinner/Spinner'
import { getFollowers } from '../../../api/follows.service'
import type { Follower } from '../../../types/follows'
import type { ProfileOutletContext } from '../../../types/users'
import { formatRelativeTime } from '../../../utils/formatRelativeTime'

const ProfileFollowers = () => {
  const { profileUser, followersVersion } = useOutletContext<ProfileOutletContext>()
  const [followers, setFollowers] = useState<Follower[] | null>(null)

  useEffect(() => {
    getFollowers(profileUser.id)
      .then(res => setFollowers(res.data))
      .catch(() => setFollowers([]))
  }, [profileUser.id, followersVersion])

  if (!followers) return <Spinner />

  if (followers.length === 0) return <CardMessage text="Nenhum seguidor ainda." />

  return (
    <div className={styles.list}>
      {followers.map(item => (
        <UserCard key={item.follower.id} user={item.follower} subtitle={`desde ${formatRelativeTime(item.createdAt)}`} />
      ))}
    </div>
  )
}

export default ProfileFollowers
