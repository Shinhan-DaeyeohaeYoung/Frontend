import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Heading, HStack, Icon, Select, Stack, Text } from '@chakra-ui/react';
import { RiCameraLine, RiRefreshLine, RiCloseCircleLine } from 'react-icons/ri';
import { toaster } from '@/components/ui/toaster';

type MediaDeviceInfoLite = Pick<MediaDeviceInfo, 'deviceId' | 'label' | 'kind'>;

type QRResult = {
  rawValue: string;
  format?: string;
};

declare global {
  interface Window {
    BarcodeDetector?: any;
  }
}

const SUPPORTS_BARCODE_DETECTOR = typeof window !== 'undefined' && !!window.BarcodeDetector;

const QRScanPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<any | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfoLite[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<QRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(
    async (deviceId?: string) => {
      try {
        setError(null);
        setResult(null);

        // stop previous
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }

        const constraints: MediaStreamConstraints = {
          video: deviceId
            ? { deviceId: { exact: deviceId } }
            : { facingMode: { ideal: 'environment' } },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        setHasPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // enumerate devices after permission
        const all = await navigator.mediaDevices.enumerateDevices();
        const cams = all.filter((d) => d.kind === 'videoinput') as MediaDeviceInfoLite[];
        setDevices(cams);
        if (!deviceId && cams.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(cams[0].deviceId);
        }

        // detector
        if (SUPPORTS_BARCODE_DETECTOR) {
          detectorRef.current = new window.BarcodeDetector({
            formats: ['qr_code'],
          });
          loopDetect(); // kick-off
        } else {
          const msg =
            '이 브라우저는 BarcodeDetector를 지원하지 않습니다. 최신 크롬/엣지 또는 안드로이드 크롬을 사용하세요.';
          setError(msg);
          toaster.create({ description: msg, type: 'warning', closable: true });
        }
      } catch (err: any) {
        const name = err?.name || '';
        if (name === 'NotAllowedError' || name === 'SecurityError') {
          setHasPermission(false);
          const msg =
            '카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 접근을 허용해 주세요.';
          setError(msg);
          toaster.error({ title: '권한 필요', description: msg, closable: true });
        } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
          const msg = '카메라 장치를 찾을 수 없습니다.';
          setError(msg);
          toaster.error({ title: '장치 없음', description: msg });
        } else {
          const msg = '카메라를 시작하는 중 오류가 발생했습니다.';
          setError(msg);
          toaster.error({ title: '오류', description: msg });
        }
      }
    },
    [selectedDeviceId]
  );

  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const loopDetect = useCallback(() => {
    const tick = async () => {
      try {
        const video = videoRef.current;
        const detector = detectorRef.current;
        if (video && detector && !video.paused && !video.ended) {
          const barcodes = await detector.detect(video);
          if (barcodes?.length) {
            const first = barcodes[0];
            setResult({ rawValue: first.rawValue, format: first.format });

            // ✅ 공식 문서 방식의 토스트
            toaster.success({
              title: 'QR 인식 성공',
              description: first.rawValue,
            });

            // 진동 피드백 (옵션)
            if (navigator.vibrate) navigator.vibrate(150);

            // 필요 시: stopCamera(); return;
          }
        }
      } catch {
        // ignore transient errors
      } finally {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleDeviceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedDeviceId(id);
    await startCamera(id);
  };

  return (
    <Flex justify="center" p={4}>
      <Box
        w="360px"
        border="1px dashed"
        borderColor="gray.300"
        _dark={{ borderColor: 'whiteAlpha.300' }} // ✅ hook 없이 다크 지원
        rounded="md"
        p={4}
        bg="white"
        // _dark={{ bg: 'gray.800' }}
      >
        <Heading size="md" mb={4}>
          QR 스캔하기
        </Heading>

        {/* Camera preview (square) */}
        <Box
          position="relative"
          w="100%"
          pb="100%"
          border="1px solid"
          borderColor="gray.300"
          _dark={{ borderColor: 'whiteAlpha.300' }}
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
          {/* overlay guide */}
          <Box
            pointerEvents="none"
            position="absolute"
            inset={0}
            border="2px dashed"
            borderColor="blackAlpha.400"
            _dark={{ borderColor: 'whiteAlpha.400' }}
            rounded="md"
          />
        </Box>

        {/* Controls */}
        <Stack gap={3} mb={4}>
          <HStack justify="space-between">
            <Button
              size="sm"
              onClick={() => startCamera(selectedDeviceId)}
              // leftIcon={<Icon as={RiCameraLine} />}
              colorScheme="blue"
            >
              카메라 시작
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={stopCamera}
              // leftIcon={<Icon as={RiCloseCircleLine} />}
            >
              중지
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setResult(null);
                setError(null);
                toaster.create({ description: '스캐너 리셋', type: 'info' });
              }}
              // leftIcon={<Icon as={RiRefreshLine} />}
            >
              초기화
            </Button>
          </HStack>

          {/* camera selector */}
          <HStack>
            <Text fontSize="sm" minW="80px">
              카메라
            </Text>
            {/* <Select
              size="sm"
              value={selectedDeviceId}
              onChange={handleDeviceChange}
              isDisabled={!devices.length}
              placeholder={devices.length ? '선택' : '권한 허용 후 사용 가능'}
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${d.deviceId.slice(0, 4)}`}
                </option>
              ))}
            </Select> */}
          </HStack>
        </Stack>

        {/* Result / messages */}
        {result ? (
          <Box
            p={3}
            bg="green.50"
            _dark={{ bg: 'green.900' }}
            rounded="md"
            border="1px solid"
            borderColor="green.200"
            // _dark={{ borderColor: 'green.700' }}
          >
            <Text fontSize="sm" color="green.800" _dark={{ color: 'green.100' }}>
              ✅ QR 인식됨
            </Text>
            <Text fontSize="sm" mt={1} wordBreak="break-all">
              {result.rawValue}
            </Text>
          </Box>
        ) : (
          <Box>
            {error ? (
              <Text fontSize="sm" color="red.500">
                {error}
              </Text>
            ) : hasPermission === false ? (
              <Text fontSize="sm" color="red.500">
                카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 접근을 허용해 주세요.
              </Text>
            ) : (
              <>
                <Text fontSize="sm" color="gray.600" _dark={{ color: 'whiteAlpha.700' }}>
                  태블릿의 QR을 인식해주세요!
                </Text>
                <Text fontSize="xs" mt={2} color="gray.500" _dark={{ color: 'whiteAlpha.600' }}>
                  *권한 설정 – 카메라 허용 해주세요
                </Text>
              </>
            )}
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default QRScanPage;
