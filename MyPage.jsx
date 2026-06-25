import { useAuth } from '../contexts/AuthContext'

export default function MyPage({ onCreateRoom, onJoinRoom }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">

      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-10 pb-6">
        <h1 className="text-xl font-bold">팀 스케줄러</h1>
        <button
          onClick={logout}
          className="text-xs text-slate-400 hover:text-slate-200 transition"
        >
          로그아웃
        </button>
      </div>

      {/* 프로필 */}
      <div className="flex items-center gap-3 px-5 pb-8">
        {user.photoURL && (
          <img src={user.photoURL} alt="" className="w-11 h-11 rounded-full" />
        )}
        <div>
          <p className="font-semibold text-base">{user.displayName}</p>
          <p className="text-slate-400 text-xs">{user.email}</p>
        </div>
      </div>

      {/* 방 목록 */}
      <div className="flex-1 px-5">
        <p className="text-slate-400 text-sm font-medium mb-3">내 방</p>

        {/* 빈 상태 — 3단계에서 실제 목록으로 교체 */}
        <div className="flex flex-col items-center justify-center py-20 text-slate-600">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
          </svg>
          <p className="text-sm">아직 참여한 방이 없어요</p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pb-10 flex flex-col gap-3">
        <button
          onClick={onCreateRoom}
          className="w-full py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400
            font-semibold text-sm transition"
        >
          + 방 만들기
        </button>
        <button
          onClick={onJoinRoom}
          className="w-full py-3.5 rounded-xl bg-slate-700 hover:bg-slate-600
            font-semibold text-sm transition"
        >
          코드로 참여하기
        </button>
      </div>
    </div>
  )
}
