"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Eye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ImageResponseDto {
  imageId: number
  imageUrl: string
}

interface Diary {
  diaryId: number
  title: string
  content: string
  isPublic: boolean
  images: ImageResponseDto[]
}

export default function MyDiaryListPage() {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => { 
    const fetchDiaries = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/diarys`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("일기 목록을 불러오는 데 실패했습니다.")
        }

        const data = await response.json()
        setDiaries(data)
      } catch (err: any) {
        setError(err.message || "문제가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchDiaries()
  }, [router])

  if (loading) return <div className="text-center py-12">불러오는 중...</div>
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>

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
            <Card key={diary.diaryId} className="overflow-hidden">
              <div className="relative h-48">
                <img
                  src={diary.images[0]?.imageUrl || "/placeholder.svg"}
                  alt={diary.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{diary.title}</h2>
                  {/* 공개 여부 표시 */}
                  <span className="text-sm text-gray-500">
                    {diary.isPublic ? "공개" : "비공개"}
                  </span>
                </div>
                <p className="text-gray-600 line-clamp-3">{diary.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Link href={`/diary/my/${diary.diaryId}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    보기
                  </Button>
                </Link>
                <Link href={`/diary/my/${diary.diaryId}/edit`}>
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

