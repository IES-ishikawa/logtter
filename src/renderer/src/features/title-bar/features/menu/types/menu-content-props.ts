import type { CommandId } from '@common/types'

export type MenuContentProps = {
  label: string
  accelerate?: string
  divide?: boolean
  commandId?: CommandId
  disabled?: boolean
  closeMenu?: () => void
  clickEvent?: () => void
}
