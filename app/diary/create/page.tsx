'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

export default function CreateDiaryPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState(''); // 일기 제목 상태 추가
  const [generatedContent, setGeneratedContent] = useState('');
  const [privacy, setPrivacy] = useState('private');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).slice(0, 5);
      setImages(fileArray);

      // 이미지 미리보기 생성
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const generateDiary = async () => {
    if (images.length === 0) return;
  
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
        return;
      }
  
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("privacy", privacy);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/diarys/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("이미지 처리에 실패했습니다.");
      }
  
      const data = await response.json();
      console.log("이미지 처리 결과:", data);
  
      if (data.success) {
        // API 응답에서 제목과 내용 설정
        if (data.title) {
          setGeneratedTitle(data.title);
        }
        if (data.content) {
          setGeneratedContent(data.content);
        } else {
          setGeneratedContent("일기 내용이 생성되지 않았습니다.");
        }
      }
    } catch (error) {
      console.error("이미지 처리 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveDiary = async () => {
    if (images.length === 0) {
      console.error("이미지가 없습니다. 일기를 저장할 수 없습니다.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
      return;
    }

    console.log(`save request url = ${process.env.NEXT_PUBLIC_API_BASE}/diarys`);
    console.log("일기 저장 요청 보내기");
  
    try {
      // 로딩 상태 설정
      setIsLoading(true);
  
      // FormData 객체 생성
      const formData = new FormData();
  
      // 이미지 파일 추가
      images.forEach((image) => {
        formData.append("images", image);
      });
  
      // 일기 제목, 내용 및 공개 설정 추가 (JSON으로 직렬화하여 request 파트로 추가)
      const requestPayload = {
        title: generatedTitle,
        content: generatedContent,
        privacy: privacy,
      };
  
      formData.append(
        "request",
        new Blob([JSON.stringify(requestPayload)], { type: "application/json" })
      );
  
      // API 호출 - 서버 주소는 환경 변수에서 가져옴
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/diarys`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("일기 저장에 실패했습니다.");
      }
  
      const data = await response.json();
      console.log("일기 저장 성공:", data);
  
      // 성공 시 일기 목록 페이지로 이동
      router.push("/diary/my");
    } catch (error) {
      console.error("일기 저장 중 오류 발생:", error);
      // 오류 처리 로직 (예: 사용자에게 알림)
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6'>일기 작성</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>사진 업로드</CardTitle>
            <CardDescription>
              1~5장의 사진을 업로드하세요. 사진을 기반으로 일기가 생성됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mb-4'>
              <Label htmlFor='images' className='cursor-pointer'>
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center'>
                  <Upload className='h-10 w-10 text-gray-400 mb-2' />
                  <p className='text-sm text-gray-500'>
                    클릭하여 사진을 선택하거나 여기에 드래그하세요
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>
                    최대 5장, 파일 형식: JPG, PNG
                  </p>
                </div>
                <input
                  id='images'
                  type='file'
                  multiple
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageUpload}
                />
              </Label>
            </div>

            {previews.length > 0 && (
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                {previews.map((preview, index) => (
                  <div key={index} className='relative group'>
                    <img
                      src={preview || '/placeholder.svg'}
                      alt={`업로드 이미지 ${index + 1}`}
                      className='h-24 w-full object-cover rounded-md'
                    />
                    <button
                      type='button'
                      onClick={() => removeImage(index)}
                      className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {previews.length === 0 && (
              <div className='flex items-center justify-center h-24 bg-gray-50 rounded-md'>
                <div className='text-center text-gray-500'>
                  <ImageIcon className='h-8 w-8 mx-auto mb-1' />
                  <p className='text-sm'>사진이 없습니다</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={generateDiary}
              disabled={images.length === 0 || isLoading}
              className='w-full'
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  일기 생성 중...
                </>
              ) : (
                '일기 생성하기'
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>생성된 일기</CardTitle>
            <CardDescription>
              생성된 일기를 확인하고 필요한 경우 수정하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='title'>일기 제목</Label>
                <Input
                  id='title'
                  placeholder="사진을 업로드하고 '일기 생성하기' 버튼을 클릭하면 여기에 제목이 생성됩니다."
                  value={generatedTitle}
                  onChange={(e) => setGeneratedTitle(e.target.value)}
                  className='mt-1'
                />
              </div>
              <div>
                <Label htmlFor='content'>일기 내용</Label>
                <Textarea
                  id='content'
                  placeholder="사진을 업로드하고 '일기 생성하기' 버튼을 클릭하면 여기에 일기가 생성됩니다."
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className='min-h-[200px] mt-1'
                />
              </div>
              <div>
                <Label htmlFor='privacy' className='block mb-2'>
                  공개 설정
                </Label>
                <Select value={privacy} onValueChange={setPrivacy}>
                  <SelectTrigger id='privacy'>
                    <SelectValue placeholder='공개 설정 선택' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='friends'>친구에게 공개</SelectItem>
                    <SelectItem value='private'>비공개</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={ () => {
                saveDiary();
              }}
              disabled={!generatedContent || isLoading}
              className='w-full'
            >
              일기 저장하기
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
