import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

// 더미 데이터 - 여러 친구 정보
const friendsData = [
  {
    id: '1',
    name: '김민석',
    username: 'minseok',
  },
  {
    id: '2',
    name: '남경식',
    username: 'kyungsik',
  },
  {
    id: '3',
    name: '장익환',
    username: 'ikhwan',
  },
];

// 더미 데이터
const diary = {
  id: 1,
  title: '제주도 여행',
  date: '2025-05-03',
  content: `제주도에 도착한 첫날, 바다를 보러 갔다. 푸른 바다와 시원한 바람이 정말 좋았다. 해변가에서 사진도 많이 찍고, 조개도 주웠다. 

저녁에는 제주도의 유명한 해산물을 먹었다. 신선한 회와 전복 요리가 특히 맛있었다. 숙소에 돌아와서는 내일 일정을 계획하며 하루를 마무리했다.

내일은 한라산을 등반할 예정이다. 날씨가 좋으면 정상에서 멋진 경치를 볼 수 있을 것 같다. 기대된다.`,
  images: [
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
  ],
};

export default function FriendDiaryDetailPage({
  params,
}: {
  params: { id: string; diaryId: string };
}) {
  // URL의 id 파라미터에 따라 친구 정보 가져오기
  const getFriendById = (id: string) => {
    return (
      friendsData.find((friend) => friend.id === id) || {
        id: '0',
        name: '알 수 없음',
        username: 'unknown',
      }
    );
  };

  const friend = getFriendById(params.id);

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <Link href={`/friends/${params.id}/diaries`}>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            목록으로
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className='p-6'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h1 className='text-2xl font-bold'>{diary.title}</h1>
              <p className='text-sm text-gray-500 mt-1'>
                {friend.name}님의 일기
              </p>
            </div>
            <span className='text-sm text-gray-500'>{diary.date}</span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            {diary.images.map((image, index) => (
              <div key={index} className='overflow-hidden rounded-md'>
                <img
                  src={image || '/placeholder.svg'}
                  alt={`일기 이미지 ${index + 1}`}
                  className='w-full h-48 object-cover'
                />
              </div>
            ))}
          </div>

          <div className='whitespace-pre-line text-gray-700'>
            {diary.content}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
