import { useEffect, useMemo, useState } from 'react'
import styles from './styles.module.css'
import Center from '../../../components/Center/Center'
import Spinner from '../../../components/Spinner/Spinner'
import CardMessage from '../../../components/CardMessage/CardMessage'
import UserCard from '../../../components/UserCard/UserCard'
import FollowButton from '../../../components/FollowButton/FollowButton'
import { getFollowing } from '../../../api/follows.service'
import { loadUsers } from '../../../hooks/useUsersDirectory'
import { useAuth } from '../../../hooks/useAuth'
import type { UserSummary } from '../../../types/users'
import { getErrorMessage } from '../../../utils/requestError'

const normalize = (text?: string | null) =>
  (text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const Community = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState<UserSummary[] | null>(null)
  const [followingIds, setFollowingIds] = useState<Set<string> | null>(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!user) return

    loadUsers(true)
      .then(setUsers)
      .catch(error => {
        setUsers([])
        setError(getErrorMessage(error))
      })

    getFollowing(user.id)
      .then(res => setFollowingIds(new Set(res.data.map(item => item.following.id))))
      .catch(() => setFollowingIds(new Set()))
  }, [user])

  const filtered = useMemo(() => {
    if (!users) return []
    const term = normalize(query.trim())

    return users
      .filter(item => item.id !== user?.id)
      .filter(item => !term || normalize(item.name).includes(term) || normalize(item.username).includes(term))
  }, [users, query, user])

  return (
    <div className={styles.users}>
      <Center>
        <h3>Comunidade</h3>
        <p className={styles.subtitle}>Encontre pessoas para seguir e acompanhe as reviews delas.</p>

        <div className={styles.search}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="search"
            placeholder="Buscar por nome ou usuário"
            aria-label="Buscar por nome ou usuário"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className={styles.container}>
          {users === null && <Spinner />}
          {error && <CardMessage text={error} />}
          {users && !error && filtered.length === 0 && (
            <CardMessage text={query ? `Ninguém encontrado para "${query}".` : 'Você é a primeira pessoa por aqui.'} />
          )}
          {filtered.map(item => (
            <UserCard key={item.id} user={item}>
              {followingIds && <FollowButton userId={item.id} isFollowing={followingIds.has(item.id)} />}
            </UserCard>
          ))}
        </div>
      </Center>
    </div>
  )
}

export default Community
