import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, BookOpen, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-6">포토다이어리에 오신 것을 환영합니다</h1>
      <p className="text-xl mb-8 max-w-2xl">
        사진을 업로드하면 자동으로 일기를 만들어주는 서비스입니다. 추억을 더 특별하게 기록해보세요.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Camera className="h-12 w-12 mx-auto mb-4 text-blue-500" />
          <h2 className="text-xl font-semibold mb-2">사진 업로드</h2>
          <p>1~5장의 사진을 업로드하여 특별한 순간을 기록하세요.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-500" />
          <h2 className="text-xl font-semibold mb-2">자동 일기 생성</h2>
          <p>사진의 정보를 분석하여 자동으로 일기를 생성해드립니다.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
          <h2 className="text-xl font-semibold mb-2">친구와 공유</h2>
          <p>소중한 추억을 친구들과 함께 나눠보세요.</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/login">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2">시작하기</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline" className="px-8 py-2">
            회원가입
          </Button>
        </Link>
      </div>
    </div>
  )
}
