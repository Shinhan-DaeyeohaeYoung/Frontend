import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Input,
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { tokenStorage } from '../api/client';
import { postRequest, getRequest } from '../api/requests'; // 요청 유틸 함수 import
import { toaster } from '../components/ui/toaster';
import { useAuthStore } from '../stores/authStore';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  name: string;
}

interface LoginRequest {
  universityId: string;
  studentId: string;
  password: string;
}

interface UserInfo {
  id: number;
  universityId: number;
  name: string;
  studentId: string;
  email: string;
  roles: string[];
}

interface Organization {
  organizationId: number;
  universityId: number;
  name: string;
  type: string;
  parentOrganizationId: number | null;
  role: string;
  active: boolean;
}

const universities = createListCollection({
  items: [
    { label: '서울대학교', value: '1' },
    { label: '연세대학교', value: '2' },
    { label: '고려대학교', value: '3' },
    { label: '성균관대학교', value: '4' },
    { label: '한양대학교', value: '5' },
    { label: '중앙대학교', value: '6' },
    { label: '경희대학교', value: '7' },
    { label: '서강대학교', value: '8' },
    { label: '이화여자대학교', value: '9' },
    { label: '건국대학교', value: '10' },
  ],
});

export default function LoginPage() {
  const [universityId, setUniversityId] = useState(['1']);
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log('=== 로그인 시작 ===');

    // 입력값 검증
    if (!universityId || universityId.length === 0) {
      toaster.create({
        title: '입력 오류',
        description: '대학교를 선택해주세요.',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    if (!studentId || !password) {
      toaster.create({
        title: '입력 오류',
        description: '학번과 비밀번호를 모두 입력해주세요.',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    useAuthStore.getState().setLoading(true);

    try {
      const requestData: LoginRequest = {
        universityId: universityId[0],
        studentId,
        password,
      };

      const responseData = await postRequest<LoginResponse, LoginRequest>(
        '/users/signin',
        requestData
      );

      if (!responseData) {
        throw new Error('서버로부터 응답을 받지 못했습니다.');
      }

      const { accessToken, name } = responseData;

      if (!accessToken) {
        throw new Error('로그인 응답에 토큰이 포함되지 않았습니다.');
      }

      // 토큰 저장
      tokenStorage.setAccessToken(accessToken);

      // 사용자 정보 가져오기
      try {
        const userInfo = await getRequest<UserInfo>('/users/me', {});

        if (userInfo) {
          // 조직 정보 가져오기
          try {
            const organizations = await getRequest<Organization[]>('/organizations', {});

            // 조직 정보 처리
            let universityInfo = null;
            let collegeInfo = null;
            let departmentInfo = null;
            let adminLevel: 'university' | 'college' | 'department' | 'none' = 'none';

            if (organizations && organizations.length > 0) {
              // 대학교 정보 찾기
              const university = organizations.find(
                (org: Organization) => org.type === 'UNIVERSITY'
              );
              if (university) {
                universityInfo = {
                  id: university.organizationId,
                  name: university.name,
                };
                // 대학교 레벨 관리자인지 확인
                if (university.role === 'ORG_ADMIN') {
                  adminLevel = 'university';
                }
              }

              // 단과대 정보 찾기
              const college = organizations.find((org: Organization) => org.type === 'COLLEGE');
              if (college) {
                collegeInfo = {
                  id: college.organizationId,
                  name: college.name,
                };
                // 단과대 레벨 관리자인지 확인 (대학교보다 낮은 레벨)
                if (college.role === 'ORG_ADMIN' && adminLevel === 'none') {
                  adminLevel = 'college';
                }
              }

              // 학과 정보 찾기
              const department = organizations.find(
                (org: Organization) => org.type === 'DEPARTMENT'
              );
              if (department) {
                departmentInfo = {
                  id: department.organizationId,
                  name: department.name,
                };
                // 학과 레벨 관리자인지 확인 (가장 낮은 레벨)
                if (department.role === 'ORG_ADMIN' && adminLevel === 'none') {
                  adminLevel = 'department';
                }
              }
            }

            // authStore에 사용자 정보 저장 (새로운 인터페이스에 맞춤)
            const userData = {
              id: userInfo.id.toString(),
              name: userInfo.name,
              university: universityInfo?.name || '서울대학교',
              studentId: userInfo.studentId,
              admin: adminLevel,
              email: userInfo.email,
              info: {
                university: universityInfo,
                college: collegeInfo,
                department: departmentInfo,
              },
            };

            useAuthStore.getState().setUser(userData);
          } catch (orgError) {
            console.error('조직 정보 가져오기 실패:', orgError);
            // 기본 사용자 정보로 저장
            const userData = {
              id: userInfo.id.toString(),
              name: userInfo.name,
              university: '서울대학교',
              studentId: userInfo.studentId,
              admin: 'none' as const,
              email: userInfo.email,
              info: {
                university: null,
                college: null,
                department: null,
              },
            };

            useAuthStore.getState().setUser(userData);
          }
        }
      } catch (userInfoError) {
        console.error('사용자 정보 가져오기 실패:', userInfoError);
        // 기본 정보로 authStore 설정
        const defaultUserData = {
          id: studentId,
          name: name || '사용자',
          university: '서울대학교',
          studentId: studentId,
          admin: 'none' as const,
          email: '',
          info: {
            university: null,
            college: null,
            department: null,
          },
        };

        useAuthStore.getState().setUser(defaultUserData);
      }

      toaster.create({
        title: '로그인 성공',
        description: name ? `${name}님 환영합니다!` : '로그인에 성공했습니다!',
        type: 'success',
        duration: 3000,
      });

      navigate('/main');
    } catch (error: unknown) {
      console.error('=== 로그인 에러 ===', error);

      let errorMessage = '로그인에 실패했습니다.';

      // 구체적인 에러 처리
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 401) {
          errorMessage = '학번 또는 비밀번호가 올바르지 않습니다.';
        } else if (axiosError.response?.status === 404) {
          errorMessage = '존재하지 않는 사용자입니다.';
        } else if (axiosError.response?.status === 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      // 네트워크 연결 체크
      if (!navigator.onLine) {
        errorMessage = '네트워크 연결을 확인해주세요.';
      }

      toaster.create({
        title: '로그인 실패',
        description: errorMessage,
        type: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      useAuthStore.getState().setLoading(false);
    }
  };

  // Enter 키 핸들러
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <Box p={6} maxW="400px" mx="auto">
      <VStack gap={6} align="stretch">
        <Heading size="lg" textAlign="center" color="blue.600">
          🔐 로그인
        </Heading>

        <Box>
          <Text fontWeight="medium" mb={2}>
            대학교
          </Text>
          <Select.Root
            collection={universities}
            value={universityId}
            onValueChange={(e) => setUniversityId(e.value)}
            size="sm"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="대학교를 선택해주세요" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {universities.items.map((university) => (
                    <Select.Item item={university} key={university.value}>
                      {university.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>

        <Box>
          <Text fontWeight="medium" mb={2}>
            학번
          </Text>
          <Input
            type="text"
            placeholder="2019038073"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </Box>

        <Box>
          <Text fontWeight="medium" mb={2}>
            비밀번호
          </Text>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </Box>

        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleLogin}
          loading={isLoading}
          loadingText="로그인 중..."
          disabled={isLoading}
        >
          로그인
        </Button>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          계정이 없으신가요?{' '}
          <Link to="/signup" style={{ color: '#3182ce', textDecoration: 'underline' }}>
            회원가입
          </Link>
        </Text>

        <Button asChild variant="ghost" size="sm">
          <Link to="/main">메인으로 가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
