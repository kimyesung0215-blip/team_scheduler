import { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'

export default function App() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center
        bg-slate-900 text-slate-400 text-sm">
        불러오는 중...
      </div>
    )
  }

  if (!user) return <LoginPage />

  // 임시 화면 — 2단계에서 마이페이지/라우팅으로 교체
  return (
    <div className="h-screen flex flex-col items-center justify-center
      bg-slate-900 text-white gap-4">
      {user.photoURL && (
        <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full" />
      )}
      <p className="text-lg font-semibold">{user.displayName}</p>
      <p className="text-slate-400 text-sm">{user.email}</p>
      <p className="text-green-400 text-sm">✓ 로그인 성공 · users 문서 생성됨</p>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
      >
        로그아웃
      </button>
    </div>
  )
}
