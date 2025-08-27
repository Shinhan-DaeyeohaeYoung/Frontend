// QR 관련 API (요청 래퍼 사용)
import { getRequest, postRequest } from './requests';

export type OrgQrMeta = {
  token: string;
  type: 'SITE' | 'ORG';
  universityId: number;
  organizationId: number;
  issuedAt: string;
  expiresAt: string;
};

export type QrResolveResp = {
  type: 'ORG';
  universityId: number;
  organizationId: number;
  issuedAt: string;
  expiresAt: string;
};

// 개발/테스트용: 직접 토큰 발급
export const fetchOrgQrMeta = () => getRequest<OrgQrMeta>('/api/admin/org-qr/meta');

// 스캔한 토큰 검증/해석
export const resolveQrToken = (token: string) =>
  postRequest<QrResolveResp, { token: string }>('/api/qrs/resolve', { token });

// QR 텍스트에서 token 추출 (URL or JWT)
export const extractTokenFromQR = (raw: string): string | null => {
  try {
    const u = new URL(raw);
    const t = u.searchParams.get('token');
    if (t) return t;
  } catch {
    // raw가 URL이 아닐 수 있음
  }
  // 단순 JWT 형태
  if (raw.split('.').length === 3) return raw;
  return null;
};
