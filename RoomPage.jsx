// 3단계에서 채워짐 — 지금은 라우팅 골격만
export default function RoomPage({ roomId }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <p className="text-slate-400 text-sm">방 로딩 중... (roomId: {roomId})</p>
    </div>
  )
}
