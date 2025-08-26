import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Flex, Heading, HStack, Select, Stack, Text } from '@chakra-ui/react';
import { RiCameraLine, RiRefreshLine, RiCloseCircleLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toaster } from '@/components/ui/toaster';
import { extractTokenFromQR, fetchOrgQrMeta, resolveQrToken } from '@/api/qrs';

declare global {
  interface Window {
    BarcodeDetector?: any;
  }
}
const SUPPORTS = typeof window !== 'undefined' && !!window.BarcodeDetector;

const QrScanPage: React.FC = () => {
  const nav = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const detectorRef = useRef<any | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const handleResolved = useCallback(
    async (token: string) => {
      toaster.create({ description: 'QR 확인 중...', type: 'loading' });
      try {
        const data = await resolveQrToken(token);
        toaster.dismiss();
        toaster.success({
          title: '인식 성공',
          description: `organizationId=${data.organizationId}`,
        });
        nav(`/rent?orgId=${data.organizationId}`);
      } catch (e: any) {
        toaster.dismiss();
        toaster.error({ title: '검증 실패', description: e?.message ?? '유효하지 않은 QR' });
      }
    },
    [nav]
  );

  const loopDetect = useCallback(() => {
    const tick = async () => {
      try {
        const v = videoRef.current;
        const det = detectorRef.current;
        if (v && det && !v.paused && !v.ended) {
          const codes = await det.detect(v);
          if (codes?.length) {
            const raw = String(codes[0].rawValue ?? '');
            setResultText(raw);
            const token = extractTokenFromQR(raw);
            if (!token) {
              toaster.error({
                title: '토큰 형식 오류',
                description: 'QR 내용에서 token을 찾지 못했습니다.',
              });
            } else {
              if (navigator.vibrate) navigator.vibrate(120);
              await handleResolved(token);
            }
          }
        }
      } catch {
        // ignore
      } finally {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [handleResolved]);

  const start = useCallback(
    async (deviceId?: string) => {
      try {
        setError(null);
        setResultText(null);
        stop();

        if (!SUPPORTS) {
          setError('이 브라우저는 BarcodeDetector를 지원하지 않습니다.');
          toaster.warning({ description: 'BarcodeDetector 미지원 브라우저' });
          return;
        }

        const constraints: MediaStreamConstraints = {
          video: deviceId
            ? { deviceId: { exact: deviceId } }
            : { facingMode: { ideal: 'environment' } },
          audio: false,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const all = await navigator.mediaDevices.enumerateDevices();
        const cams = all.filter((d) => d.kind === 'videoinput');
        setDevices(cams);
        if (!deviceId && cams.length && !selectedDeviceId) setSelectedDeviceId(cams[0].deviceId);

        detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
        loopDetect();
      } catch (e: any) {
        const name = e?.name || '';
        if (name === 'NotAllowedError' || name === 'SecurityError') {
          setError('카메라 권한이 거부되었습니다. 브라우저 설정에서 허용해 주세요.');
          toaster.error({ title: '권한 필요', description: '카메라 접근을 허용해 주세요.' });
        } else {
          setError('카메라 시작 오류');
          toaster.error({ title: '오류', description: '카메라를 시작할 수 없습니다.' });
        }
      }
    },
    [loopDetect, selectedDeviceId, stop]
  );

  useEffect(() => () => stop(), [stop]);

  return (
    <Flex justify="center" p={4}>
      <Box w="360px" border="1px dashed" borderColor="gray.300" rounded="md" p={4} bg="white">
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
          <Box
            pointerEvents="none"
            position="absolute"
            inset={0}
            border="2px dashed"
            borderColor="blackAlpha.400"
            rounded="md"
          />
        </Box>

        <Stack gap={3} mb={4}>
          <HStack justify="space-between">
            <Button size="sm" onClick={() => start(selectedDeviceId)}>
              카메라 시작
            </Button>
            <Button size="sm" variant="outline" onClick={stop}>
              중지
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setResultText(null);
                toaster.create({ description: '스캐너 리셋', type: 'info' });
              }}
            >
              초기화
            </Button>
          </HStack>

          <HStack>
            <Text fontSize="sm" minW="80px">
              카메라
            </Text>
            {/* <Select
              size="sm"
              value={selectedDeviceId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedDeviceId(id);
                start(id);
              }}
              isDisabled={!devices.length}
              placeholder={devices.length ? '선택' : '권한 허용 후 사용'}
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${d.deviceId.slice(0, 4)}`}
                </option>
              ))}
            </Select> */}
          </HStack>

          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              try {
                toaster.create({ description: '테스트 토큰 발급 중...', type: 'loading' });
                const meta = await fetchOrgQrMeta();
                toaster.create({ description: 'QR 해석 중...', type: 'info' });
                await handleResolved(meta.token);
              } catch (e: any) {
                toaster.dismiss();
                toaster.error({ title: '테스트 실패', description: e?.message ?? '요청 실패' });
                alert('error');
              }
            }}
          >
            테스트 토큰으로 이동
          </Button>
        </Stack>

        {error ? (
          <Text fontSize="sm" color="red.500">
            {error}
          </Text>
        ) : (
          <>
            <Text fontSize="sm" color="gray.600">
              태블릿의 QR을 인식해주세요! <br />
              *권한 설정 – 카메라 허용 해주세요
            </Text>
            {resultText && (
              <Box mt={3} p={2} border="1px solid" borderColor="gray.200" rounded="md" bg="gray.50">
                <Text fontSize="xs" wordBreak="break-all">
                  스캔 텍스트: {resultText}
                </Text>
              </Box>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};

export default QrScanPage;
