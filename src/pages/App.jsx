import { HashRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import MyPage from './pages/MyPage'
import RoomPage from './pages/RoomPage'

// 로그인 필요 라우트 가드
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
      불러오는 중...
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

// MyPage에 navigate를 props로 전달하는 래퍼
function MyPageWrapper() {
  const navigate = useNavigate()
  return (
    <MyPage
      onCreateRoom={() => navigate('/room/new')}
      onJoinRoom={() => navigate('/room/join')}
    />
  )
}

// RoomPage에 roomId 넘기는 래퍼
function RoomPageWrapper() {
  const { roomId } = useParams()
  return <RoomPage roomId={roomId} />
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute><MyPageWrapper /></PrivateRoute>} />
        <Route path="/room/:roomId" element={<PrivateRoute><RoomPageWrapper /></PrivateRoute>} />
        {/* 3단계에서 추가: /room/new, /room/join */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

// 이미 로그인한 상태에서 /login 접근 시 홈으로
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/" replace /> : children
}
