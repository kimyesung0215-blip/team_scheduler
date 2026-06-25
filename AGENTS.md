# Team Scheduler — AGENTS.md

## 프로젝트 개요
로그인한 팀원들이 각자 가능한 시간을 입력하고, 공통 가능 시간을 통합 뷰에서 찾는 협업 스케줄링 앱.
- 일주일 × 30분 단위 그리드 (MVP 고정)
- 다중 인물 반투명 레이어 중첩 + 통합 히트맵
- Google 로그인 (Firebase Auth)
- 6자리 초대 코드로 방 참여
- Firebase Firestore 실시간 동기화
- PWA (오프라인 지원, Android 설치 가능)

## 기술 스택
- React 18 + Vite
- Tailwind CSS
- react-router-dom (해시 라우팅 — GitHub Pages 호환)
- Firebase Auth (Google OAuth) + Firestore
- GitHub Pages 배포 (gh-pages)

## 권한 모델
- member: 기본. 방 생성/참여, 본인 시간표 편집
- owner: 방 생성 시 자동. 설정/강퇴/양도/삭제
- admin: 스키마(users.role)에 필드만 보유, UI는 v2 보류

## 데이터 구조
```
users/{uid}                         name, email, photoURL, role, roomIds[], createdAt
rooms/{roomId}                      name, inviteCode, ownerId, timeUnit(30), memberCount, createdAt
rooms/{roomId}/members/{uid}        name, photoURL, role, colorIndex, joinedAt   # 문서ID=uid
rooms/{roomId}/schedules/{uid}      slots[], updatedAt                          # 문서ID=uid
inviteCodes/{code}                  roomId                                       # 코드→방 역인덱스
```

## 핵심 설계 원칙 (꼬임 방지)
- members / schedules 문서 ID는 반드시 uid → 보안 규칙 `auth.uid == docId` 한 줄
- inviteCodes 별도 컬렉션 → rooms 전체 쿼리 없이 코드로 방 찾기 (보안 규칙 유지)
- name/photoURL/memberCount 역정규화 → Firestore 조인 부재 회피 (MVP는 이름 변경 동기화 무시)

## Firebase 주의사항
- 드래그 중 매 슬롯마다 write 금지 → 드래그 끝날 때 batch write
- Security Rules: 본인 문서만 write, 방 멤버만 read (자세한 건 firestore.rules)
- Google OAuth: Firebase 콘솔 Authorized domains에 kimyesung0215-blip.github.io 등록 필수
- signInWithPopup 우선, 모바일 인앱브라우저 폴백으로 redirect 고려
- API 키는 .env.local에 보관, 레포에는 .env.example만 커밋

## 배포 함정
- vite.config.js base: '/team_scheduler/' (언더스코어, 레포명과 일치)
- PWA manifest start_url, scope도 '/team_scheduler/'
- 라우팅은 해시 기반 (HashRouter) → GitHub Pages 404 회피

## 개발 명령어
```bash
npm install
npm run dev
npm run build
npm run deploy
```
