"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, BookOpen, Search } from "lucide-react"

// 더미 데이터
const friends = [
  { id: 1, name: "김민석", username: "minseok", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "남경식", username: "kyungsik", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "장익환", username: "ikhwan", avatar: "/placeholder.svg?height=40&width=40" },
]

export default function FriendsPage() {
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [friendUsername, setFriendUsername] = useState("")

  const handleAddFriend = () => {
    if (!friendUsername) return

    // 실제로는 API 호출 등의 로직이 들어갈 자리
    console.log("친구 추가:", friendUsername)
    setFriendUsername("")
    setShowAddFriend(false)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">친구 목록</h1>
        <Button onClick={() => setShowAddFriend(!showAddFriend)}>
          <UserPlus className="mr-2 h-4 w-4" />
          친구 추가
        </Button>
      </div>

      {showAddFriend && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>친구 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="친구의 사용자 이름을 입력하세요"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
              />
              <Button onClick={handleAddFriend}>추가</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>내 친구</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="친구 검색" className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {friends.length > 0 ? (
            <div className="divide-y">
              {friends.map((friend) => (
                <div key={friend.id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{friend.name}</p>
                      <p className="text-sm text-gray-500">@{friend.username}</p>
                    </div>
                  </div>
                  <Link href={`/friends/${friend.id}/diaries`}>
                    <Button variant="outline" size="sm">
                      <BookOpen className="mr-2 h-4 w-4" />
                      일기 보기
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">아직 친구가 없습니다.</p>
              <p className="text-sm text-gray-400 mt-1">친구 추가 버튼을 눌러 친구를 추가해보세요.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
