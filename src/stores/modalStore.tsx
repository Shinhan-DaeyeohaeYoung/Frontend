import type { ReactNode } from 'react'
import { create } from 'zustand'

interface ModalState {
  isModalOpen: boolean
  modalTitle?: string
  modalCaption?: string
  modalBody?: ReactNode
  modalFooter?: ReactNode
  modalFullscreen?: boolean // 풀스크린 모드 옵션 추가
  openModal: (params: {
    title?: string
    caption?: string
    body?: ReactNode
    footer?: ReactNode
    fullscreen?: boolean // 풀스크린 모드 파라미터 추가
  }) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isModalOpen: false,
  modalTitle: undefined,
  modalCaption: undefined,
  modalBody: undefined,
  modalFooter: undefined,
  modalFullscreen: false,

  openModal: ({ title, caption, body, footer, fullscreen = false }) =>
    set({
      isModalOpen: true,
      modalTitle: title,
      modalCaption: caption,
      modalBody: body,
      modalFooter: footer,
      modalFullscreen: fullscreen,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      modalTitle: undefined,
      modalCaption: undefined,
      modalBody: undefined,
      modalFooter: undefined,
      modalFullscreen: false,
    }),
}))