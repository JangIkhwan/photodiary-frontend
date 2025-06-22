'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';

// 타입 정의
interface Friend {
  id: number;
  name: string;
  email: string;
}

interface FriendRequest {
  id: number;
  username: string;
  email: string;
  requestedAt?: string;
  status?: string;
}

export default function FriendsPage() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');
  const [activeTab, setActiveTab] = useState('friends');

  // API 데이터 상태
  const [friends, setFriends] = useState<Friend[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);

  // 로딩 상태
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [isLoadingReceived, setIsLoadingReceived] = useState(false);
  const [isLoadingSent, setIsLoadingSent] = useState(false);

  // API 호출 함수들
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` || '',
    };
  };

  const fetchFriends = async () => {
    setIsLoadingFriends(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/friends`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('친구 목록을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error('친구 목록 조회 오류:', error);
      // 에러 처리 로직 추가 가능
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const fetchReceivedRequests = async () => {
    setIsLoadingReceived(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/friends/received`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('받은 요청을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setReceivedRequests(data);
    } catch (error) {
      console.error('받은 요청 조회 오류:', error);
    } finally {
      setIsLoadingReceived(false);
    }
  };

  const fetchSentRequests = async () => {
    setIsLoadingSent(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/friends/sent`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('보낸 요청을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setSentRequests(data);
    } catch (error) {
      console.error('보낸 요청 조회 오류:', error);
    } finally {
      setIsLoadingSent(false);
    }
  };

  // 컴포넌트 마운트 시 모든 데이터 조회
  useEffect(() => {
    fetchFriends();
    fetchReceivedRequests();
    fetchSentRequests();
  }, []);

  const handleAddFriend = async () => {
    if (!friendUsername) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/friends`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            email: friendUsername,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // 에러 메시지 표시 (실제로는 toast나 alert 사용)
        alert(data.message || '친구 추가에 실패했습니다.');
        return;
      }

      // 성공 시
      alert('친구 요청을 보냈습니다.');
      setFriendUsername('');
      setShowAddFriend(false);

      // 보낸 요청 목록 새로고침
      fetchSentRequests();
    } catch (error) {
      console.error('친구 추가 오류:', error);
      alert('친구 추가 중 오류가 발생했습니다.');
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/friends/response/${requestId}`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            action: 'ACCEPT',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || '친구 요청 수락에 실패했습니다.');
        return;
      }

      // 성공 시 즉시 UI 업데이트
      alert(data.message || '친구 요청을 수락했습니다.');

      // 받은 요청에서 해당 요청 제거
      setReceivedRequests((prev) => prev.filter((req) => req.id !== requestId));

      // 친구 목록 새로고침
      await fetchFriends();
    } catch (error) {
      console.error('친구 요청 수락 오류:', error);
      alert('친구 요청 수락 중 오류가 발생했습니다.');
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/friends/response/${requestId}`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            action: 'DECLINE',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || '친구 요청 거절에 실패했습니다.');
        return;
      }

      // 성공 시 즉시 UI 업데이트
      alert(data.message || '친구 요청을 거절했습니다.');

      // 받은 요청에서 해당 요청의 상태를 DECLINED로 변경
      setReceivedRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: 'DECLINED' } : req
        )
      );
    } catch (error) {
      console.error('친구 요청 거절 오류:', error);
      alert('친구 요청 거절 중 오류가 발생했습니다.');
    }
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
                placeholder='친구의 이메일을 입력하세요'
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
            {receivedRequests.filter((req) => req.status === 'REQUESTED')
              .length > 0 && (
              <Badge variant='destructive' className='ml-2'>
                {
                  receivedRequests.filter((req) => req.status === 'REQUESTED')
                    .length
                }
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
              {isLoadingFriends ? (
                <div className='flex justify-center items-center py-8'>
                  <Loader2 className='h-6 w-6 animate-spin' />
                  <span className='ml-2'>친구 목록을 불러오는 중...</span>
                </div>
              ) : friends.length > 0 ? (
                <div className='divide-y'>
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className='py-4 flex justify-between items-center'
                    >
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            src='/placeholder.svg'
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
              {isLoadingReceived ? (
                <div className='flex justify-center items-center py-8'>
                  <Loader2 className='h-6 w-6 animate-spin' />
                  <span className='ml-2'>받은 요청을 불러오는 중...</span>
                </div>
              ) : receivedRequests.length > 0 ? (
                <div className='divide-y'>
                  {receivedRequests.map((request) => (
                    <div
                      key={request.id}
                      className='py-4 flex justify-between items-center'
                    >
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            src='/placeholder.svg'
                            alt={request.username}
                          />
                          <AvatarFallback>
                            {request.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{request.username}</p>
                          <p className='text-sm text-gray-500'>
                            {request.email}
                          </p>
                          {request.requestedAt && (
                            <p className='text-xs text-gray-400'>
                              {request.requestedAt}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        {request.status === 'DECLINED' ? (
                          <Badge
                            variant='destructive'
                            className='flex items-center gap-1'
                          >
                            <X className='h-3 w-3' />
                            거절됨
                          </Badge>
                        ) : request.status === 'REQUESTED' ? (
                          <>
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
                          </>
                        ) : (
                          <Badge
                            variant='outline'
                            className='flex items-center gap-1'
                          >
                            <Clock className='h-3 w-3' />
                            대기중
                          </Badge>
                        )}
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
              {isLoadingSent ? (
                <div className='flex justify-center items-center py-8'>
                  <Loader2 className='h-6 w-6 animate-spin' />
                  <span className='ml-2'>보낸 요청을 불러오는 중...</span>
                </div>
              ) : sentRequests.length > 0 ? (
                <div className='divide-y'>
                  {sentRequests.map((request) => (
                    <div
                      key={request.id}
                      className='py-4 flex justify-between items-center'
                    >
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            src='/placeholder.svg'
                            alt={request.username}
                          />
                          <AvatarFallback>
                            {request.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{request.username}</p>
                          <p className='text-sm text-gray-500'>
                            {request.email}
                          </p>
                          {request.requestedAt && (
                            <p className='text-xs text-gray-400'>
                              {request.requestedAt}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant='outline'
                          className={`flex items-center gap-1 ${
                            request.status === 'DECLINED'
                              ? 'text-red-600 border-red-300 bg-red-50'
                              : 'text-yellow-600 border-yellow-300 bg-yellow-50'
                          }`}
                        >
                          <Clock className='h-3 w-3' />
                          {request.status === 'DECLINED' ? '거절됨' : '요청됨'}
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
