import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  SimpleGrid,
  HStack,
  Badge,
  Input,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function AdminAccountPage() {
  return (
    <Box p={6}>
      <VStack gap={8} align="center">
        <Heading size="xl" color="teal.600">
          💰 계정 관리
        </Heading>

        <Text fontSize="lg" textAlign="center" color="gray.600">
          사용자 계정과 재정 현황을 관리하세요
        </Text>

        {/* 재정 요약 */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} w="full" maxW="900px">
          <Box
            p={6}
            border="1px solid"
            borderColor="green.200"
            rounded="lg"
            bg="green.50"
            textAlign="center"
          >
            <Text fontSize="lg" color="green.600" mb={2}>
              💰 총 수익
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="green.700">
              ₩2,450,000
            </Text>
            <Text fontSize="sm" color="green.600" mt={2}>
              이번 달
            </Text>
          </Box>

          <Box
            p={6}
            border="1px solid"
            borderColor="blue.200"
            rounded="lg"
            bg="blue.50"
            textAlign="center"
          >
            <Text fontSize="lg" color="blue.600" mb={2}>
              💳 보증금 총액
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="blue.700">
              ₩5,200,000
            </Text>
            <Text fontSize="sm" color="blue.600" mt={2}>
              현재 보관중
            </Text>
          </Box>

          <Box
            p={6}
            border="1px solid"
            borderColor="orange.200"
            rounded="lg"
            bg="orange.50"
            textAlign="center"
          >
            <Text fontSize="lg" color="orange.600" mb={2}>
              📊 활성 사용자
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="orange.700">
              156
            </Text>
            <Text fontSize="sm" color="orange.600" mt={2}>
              이번 달
            </Text>
          </Box>
        </SimpleGrid>

        {/* 계정 관리 폼 */}
        <Box w="full" maxW="600px" p={6} border="1px solid" borderColor="gray.200" rounded="lg">
          <Heading size="md" mb={4} color="gray.700">
            👤 사용자 계정 관리
          </Heading>
          <VStack gap={4} align="stretch">
            <Box>
              <Text fontWeight="medium" mb={2}>
                사용자 ID
              </Text>
              <Input placeholder="사용자 ID를 입력하세요" />
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                계정 상태
              </Text>
              <select
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                }}
              >
                <option value="">계정 상태를 선택하세요</option>
                <option value="active">활성</option>
                <option value="suspended">정지</option>
                <option value="banned">차단</option>
              </select>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                보증금 조정
              </Text>
              <Input placeholder="보증금 금액을 입력하세요" type="number" />
            </Box>

            <Button colorScheme="teal" size="lg">
              계정 정보 업데이트
            </Button>
          </VStack>
        </Box>

        {/* 사용자 계정 목록 */}
        <Box w="full" maxW="1000px">
          <Heading size="md" mb={4} color="gray.700">
            📋 사용자 계정 목록
          </Heading>
          <Box overflowX="auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#4a5568',
                    }}
                  >
                    사용자 ID
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#4a5568',
                    }}
                  >
                    이름
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#4a5568',
                    }}
                  >
                    상태
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#4a5568',
                    }}
                  >
                    보증금
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#4a5568',
                    }}
                  >
                    잔액
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#4a5568',
                    }}
                  >
                    마지막 로그인
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      color: '#4a5568',
                    }}
                  >
                    액션
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f7fafc' }}>
                  <td style={{ padding: '12px' }}>user001</td>
                  <td style={{ padding: '12px' }}>김철수</td>
                  <td style={{ padding: '12px' }}>
                    <Badge colorScheme="green">활성</Badge>
                  </td>
                  <td style={{ padding: '12px' }}>₩50,000</td>
                  <td style={{ padding: '12px' }}>₩25,000</td>
                  <td style={{ padding: '12px' }}>2024.01.15</td>
                  <td style={{ padding: '12px' }}>
                    <HStack gap={2}>
                      <Button size="xs" colorScheme="blue">
                        수정
                      </Button>
                      <Button size="xs" variant="outline" colorScheme="red">
                        정지
                      </Button>
                    </HStack>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f7fafc' }}>
                  <td style={{ padding: '12px' }}>user002</td>
                  <td style={{ padding: '12px' }}>이영희</td>
                  <td style={{ padding: '12px' }}>
                    <Badge colorScheme="green">활성</Badge>
                  </td>
                  <td style={{ padding: '12px' }}>₩30,000</td>
                  <td style={{ padding: '12px' }}>₩15,000</td>
                  <td style={{ padding: '12px' }}>2024.01.14</td>
                  <td style={{ padding: '12px' }}>
                    <HStack gap={2}>
                      <Button size="xs" colorScheme="blue">
                        수정
                      </Button>
                      <Button size="xs" variant="outline" colorScheme="red">
                        정지
                      </Button>
                    </HStack>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f7fafc' }}>
                  <td style={{ padding: '12px' }}>user003</td>
                  <td style={{ padding: '12px' }}>박민수</td>
                  <td style={{ padding: '12px' }}>
                    <Badge colorScheme="red">정지</Badge>
                  </td>
                  <td style={{ padding: '12px' }}>₩0</td>
                  <td style={{ padding: '12px' }}>₩0</td>
                  <td style={{ padding: '12px' }}>2024.01.10</td>
                  <td style={{ padding: '12px' }}>
                    <HStack gap={2}>
                      <Button size="xs" colorScheme="green">
                        활성화
                      </Button>
                      <Button size="xs" variant="outline" colorScheme="red">
                        차단
                      </Button>
                    </HStack>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f7fafc' }}>
                  <td style={{ padding: '12px' }}>user004</td>
                  <td style={{ padding: '12px' }}>최지영</td>
                  <td style={{ padding: '12px' }}>
                    <Badge colorScheme="green">활성</Badge>
                  </td>
                  <td style={{ padding: '12px' }}>₩40,000</td>
                  <td style={{ padding: '12px' }}>₩20,000</td>
                  <td style={{ padding: '12px' }}>2024.01.13</td>
                  <td style={{ padding: '12px' }}>
                    <HStack gap={2}>
                      <Button size="xs" colorScheme="red">
                        수정
                      </Button>
                      <Button size="xs" variant="outline" colorScheme="red">
                        정지
                      </Button>
                    </HStack>
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Box>

        {/* 액션 버튼 */}
        <HStack gap={4} wrap="wrap" justify="center">
          <Button colorScheme="teal" size="lg">
            일괄 계정 관리
          </Button>
          <Button colorScheme="blue" size="lg">
            재정 보고서
          </Button>
          <Button variant="outline" size="lg">
            계정 백업
          </Button>
        </HStack>

        <Button asChild variant="ghost" size="sm">
          <Link to="/admin">← 관리자 메인으로 돌아가기</Link>
        </Button>
      </VStack>
    </Box>
  );
}
