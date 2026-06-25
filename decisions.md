# 설계 결정 기록

## 2025 — 초기 설계

### DB: Firebase Firestore 선택
- 대안: Supabase, Gist 폴링, URL 인코딩
- 이유: GitHub Pages + 실시간 동기화 조합에서 설정 최소화
- 트레이드오프: 무료 한도(읽기 50k/일, 쓰기 20k/일) 존재

### 드래그 최적화: batch write 방식
- 드래그 중에는 로컬 상태만 업데이트
- mouseup / touchend 시점에 변경된 슬롯 전체를 한 번에 Firestore write
- 이유: 슬롯마다 write하면 드래그 한 번에 수십 회 쓰기 발생 → 한도 초과 위험

### 동기화 단위: 인물별 문서
- rooms/{roomId}/people/{personId} — 인물 정보 (이름, 색상)
- rooms/{roomId}/schedules/{personId} — 해당 인물의 슬롯 데이터
- 이유: 인물별로 독립 문서 → 충돌 없음 (각자 자기 문서만 수정)

### 색상 중첩: CSS rgba 레이어
- 각 인물의 활성 슬롯을 rgba(r,g,b,0.45)로 절대 위치 겹침
- 우측 하단 숫자 배지: 해당 슬롯에 체크한 인물 수 표시
- 이유: 별도 합성 계산 없이 CSS만으로 시각적 중첩 표현 가능

### 방(Room) 식별: nanoid 랜덤 ID
- URL: /rooms/:roomId
- 이유: 로그인 없이 링크 공유만으로 팀원 초대 가능

### PWA
- vite-plugin-pwa 사용
- start_url, scope → '/team-scheduler/' (GitHub Pages 서브패스)
- 오프라인: Firestore 내장 캐시로 자동 처리

---

## 2026-06 — v2 재설계 (인증 + 권한 도입)

### Auth: Google OAuth only
- 대안: Anonymous(폐기 — 기기 변경 시 데이터 소실), Email/Password(비번 재설정 공수 큼)
- 이유: 팀원 전원 Google 계정 보유, 가입 마찰 최소
- signInWithPopup 우선, 모바일 폴백 redirect 고려

### 권한 모델: member / owner / (admin 보류)
- users.role 필드는 처음부터 둠 → 나중에 admin 추가 시 마이그레이션 불필요
- admin UI는 v2로 보류 (9인 팀 기준 오버스펙)

### 문서 ID = uid 강제
- members/{uid}, schedules/{uid}
- 이유: 보안 규칙이 `request.auth.uid == docId` 한 줄로 끝남
- 트레이드오프: 1인 1방 1문서 고정 (문제 없음)

### inviteCodes 별도 컬렉션
- 코드→roomId 역방향 인덱스
- 이유: rooms 전체 쿼리 없이 코드로 방 검색 (보안 규칙상 남의 방 못 읽음)
- 6자리 영숫자, 발급 시 중복 체크

### 역정규화
- members 문서에 name/photoURL 복사, rooms에 memberCount
- 이유: Firestore 조인 부재 → 목록 그릴 때 users N회 읽기 회피
- 트레이드오프: 이름 변경 시 동기화 필요 (MVP 무시, v2 처리)

### timeUnit
- 스키마 보유, MVP는 30분 고정 (UI 선택은 v2)
- 이유: 가변 단위는 통합뷰 슬롯 인덱싱을 복잡하게 만듦

### 이전 코드 재사용 범위
- 재사용: useDrag.js, SlotCell.jsx, colors.js (UI 레이어)
- 폐기/신규: useSchedule.js, App.jsx, 인증/라우팅/페이지 전부

### 보안 규칙 적용 시점
- 3단계(방 생성/참여)에서 즉시 적용
- 이유: 8단계까지 미루면 "전부 열림" 상태로 테스트 → 규칙 켤 때 추적 불가
