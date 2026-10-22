import { useEffect, useRef, type MouseEvent } from 'react'
import styles from './styles.module.css'
import Button from '../Button/Button'

interface ConfirmModalProps {
  open: boolean
  title: string
  message?: string
  icon?: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger'
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal = ({
  open,
  title,
  message,
  icon,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const dialog = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const element = dialog.current
    if (!element) return

    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
  }, [open])

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialog.current) onCancel()
  }

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="confirm-modal-title"
      onCancel={event => {
        event.preventDefault()
        onCancel()
      }}
      onClick={handleClick}
    >
      <div className={styles.box}>
        {icon && (
          <span className={`${styles.icon} ${styles[variant]}`}>
            <i className={icon}></i>
          </span>
        )}

        <h3 id="confirm-modal-title">{title}</h3>
        {message && <p>{message}</p>}

        <div className={styles.actions}>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>{cancelText}</Button>
          <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>{confirmText}</Button>
        </div>
      </div>
    </dialog>
  )
}

export default ConfirmModal
