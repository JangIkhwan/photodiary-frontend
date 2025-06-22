'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';

// API 응답 타입
interface DetailDiary {
  diaryId: number;
  username: string;
  title: string;
  content: string;
  images: { imageId: number; imageUrl: string }[];
  isPublic: boolean;
  createdAt: string;
}

export default function FriendDiaryDetailPage({
  params,
}: {
  params: { id: string; diaryId: string };
}) {
  const { id: friendId, diaryId } = params;
  const [diary, setDiary] = useState<DetailDiary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  };

  useEffect(() => {
    async function fetchDiary() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/friends/diarys/${diaryId}`,
          { method: 'GET', headers: getAuthHeaders() }
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || '일기 상세 조회에 실패했습니다.');
        setDiary(data);
      } catch (err: any) {
        console.error('친구 일기 상세 조회 오류:', err);
        alert(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (diaryId) fetchDiary();
  }, [diaryId]);

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <Link href={`/friends/${friendId}/diaries`}>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='mr-2 h-4 w-4' /> 목록으로
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-12'>
          <Loader2 className='h-6 w-6 animate-spin' />
          <span className='ml-2'>상세 정보를 불러오는 중...</span>
        </div>
      ) : diary ? (
        <Card>
          <CardContent className='p-6'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h1 className='text-2xl font-bold'>{diary.title}</h1>
                <p className='text-sm text-gray-500 mt-1'>
                  {diary.username}님의 일기
                </p>
              </div>
              <span className='text-sm text-gray-500'>
                {new Date(diary.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
              {diary.images.map((img) => (
                <div key={img.imageId} className='overflow-hidden rounded-md'>
                  <img
                    src={img.imageUrl || '/placeholder.svg'}
                    alt={diary.title}
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
      ) : (
        <div className='text-center py-12'>
          <p className='text-gray-500'>해당 일기를 찾을 수 없습니다.</p>
        </div>
      )}
    </div>
  );
}
