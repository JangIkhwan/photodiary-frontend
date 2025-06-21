"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isLoggedIn, logout } = useAuth()
  const router = useRouter()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              포토다이어리
            </Link>
          </div>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/diary/create" className="text-gray-600 hover:text-gray-900">
                  일기 작성
                </Link>
                <Link href="/diary/my" className="text-gray-600 hover:text-gray-900">
                  내 일기
                </Link>
                <Link href="/friends" className="text-gray-600 hover:text-gray-900">
                  친구
                </Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  로그인
                </Link>
                <Link href="/register" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-600 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {isLoggedIn ? (
              <div className="flex flex-col space-y-2">
                <Link href="/diary/create" className="text-gray-600 hover:text-gray-900 py-2" onClick={toggleMenu}>
                  일기 작성
                </Link>
                <Link href="/diary/my" className="text-gray-600 hover:text-gray-900 py-2" onClick={toggleMenu}>
                  내 일기
                </Link>
                <Link href="/friends" className="text-gray-600 hover:text-gray-900 py-2" onClick={toggleMenu}>
                  친구
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    toggleMenu()
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-left"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={toggleMenu}
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  onClick={toggleMenu}
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
