"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

type Image = {
  imageId: number
  imageUrl: string
}

type Diary = {
  diaryId: number
  title: string
  content: string
  images: Image[]
  isPublic: boolean
}

export default function DiaryDetailPage({ params }: { params: { id: string } }) {
  const id = params.id
  const [diary, setDiary] = useState<Diary | null>(null)
  useEffect(() => {

    const fetchDiary = async () => {
      console.log(` 엔드포인트 : ${process.env.NEXT_PUBLIC_API_BASE}`)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/diarys/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!res.ok) throw new Error("일기 불러오기 실패")
        const data = await res.json()
        setDiary(data)
      } catch (err) {
        console.error("일기 상세 조회 실패:", err)
      }
    }

    fetchDiary()
  }, [id])

  if (!diary) {
    return <p className="text-center mt-10 text-gray-500">일기를 불러오는 중...</p>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/diary/my">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{diary.title}</h1>
            <span className="text-sm text-gray-500">{/* 날짜가 없다면 생략 */}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {diary.images.map((image, index) => (
              <div key={image.imageId} className="overflow-hidden rounded-md">
                <img
                  src={image.imageUrl || "/placeholder.svg"}
                  alt={`일기 이미지 ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>

          <div className="whitespace-pre-line text-gray-700">{diary.content}</div>

          <div className="mt-4 text-sm text-gray-500">
            공개 설정: {diary.isPublic ? "전체 공개" : "비공개"}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end p-6 pt-0">
          <Link href={`/diary/my/${diary.diaryId}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              수정하기
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

