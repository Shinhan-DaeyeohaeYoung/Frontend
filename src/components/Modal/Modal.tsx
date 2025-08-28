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
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  caption?: string;
  body?: ReactNode;
  footer?: ReactNode;
  fullscreen?: boolean; // 풀스크린 모드 활성화 옵션
}

const Modal = ({
  open,
  onClose,
  title,
  caption,
  body,
  footer,
  fullscreen = false,
}: BaseModalProps) => {
  if (!open) return null;

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      {/* 백드롭 - 풀스크린일 때는 투명하게 */}
      <Box
        bg={fullscreen ? 'transparent' : 'blackAlpha.600'}
        position="absolute"
        top={fullscreen ? '-16px' : '0'}
        left={fullscreen ? '-16px' : '0'}
        right={fullscreen ? '-16px' : '0'}
        bottom={fullscreen ? '-16px' : '0'}
        zIndex="overlay"
        onClick={onClose}
      />

      {/* 모달 내용물 컨테이너 */}
      <Box
        position="absolute"
        top={fullscreen ? '-16px' : '0'}
        left={fullscreen ? '-16px' : '0'}
        right={fullscreen ? '-16px' : '0'}
        bottom={fullscreen ? '-16px' : '0'}
        zIndex="modal"
        display="flex"
        alignItems={fullscreen ? 'stretch' : 'center'}
        justifyContent={fullscreen ? 'stretch' : 'center'}
      >
        <DialogContent
          rounded={fullscreen ? 'none' : 'xl'}
          my="0"
          mx={fullscreen ? '0' : '6'}
          px={fullscreen ? '6' : '4'}
          pb={fullscreen ? '6' : '4'}
          w={fullscreen ? '100%' : 'auto'}
          h={fullscreen ? '100%' : 'auto'}
          maxW={fullscreen ? 'none' : 'md'}
          maxH={fullscreen ? 'none' : '90vh'}
          overflowY={fullscreen ? 'auto' : 'visible'}
          display="flex"
          flexDirection="column"
        >
          {title && (
            <DialogHeader
              flexDir="column"
              textAlign="center"
              w="full"
              pb={fullscreen ? '4' : '3'}
              flexShrink={0}
            >
              <DialogTitle
                textStyle="modal_title"
                textAlign="center"
                w="full"
                fontSize={fullscreen ? 'xl' : 'lg'}
              >
                {title}
              </DialogTitle>
              {caption && (
                <Text whiteSpace="pre-line" textStyle="caption_xs_light" mt={2}>
                  {caption}
                </Text>
              )}
            </DialogHeader>
          )}

          {body && (
            <DialogBody
              whiteSpace="pre-line"
              textAlign={fullscreen ? 'left' : 'center'}
              flex={fullscreen ? '1' : 'none'}
              overflowY={fullscreen ? 'auto' : 'visible'}
            >
              {body}
            </DialogBody>
          )}

          <DialogFooter flexShrink={0}>{footer}</DialogFooter>

          <DialogCloseTrigger asChild>
            <CloseButton
              size="sm"
              position="absolute"
              top={fullscreen ? '4' : '2'}
              right={fullscreen ? '4' : '2'}
            />
          </DialogCloseTrigger>
        </DialogContent>
      </Box>
    </Dialog.Root>
  );
};

export default Modal;
