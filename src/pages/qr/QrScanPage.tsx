import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';

const QrScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | undefined>(undefined);

  const startCamera = async () => {
    setError(null);
    setResult(null);
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        scanFrame();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '카메라를 시작할 수 없어요.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsScanning(false);
  };

  const scanFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code?.data) {
      setResult(code.data);
      stopCamera();

      // QR 스캔 성공 시 바로 해당 링크로 이동
      handleQRResult(code.data);
      return;
    }
    rafRef.current = requestAnimationFrame(scanFrame);
  };

  // QR 결과 처리 및 이동
  const handleQRResult = (qrData: string) => {
    try {
      // URL인지 확인
      if (qrData.startsWith('http://') || qrData.startsWith('https://')) {
        // localhost URL인 경우 경로만 추출해서 이동 (새 창 열기 방지)
        if (qrData.includes('localhost:5173')) {
          const url = new URL(qrData);
          navigate(url.pathname + url.search);
        } else {
          // 외부 URL인 경우에만 새 탭에서 열기
          window.open(qrData, '_blank');
        }
      } else if (qrData.startsWith('/')) {
        // 내부 경로인 경우 React Router로 이동
        navigate(qrData);
      } else {
        // 일반 텍스트인 경우 콘솔에 출력
        console.log('QR 스캔 결과:', qrData);
      }
    } catch (error) {
      console.error('QR 결과 처리 중 오류:', error);
    }
  };

  useEffect(() => () => stopCamera(), []);

  return (
    <Flex justify="center" p={4}>
      <Box minW="100%" border="1px dashed" borderColor="gray.300" rounded="md" p={4} bg="white">
        <Heading size="md" mb={4}>
          QR 스캔하기
        </Heading>

        <Box
          position="relative"
          w="100%"
          pb="100%"
          border="1px solid"
          borderColor="gray.300"
          rounded="md"
          overflow="hidden"
          mb={3}
        >
          <video
            ref={videoRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            playsInline
            muted
          />

          {/* 스캔 영역 가이드 */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="250px"
            h="250px"
            border="2px dashed"
            borderColor="red.400"
            rounded="md"
            pointerEvents="none"
          />
          <Text
            position="absolute"
            top="calc(50% + 140px)" // 50% + (가이드 박스 높이 250px의 절반 125px + 여유 15px)
            left="50%"
            transform="translateX(-50%)"
            fontSize="sm"
            fontWeight="semibold"
            color="white"
            bg="blackAlpha.600"
            px={3}
            py={1}
            rounded="md"
            pointerEvents="none"
          >
            빨간 박스 안에 QR을 맞춰주세요
          </Text>
          {/* 스캐닝 상태 표시 */}
          {isScanning && (
            <Box
              position="absolute"
              top="10px"
              left="10px"
              bg="green.500"
              color="white"
              px={2}
              py={1}
              rounded="md"
              fontSize="xs"
            >
              jsQR 스캐닝 중...
            </Box>
          )}
        </Box>

        <Stack gap={3} mb={4}>
          <HStack justify="space-between">
            <Button size="sm" onClick={startCamera} disabled={isScanning} bgColor={'accent.500'}>
              {isScanning ? '스캐닝 중' : '카메라 시작'}
            </Button>
            <Button size="sm" variant="outline" onClick={stopCamera} disabled={!isScanning}>
              중지
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setResult(null);
                setError(null);
                console.log('스캐너 리셋');
              }}
            >
              초기화
            </Button>
          </HStack>
        </Stack>

        {error ? (
          <Text fontSize="sm" color="red.500">
            {error}
          </Text>
        ) : (
          <>
            <Text fontSize="sm" color="gray.600">
              태블릿의 QR을 인식해주세요! <br />
              *권한 설정 – 카메라 허용 해주세요 <br />
              *jsQR 라이브러리 사용 중
            </Text>
            {result && (
              <Box mt={3} p={2} border="1px solid" borderColor="gray.200" rounded="md" bg="gray.50">
                <Text fontSize="xs" wordBreak="break-all">
                  스캔 텍스트: {result}
                </Text>
                <Button size="sm" mt={2} onClick={() => handleQRResult(result)} colorScheme="blue">
                  링크로 이동하기
                </Button>
              </Box>
            )}
          </>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Box>
    </Flex>
  );
};

export default QrScanPage;
