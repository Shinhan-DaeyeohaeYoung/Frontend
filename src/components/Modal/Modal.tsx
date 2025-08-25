import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogCloseTrigger,
    CloseButton,
    Text,
    Box,
  } from "@chakra-ui/react";
  import { AnimatePresence, motion } from "framer-motion";
  import type { ReactNode } from "react";
  
  const MotionBox = motion(Box);
  
  interface BaseModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    caption?: string;
    body?: ReactNode;
    footer?: ReactNode;
  }
  
  const Modal = ({
    open,
    onClose,
    title,
    caption,
    body,
    footer,
  }: BaseModalProps) => {
    return (
      <AnimatePresence>
        {open && (
          <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
            {/* ✨ 1. 백드롭을 MotionBox로 변경하고 애니메이션 속성을 추가합니다. */}
            <MotionBox
              bg="blackAlpha.600"
              position="absolute"
              inset="0"
              zIndex="overlay"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
  
            {/* 모달 내용물 컨테이너 (기존과 동일) */}
            <MotionBox
              position="absolute"
              inset="0"
              zIndex="modal"
              display="flex"
              alignItems="center"
              justifyContent="center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DialogContent rounded="xl" mx="6" px="4">
                {title && (
                  <DialogHeader flexDir="column" textAlign="center" w="full">
                    <DialogTitle textStyle="modal_title" textAlign="center" w="full">
                      {title}
                    </DialogTitle>
                    {caption && (
                      <Text whiteSpace="pre-line" textStyle="caption_xs_light">{caption}</Text>
                    )}
                  </DialogHeader>
                )}
                
                {body && <DialogBody whiteSpace="pre-line" textAlign="center">{body}</DialogBody>}
  
                <DialogFooter>
                  {footer}
                </DialogFooter>
  
                <DialogCloseTrigger asChild>
                  <CloseButton size="sm" />
                </DialogCloseTrigger>
              </DialogContent>
            </MotionBox>
          </Dialog.Root>
        )}
      </AnimatePresence>
    );
  };
  
  export default Modal;