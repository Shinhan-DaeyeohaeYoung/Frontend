import type { ReactNode } from 'react'
import { create } from 'zustand'

interface ModalState {
  isModalOpen: boolean
  modalTitle?: string
  modalCaption?: string
  modalBody?: ReactNode
  modalFooter?: ReactNode
  openModal: (params: {
    title?: string
    caption?: string
    body?: ReactNode
    footer?: ReactNode
  }) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isModalOpen: false,
  modalTitle: undefined,
  modalCaption: undefined,
  modalBody: undefined,
  modalFooter: undefined,

  openModal: ({ title, caption, body, footer }) =>
    set({
      isModalOpen: true,
      modalTitle: title,
      modalCaption: caption,
      modalBody: body,
      modalFooter: footer,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      modalTitle: undefined,
      modalCaption: undefined,
      modalBody: undefined,
      modalFooter: undefined,
    }),
}))
