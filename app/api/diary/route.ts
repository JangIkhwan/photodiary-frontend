import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

//이미지 나중에 TEXT까지 해서 저장하는 예시 API 나중에가서 바꿔야됨

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const images = formData.getAll("images") as File[]
    const content = formData.get("content") as string
    const privacy = formData.get("privacy") as string

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "이미지가 필요합니다." }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ error: "일기 내용이 필요합니다." }, { status: 400 })
    }

    // 이미지 저장 경로 생성
    const diaryId = uuidv4()
    const uploadDir = join(process.cwd(), "public", "uploads", diaryId)

    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      console.error("디렉토리 생성 오류:", error)
      return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
    }

    // 이미지 저장 및 경로 수집
    const imagePaths = []

    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const buffer = Buffer.from(await image.arrayBuffer())
      const fileName = `${Date.now()}-${i}.${image.name.split(".").pop()}`
      const filePath = join(uploadDir, fileName)

      await writeFile(filePath, buffer)
      imagePaths.push(`/uploads/${diaryId}/${fileName}`)
    }

    // 실제 프로젝트에서는 여기서 데이터베이스에 일기 정보 저장
    // 예: await db.diaries.create({ content, privacy, imagePaths, userId: session.user.id });

    // 응답 반환
    return NextResponse.json({
      success: true,
      diaryId,
      imagePaths,
      message: "일기가 성공적으로 저장되었습니다.",
    })
  } catch (error) {
    console.error("일기 저장 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
