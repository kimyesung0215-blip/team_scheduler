import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithPopup, signInWithRedirect, getRedirectResult,
  signOut, onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from '../lib/firebase'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// 로그인한 유저의 users/{uid} 문서를 보장 (없으면 생성)
async function ensureUserDoc(user) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName || '이름없음',
      email: user.email || '',
      photoURL: user.photoURL || '',
      role: 'member',      // admin 대비 필드 (UI는 보류)
      roomIds: [],
      createdAt: serverTimestamp(),
    })
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 모바일 인앱브라우저 폴백(redirect) 결과 처리
    getRedirectResult(auth).catch(() => {})

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try { await ensureUserDoc(u) } catch (e) { console.error(e) }
        setUser(u)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      // popup이 막히는 환경(모바일 인앱브라우저 등) → redirect 폴백
      if (
        e.code === 'auth/popup-blocked' ||
        e.code === 'auth/popup-closed-by-user' ||
        e.code === 'auth/cancelled-popup-request'
      ) {
        await signInWithRedirect(auth, googleProvider)
      } else {
        console.error('로그인 실패:', e)
        throw e
      }
    }
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
