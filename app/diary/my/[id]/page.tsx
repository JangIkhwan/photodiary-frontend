'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';

// API 응답 타입
interface Diary {
  diaryId: number;
  title: string;
  content: string;
  images: { imageId: number; imageUrl: string }[];
  isPublic: boolean;
}

export default function FriendDiariesPage() {
  const { id: friendId } = useParams();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  };

  useEffect(() => {
    async function fetchDiaries() {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/friends/diarys?friendId=${friendId}`,
          { headers: getAuthHeaders() }
        );
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 404) {
            setDiaries([]);
          } else {
            throw new Error(
              data.message || '일기 목록을 불러오는데 실패했습니다.'
            );
          }
        } else {
          setDiaries(data);
        }
      } catch (err: any) {
        console.error('친구 일기 조회 오류:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (friendId) fetchDiaries();
  }, [friendId]);

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-6'>
        <Link href='/friends'>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='mr-2 h-4 w-4' /> 친구 목록
          </Button>
        </Link>
        <h1 className='text-2xl font-bold'>{`${friendId}님의 일기`}</h1>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-12'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <span className='ml-2'>친구 일기를 불러오는 중...</span>
        </div>
      ) : error ? (
        <div className='text-center py-12 text-red-500'>{error}</div>
      ) : diaries.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {diaries.map((diary) => (
            <Card key={diary.diaryId} className='overflow-hidden'>
              <div className='relative h-48'>
                <img
                  src={diary.images[0]?.imageUrl || '/placeholder.svg'}
                  alt={diary.title}
                  className='w-full h-full object-cover'
                />
              </div>
              <CardHeader className='p-4'>
                <CardTitle className='text-lg font-semibold'>
                  {diary.title}
                </CardTitle>
                <p className='text-gray-600 line-clamp-3'>
                  {diary.content.length > 80
                    ? diary.content.substring(0, 80) + '...'
                    : diary.content}
                </p>
              </CardHeader>
              <CardFooter className='flex justify-end p-4 pt-0'>
                <Link href={`/friends/${friendId}/diaries/${diary.diaryId}`}>
                  <Button variant='outline' size='sm'>
                    <Eye className='mr-2 h-4 w-4' /> 보기
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 text-gray-500'>
          공개된 일기가 없습니다.
        </div>
      )}
    </div>
  );
}
