import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './styles.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger'
  icon?: string
  isLoading?: boolean
}

const Button = ({
  children,
  variant = 'primary',
  icon,
  isLoading = false,
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading
        ? <i className="fa-solid fa-circle-notch fa-spin"></i>
        : icon && <i className={icon}></i>}
      {children && <span>{children}</span>}
    </button>
  )
}

export default Button
