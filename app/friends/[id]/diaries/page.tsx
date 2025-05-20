import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Eye } from "lucide-react"

// 더미 데이터 - 여러 친구 정보
const friendsData = [
  {
    id: "1",
    name: "김민석",
    username: "minseok",
  },
  {
    id: "2",
    name: "남경식",
    username: "kyungsik",
  },
  {
    id: "3",
    name: "장익환",
    username: "ikhwan",
  },
]

// URL의 id 파라미터에 따라 친구 정보 가져오기
const getFriendById = (id: string) => {
  return (
    friendsData.find((friend) => friend.id === id) || {
      id: "0",
      name: "알 수 없음",
      username: "unknown",
    }
  )
}

// 더미 데이터
// const friend = {
//   id: 1,
//   name: "김민석",
//   username: "minseok",
// }

const diaries = [
  {
    id: 1,
    title: "제주도 여행",
    date: "2025-05-03",
    preview: "제주도에 도착한 첫날, 바다를 보러 갔다. 푸른 바다와 시원한 바람이 정말 좋았다...",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "카페 투어",
    date: "2025-04-25",
    preview: "오늘은 친구와 함께 카페 투어를 했다. 새로 생긴 카페들을 구경하며 다양한 음료를...",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
]

export default function FriendDiariesPage({ params }: { params: { id: string } }) {
  const friend = getFriendById(params.id)
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/friends">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              친구 목록
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{friend.name}님의 일기</h1>
        </div>
      </div>

      {diaries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diaries.map((diary) => (
            <Card key={diary.id} className="overflow-hidden">
              <div className="relative h-48">
                <img
                  src={diary.imageUrl || "/placeholder.svg"}
                  alt={diary.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{diary.title}</h2>
                  <span className="text-sm text-gray-500">{diary.date}</span>
                </div>
                <p className="text-gray-600 line-clamp-3">{diary.preview}</p>
              </CardContent>
              <CardFooter className="flex justify-end p-4 pt-0">
                <Link href={`/friends/${params.id}/diaries/${diary.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    보기
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">공개된 일기가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
