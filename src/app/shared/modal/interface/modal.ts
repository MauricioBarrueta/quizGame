export interface Modal {
    icon: string,
    title: string,
    subtitle: string,
    confirmText?: string,
    cancelText?: string,
    onConfirm: () => void,
    onCancel?: () => void
}
