import { useState } from 'react'
import Button from '../Button/Button'
import { follow, unfollow } from '../../api/follows.service'
import { getErrorMessage } from '../../utils/requestError'

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  onChange?: (isFollowing: boolean) => void
}

const FollowButton = ({ userId, isFollowing, onChange }: FollowButtonProps) => {
  const [following, setFollowing] = useState(isFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)

    try {
      if (following) {
        await unfollow(userId)
      } else {
        await follow(userId)
      }

      setFollowing(!following)
      onChange?.(!following)
    } catch (error) {
      window.alert(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  if (!following) {
    return (
      <Button variant="accent" icon="fa-solid fa-user-plus" onClick={handleClick} isLoading={isLoading}>
        Seguir
      </Button>
    )
  }

  return (
    <Button
      variant={isHovering ? 'danger' : 'outline'}
      icon={isHovering ? 'fa-solid fa-user-minus' : 'fa-solid fa-user-check'}
      onClick={handleClick}
      isLoading={isLoading}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering ? 'Deixar de seguir' : 'Seguindo'}
    </Button>
  )
}

export default FollowButton
