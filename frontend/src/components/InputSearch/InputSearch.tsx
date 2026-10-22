import { useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'

interface InputSearchProps {
  text: string
  width: string
  initialValue?: string
}

const InputSearch = ({ text, width, initialValue = '' }: InputSearchProps) => {
  const [name, setName] = useState(initialValue)
  const navigate = useNavigate()

  const search = () => {
    const query = name.trim()
    if (query) navigate(`/busca?q=${encodeURIComponent(query)}`)
  }

  const keydownEvent = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') search()
  }

  return (
    <div style={{ width }} className={styles.search}>
      <input
        type="text"
        placeholder={text}
        aria-label={text}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={keydownEvent}
      />
      <button onClick={search} aria-label="Pesquisar">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  )
}

export default InputSearch
