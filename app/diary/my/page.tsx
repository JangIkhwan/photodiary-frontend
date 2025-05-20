import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Edit, Eye, Plus } from "lucide-react"

// 더미 데이터
const diaries = [
  {
    id: 1,
    title: "친구들과 카페에서",
    date: "2025-05-05",
    preview: "오늘은 친구들과 함께 카페에서 만났다. 오랜만에 만난 친구들과 이야기를 나누며...",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "한강 피크닉",
    date: "2025-05-01",
    preview: "날씨가 좋아서 한강으로 피크닉을 갔다. 강가에 돗자리를 펴고 앉아 도시락을 먹으며...",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "전시회 관람",
    date: "2025-04-28",
    preview: "오늘은 미술관에서 열리는 전시회를 관람했다. 다양한 작품들을 보며 많은 영감을...",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
]

export default function MyDiaryListPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">내 일기 목록</h1>
        <Link href="/diary/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />새 일기 작성
          </Button>
        </Link>
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
              <CardFooter className="flex justify-between p-4 pt-0">
                <Link href={`/diary/my/${diary.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    보기
                  </Button>
                </Link>
                <Link href={`/diary/my/${diary.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    수정
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">작성된 일기가 없습니다.</p>
          <Link href="/diary/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />첫 일기 작성하기
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
