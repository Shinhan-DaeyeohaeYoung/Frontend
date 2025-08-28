import type { ReactNode } from 'react';
import { create } from 'zustand';

interface ModalState {
  isModalOpen: boolean;
  modalTitle?: string;
  modalCaption?: string;
  modalBody?: ReactNode;
  modalFooter?: ReactNode;
  modalFullscreen?: boolean;
  openModal: (params: {
    title?: string;
    caption?: string;
    body?: ReactNode;
    footer?: ReactNode;
    fullscreen?: boolean;
  }) => void;
  closeModal: () => void;
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
}));
