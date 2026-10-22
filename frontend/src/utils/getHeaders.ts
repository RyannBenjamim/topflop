export const getHeaders = () => {
  const storedUser = localStorage.getItem('user_access_data')
  if (!storedUser) return {}

  const { token } = JSON.parse(storedUser)
  return { Authorization: `Bearer ${token}` }
}
