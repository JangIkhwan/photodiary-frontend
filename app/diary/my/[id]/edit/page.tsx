"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function EditDiaryPage({ params }: { params: { id: string } }) {
  const diaryId = params.id;
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    console.log("현재 diaryId:", diaryId);
  }, [diaryId]);
  

  useEffect(() => {
    const fetchDiary = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/diarys/${diaryId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("일기 데이터를 불러오는 데 실패했습니다.")
        }

        const data = await response.json()
        setTitle(data.title)
        setContent(data.content)
        setIsPublic(data.isPublic)
      } catch (err: any) {
        setError(err.message || "문제가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    if (diaryId) {
      fetchDiary()
    }
  }, [diaryId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/diarys/${diaryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content , isPublic }),
      })

      if (!response.ok) {
        throw new Error("일기 수정에 실패했습니다.")
      }

      alert("일기가 성공적으로 수정되었습니다.")
      router.push("/diary/my")
    } catch (err: any) {
      setError(err.message || "문제가 발생했습니다.")
    }
  }

  if (loading) return <div className="text-center py-12">불러오는 중...</div>
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">일기 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            제목
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            내용
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
          />
        </div>
        <div className="flex items-center">
          <input
            id="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isPublic" className="text-sm text-gray-700">
            공개 여부
          </label>
        </div>
        <Button type="submit" className="w-full">
          수정하기
        </Button>
      </form>
    </div>
  )
}
