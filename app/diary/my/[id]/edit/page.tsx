'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Trash } from 'lucide-react';

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

export default function DiaryEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState(diary.title);
  const [content, setContent] = useState(diary.content);
  const [privacy, setPrivacy] = useState(diary.privacy);

  const handleSave = () => {
    // 실제로는 API 호출 등의 로직이 들어갈 자리
    console.log('일기 수정:', { id: params.id, title, content, privacy });
    router.push(`/diary/my/${params.id}`);
  };

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <Link href={`/diary/my/${params.id}`}>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            돌아가기
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className='p-6'>
          <h1 className='text-2xl font-bold mb-6'>일기 수정</h1>

          <div className='space-y-4'>
            <div>
              <Label htmlFor='title'>제목</Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='mt-1'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
              {diary.images.map((image, index) => (
                <div key={index} className='relative group'>
                  <img
                    src={image || '/placeholder.svg'}
                    alt={`일기 이미지 ${index + 1}`}
                    className='w-full h-48 object-cover rounded-md'
                  />
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor='content'>내용</Label>
              <Textarea
                id='content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className='mt-1 min-h-[300px]'
              />
            </div>

            <div>
              <Label htmlFor='privacy'>공개 설정</Label>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger id='privacy' className='mt-1'>
                  <SelectValue placeholder='공개 설정 선택' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='friends'>친구에게 공개</SelectItem>
                  <SelectItem value='private'>비공개</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-between p-6 pt-0'>
          <Button variant='destructive'>
            <Trash className='mr-2 h-4 w-4' />
            삭제하기
          </Button>
          <Button onClick={handleSave}>
            <Save className='mr-2 h-4 w-4' />
            저장하기
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
