import { Box, Text, VStack, Flex, Image } from '@chakra-ui/react';
import { PageHeader } from '@/components/PageHeader';
import ssol from '@/assets/imgs/ssol.svg';
import seoul from '@/assets/imgs/seoul.svg';
import yeonse from '@/assets/imgs/yeonse.svg';
import goryeo from '@/assets/imgs/goryeo.svg';
import logo_06 from '@/assets/imgs/logo_06.png';
// 대학 랭킹 데이터
const universityRankings = [
  {
    rank: 1,
    logo: ssol,
    name: '쏠 대학교',
    score: '252,320pt',
    isMedal: true,
    medalType: 'gold',
  },
  {
    rank: 2,
    logo: seoul,
    name: '경북대학교 대구캠퍼스',
    score: '235,120pt',
    isMedal: true,
    medalType: 'silver',
  },
  {
    rank: 3,
    logo: yeonse,
    name: '고려대학교 서울캠퍼스',
    score: '234,560pt',
    isMedal: true,
    medalType: 'bronze',
  },
  {
    rank: 4,
    logo: goryeo,
    name: '연세대학교 신촌캠퍼스',
    score: '231,160pt',
    isMedal: false,
  },
];

// 메달 아이콘 컴포넌트
const MedalIcon = ({ type, rank }: { type: string; rank: number }) => {
  const medalColors = {
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  };

  return (
    <Box
      w="40px"
      h="40px"
      borderRadius="full"
      bg={medalColors[type as keyof typeof medalColors]}
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="lg"
      fontWeight="bold"
      color="white"
      boxShadow="0 2px 4px rgba(0,0,0,0.2)"
    >
      {rank}
    </Box>
  );
};

// 일반 순위 컴포넌트
const RankNumber = ({ rank }: { rank: number }) => (
  <Box
    w="40px"
    h="40px"
    borderRadius="full"
    bg="gray.100"
    display="flex"
    alignItems="center"
    justifyContent="center"
    fontSize="lg"
    fontWeight="bold"
    color="gray.600"
  >
    {rank}
  </Box>
);

export default function UniversityPage() {
  return (
    <Box>
      <PageHeader
        title="대학교 리더보드"
        subtitle="전국의 대학교 포인트 랭킹을 확인해보세요"
        bgColor="purple.500"
        titleColor="white"
        subtitleColor="white"
        imageSrc={logo_06}
        imageSize={40}
      />

      <Box px={6} pt={6}>
        <VStack gap={3} align="stretch">
          {universityRankings.map((university) => (
            <Box
              key={university.rank}
              bg="white"
              borderRadius="xl"
              p={4}
              boxShadow="0 2px 8px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor="gray.100"
            >
              <Flex align="center" gap={4}>
                {/* 순위/메달 */}
                {university.isMedal ? (
                  <MedalIcon type={university.medalType!} rank={university.rank} />
                ) : (
                  <RankNumber rank={university.rank} />
                )}

                {/* 대학 로고 */}
                <Box
                  w="50px"
                  h="50px"
                  borderRadius="full"
                  overflow="hidden"
                  bg="gray.50"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={university.logo}
                    alt={`${university.name} 로고`}
                    w="40px"
                    h="40px"
                    objectFit="contain"
                  />
                </Box>

                {/* 대학 정보 */}
                <Box flex={1}>
                  <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={1}>
                    {university.name}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    {university.score}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
