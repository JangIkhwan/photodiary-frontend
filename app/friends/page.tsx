'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  UserPlus,
  BookOpen,
  Search,
  Check,
  X,
  Clock,
  UserMinus,
} from 'lucide-react';

// 더미 데이터 구조를 API 응답에 맞게 변경
const friends = [
  {
    id: 1,
    name: '김민석',
    email: 'minseok@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: 2,
    name: '남경식',
    email: 'kyungsik@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  {
    id: 3,
    name: '장익환',
    email: 'ikhwan@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
  },
];

// 받은 친구 요청 더미 데이터도 동일하게 변경
const receivedRequests = [
  {
    id: 4,
    name: '이영희',
    email: 'younghee@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    requestDate: '2025-01-20',
  },
  {
    id: 5,
    name: '박철수',
    email: 'chulsoo@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    requestDate: '2025-01-19',
  },
  {
    id: 6,
    name: '정미나',
    email: 'mina@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    requestDate: '2025-01-18',
  },
];

// 보낸 친구 요청 더미 데이터도 동일하게 변경
const sentRequests = [
  {
    id: 7,
    name: '최수진',
    email: 'sujin@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    requestDate: '2025-01-20',
    status: 'pending',
  },
  {
    id: 8,
    name: '김태현',
    email: 'taehyun@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    requestDate: '2025-01-17',
    status: 'pending',
  },
];

export default function FriendsPage() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');
  const [activeTab, setActiveTab] = useState('friends');

  const handleAddFriend = () => {
    if (!friendUsername) return;

    // 실제로는 API 호출 등의 로직이 들어갈 자리
    console.log('친구 추가:', friendUsername);
    setFriendUsername('');
    setShowAddFriend(false);
  };

  const handleAcceptRequest = (requestId: number) => {
    console.log('친구 요청 수락:', requestId);
    // 실제로는 API 호출 로직
  };

  const handleRejectRequest = (requestId: number) => {
    console.log('친구 요청 거절:', requestId);
    // 실제로는 API 호출 로직
  };

  const handleCancelRequest = (requestId: number) => {
    console.log('친구 요청 취소:', requestId);
    // 실제로는 API 호출 로직
  };

  const handleRemoveFriend = (friendId: number) => {
    console.log('친구 삭제:', friendId);
    // 실제로는 API 호출 로직
  };

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>친구 관리</h1>
        <Button onClick={() => setShowAddFriend(!showAddFriend)}>
          <UserPlus className='mr-2 h-4 w-4' />
          친구 추가
        </Button>
      </div>

      {showAddFriend && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>친구 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex gap-2'>
              <Input
                placeholder='친구의 사용자 이름을 입력하세요'
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
              />
              <Button onClick={handleAddFriend}>요청 보내기</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='friends' className='relative'>
            내 친구
            <Badge variant='secondary' className='ml-2'>
              {friends.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value='received' className='relative'>
            받은 요청
            {receivedRequests.length > 0 && (
              <Badge variant='destructive' className='ml-2'>
                {receivedRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value='sent' className='relative'>
            보낸 요청
            <Badge variant='outline' className='ml-2'>
              {sentRequests.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* 내 친구 탭 */}
        <TabsContent value='friends'>
          <Card>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <CardTitle>내 친구</CardTitle>
                <div className='relative w-64'>
                  <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
                  <Input placeholder='친구 검색' className='pl-8' />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {friends.length > 0 ? (
                <div className='divide-y'>
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className='py-4 flex justify-between items-center'
                    >
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            src={friend.avatar || '/placeholder.svg'}
                            alt={friend.name}
                          />
                          <AvatarFallback>
                            {friend.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{friend.name}</p>
                          <p className='text-sm text-gray-500'>
                            {friend.email}
                          </p>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <Link href={`/friends/${friend.id}/diaries`}>
                          <Button variant='outline' size='sm'>
                            <BookOpen className='mr-2 h-4 w-4' />
                            일기 보기
                          </Button>
                        </Link>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleRemoveFriend(friend.id)}
                          className='text-red-600 hover:text-red-700 hover:bg-red-50'
                        >
                          <UserMinus className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <p className='text-gray-500'>아직 친구가 없습니다.</p>
                  <p className='text-sm text-gray-400 mt-1'>
                    친구 추가 버튼을 눌러 친구를 추가해보세요.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 받은 요청 탭 */}
        <TabsContent value='received'>
          <Card>
            <CardHeader>
              <CardTitle>받은 친구 요청</CardTitle>
            </CardHeader>
            <CardContent>
              {receivedRequests.length > 0 ? (
                <div className='divide-y'>
                  {receivedRequests.map((request) => (
                    <div
                      key={request.id}
                      className='py-4 flex justify-between items-center'
                    >
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            src={request.avatar || '/placeholder.svg'}
                            alt={request.name}
                          />
                          <AvatarFallback>
                            {request.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{request.name}</p>
                          <p className='text-sm text-gray-500'>
                            {request.email}
                          </p>
                          <p className='text-xs text-gray-400'>
                            {request.requestDate}
                          </p>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          size='sm'
                          onClick={() => handleAcceptRequest(request.id)}
                          className='bg-green-600 hover:bg-green-700'
                        >
                          <Check className='mr-2 h-4 w-4' />
                          수락
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleRejectRequest(request.id)}
                          className='text-red-600 border-red-200 hover:bg-red-50'
                        >
                          <X className='mr-2 h-4 w-4' />
                          거절
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <p className='text-gray-500'>받은 친구 요청이 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보낸 요청 탭 */}
        <TabsContent value='sent'>
          <Card>
            <CardHeader>
              <CardTitle>보낸 친구 요청</CardTitle>
            </CardHeader>
            <CardContent>
              {sentRequests.length > 0 ? (
                <div className='divide-y'>
                  {sentRequests.map((request) => (
                    <div
                      key={request.id}
                      className='py-4 flex justify-between items-center'
                    >
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            src={request.avatar || '/placeholder.svg'}
                            alt={request.name}
                          />
                          <AvatarFallback>
                            {request.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{request.name}</p>
                          <p className='text-sm text-gray-500'>
                            {request.email}
                          </p>
                          <p className='text-xs text-gray-400'>
                            {request.requestDate}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant='outline'
                          className='flex items-center gap-1'
                        >
                          <Clock className='h-3 w-3' />
                          대기 중
                        </Badge>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleCancelRequest(request.id)}
                          className='text-red-600 hover:text-red-700 hover:bg-red-50'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <p className='text-gray-500'>보낸 친구 요청이 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
