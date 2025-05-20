import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';

// 더미 데이터
const diary = {
  id: 1,
  title: '친구들과 카페에서',
  date: '2025-05-05',
  content: `오늘은 친구들과 함께 카페에서 만났다. 오랜만에 만난 친구들과 이야기를 나누며 즐거운 시간을 보냈다. 카페에서 맛있는 디저트도 먹고, 사진도 많이 찍었다. 날씨가 좋아서 카페 테라스에서 시간을 보냈는데, 햇살이 정말 따뜻했다.

이런 소소한 일상이 행복하다. 친구들과 함께한 시간은 항상 특별하게 느껴진다. 다음에는 어디로 놀러갈지 계획도 세웠다. 다음 달에는 함께 여행을 가기로 했다. 기대된다.`,
  images: [
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
    '/placeholder.svg?height=400&width=600',
  ],
  privacy: 'friends',
};

export default function DiaryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <Link href='/diary/my'>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            목록으로
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className='p-6'>
          <div className='flex justify-between items-start mb-4'>
            <h1 className='text-2xl font-bold'>{diary.title}</h1>
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

          <div className='mt-4 text-sm text-gray-500'>
            공개 설정:{' '}
            {diary.privacy === 'friends' ? '친구에게 공개' : '비공개'}
          </div>
        </CardContent>
        <CardFooter className='flex justify-end p-6 pt-0'>
          <Link href={`/diary/my/${diary.id}/edit`}>
            <Button>
              <Edit className='mr-2 h-4 w-4' />
              수정하기
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
