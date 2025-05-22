import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images') as File[];
    const privacy = (formData.get('privacy') as string) || 'private'; // 공개 설정 추가

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: '이미지가 필요합니다.' },
        { status: 400 }
      );
    }

    // 이미지 정보 로깅 (디버깅용)
    console.log(`받은 이미지 개수: ${images.length}`);
    console.log(`공개 설정: ${privacy}`); // 공개 설정 로깅
    images.forEach((image, index) => {
      console.log(
        `이미지 ${index + 1}: ${image.name}, 크기: ${image.size} bytes, 타입: ${
          image.type
        }`
      );
    });

    // 여기서 실제로는 이미지 처리 로직이 들어갑니다.
    // 예: 이미지 분석, 메타데이터 추출, AI 모델을 통한 일기 생성 등

    // 처리 결과 반환 (예시)
    return NextResponse.json({
      success: true,
      message: '이미지가 성공적으로 처리되었습니다.',
      imageCount: images.length,
      privacy: privacy, // 공개 설정 반환
      // 실제 구현에서는 아래와 같은 정보가 포함될 수 있습니다.
      // content: "AI가 생성한 일기 내용...",
      // metadata: { locations: [...], timestamps: [...] }
    });
  } catch (error) {
    console.error('이미지 처리 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
