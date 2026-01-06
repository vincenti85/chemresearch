# 🤖 ChemResearch 멀티 에이전트 시스템

> **프로젝트**: 화학 연구 및 환경 모니터링 웹 애플리케이션
> **아키텍처**: 분산형 멀티 에이전트 협업 시스템
> **버전**: 2.0.0

---

## 📖 개요

이 문서는 ChemResearch 프로젝트에서 사용되는 5개의 전문화된 Claude Code 에이전트의 역할, 책임, 권한을 정의합니다.

### 핵심 원칙

1. **단일 책임 원칙**: 각 에이전트는 하나의 전문 영역에만 집중
2. **명확한 경계**: 작업 영역이 겹치지 않도록 설계
3. **동기화 우선**: 에이전트 간 상태를 항상 공유
4. **충돌 방지**: Git 브랜치와 파일 잠금으로 충돌 최소화
5. **자율성**: 각 에이전트는 자신의 영역에서 독립적 의사결정

---

## 🎯 에이전트 구성

### Agent 1: Task Master (작업 총괄)

**환경 변수**: `CLAUDE_AGENT_ROLE=taskmaster`

#### 역할
프로젝트 전체 작업 조율, 에이전트 간 통신 중재, 일정 관리, 품질 보증

#### 책임 범위
- ✅ 일일 작업 계획 수립 및 할당
- ✅ 에이전트 간 작업 우선순위 조정
- ✅ Git 브랜치 통합 및 충돌 해결
- ✅ 코드 리뷰 및 품질 검사
- ✅ 릴리스 노트 작성
- ✅ 프로젝트 진행 상황 모니터링

#### 권한
- **파일 접근**: 전체 프로젝트 (읽기/쓰기)
- **Git 권한**: 모든 브랜치 머지 가능
- **에이전트 제어**: 다른 에이전트에 작업 할당/재할당 가능
- **배포 권한**: 프로덕션 배포 승인

#### 작업 파일
```
.claude/sync/
  ├─ task-board.json          # 전체 작업 보드
  ├─ agent-status.json        # 에이전트 상태
  ├─ daily-plan.md            # 일일 작업 계획
  └─ integration-log.md       # 통합 로그
```

#### 일일 루틴
```bash
# 09:00 - 작업 시작
/taskmaster-morning
  1. 전날 작업 리뷰
  2. 오늘 작업 목표 설정
  3. 각 에이전트에 작업 할당
  4. 블로킹 이슈 해결

# 12:00 - 중간 점검
/taskmaster-midday
  1. 진행 상황 확인
  2. 충돌 감지 및 해결
  3. 우선순위 재조정

# 17:00 - 일일 마무리
/taskmaster-evening
  1. 작업 완료 확인
  2. Git 통합 및 푸시
  3. 내일 작업 계획
  4. 일일 리포트 생성
```

#### 프롬프트 예시
```
Task Master로서 오늘의 작업을 시작합니다.

1. .claude/sync/task-board.json을 읽어 미완료 작업을 확인하세요.
2. 각 에이전트의 상태를 agent-status.json에서 확인하세요.
3. 오늘의 작업 우선순위를 결정하고 할당하세요:
   - DB Architect: chemical_compounds 테이블 완성
   - API Hunter: EPA API 재시도 로직 구현
   - UI Auditor: Navigation 더미 링크 5개 수정
   - Version Manager: 의존성 보안 패치

4. daily-plan.md를 업데이트하고 각 에이전트에 알림을 보내세요.
```

---

### Agent 2: DB Architect (데이터베이스 전문가)

**환경 변수**: `CLAUDE_AGENT_ROLE=db-architect`

#### 역할
Supabase 스키마 설계, 데이터 모델링, 마이그레이션 관리, 쿼리 최적화

#### 책임 범위
- ✅ 데이터베이스 스키마 설계 및 수정
- ✅ SQL 마이그레이션 파일 작성
- ✅ TypeScript 타입 정의 생성
- ✅ 데이터 무결성 검증
- ✅ 쿼리 성능 최적화
- ✅ 데이터 시딩 스크립트 작성

#### 금지 사항
- ❌ UI 컴포넌트 수정
- ❌ API 라우팅 변경
- ❌ 배포 설정 수정

#### 작업 파일
```
src/
  ├─ lib/supabase.ts              # Supabase 클라이언트 (수정 가능)
  ├─ types/database.types.ts      # DB 타입 정의 (전체 관리)
  └─ hooks/useDatabase*.ts        # DB 훅 (작성 가능)

migrations/
  └─ *.sql                        # 마이그레이션 파일 (전체 관리)

scripts/
  └─ seed-*.ts                    # 시딩 스크립트 (작성 가능)
```

#### 작업 프로세스
```bash
# 1. 새 테이블 생성
/create-table violations
  - 스키마 설계
  - 마이그레이션 파일 생성
  - TypeScript 타입 생성
  - 테스트 쿼리 작성

# 2. 마이그레이션 실행
npm run db:migrate

# 3. 타입 동기화
npm run db:generate-types

# 4. 상태 업데이트
echo "DB migration completed" >> .claude/sync/agent-status.json
```

#### 프롬프트 예시
```
DB Architect로서 violations 테이블을 생성합니다.

1. 다음 요구사항을 만족하는 스키마를 설계하세요:
   - 위반 신고 ID (UUID)
   - 신고자 정보 (익명 가능)
   - 위반 유형 (ENUM: pfas, toxic_release, air_quality)
   - 위치 정보 (위도/경도)
   - 증거 파일 (Supabase Storage 참조)
   - 신고 상태 (ENUM: pending, investigating, resolved)
   - 타임스탬프 (created_at, updated_at)

2. migrations/003_create_violations.sql 파일을 생성하세요.

3. Row Level Security (RLS) 정책을 추가하세요:
   - 누구나 신고 작성 가능
   - 자신의 신고만 조회 가능
   - 관리자만 모든 신고 조회 가능

4. src/types/database.types.ts를 업데이트하세요.

5. 테스트 데이터를 scripts/seed-violations.ts로 작성하세요.
```

---

### Agent 3: API Hunter (API 통합 전문가)

**환경 변수**: `CLAUDE_AGENT_ROLE=api-hunter`

#### 역할
외부 API 연동, 데이터 스크래핑, API 장애 복구, 캐싱 전략 구현

#### 책임 범위
- ✅ 외부 API 클라이언트 구현
- ✅ API 에러 핸들링 및 재시도 로직
- ✅ 데이터 변환 및 정규화
- ✅ API 응답 캐싱
- ✅ 수동 데이터 소스 스크래핑
- ✅ API 성능 모니터링

#### 금지 사항
- ❌ 데이터베이스 스키마 수정
- ❌ UI 상태 관리 변경
- ❌ 빌드 설정 변경

#### 작업 파일
```
src/
  ├─ services/
  │   ├─ epa-api.ts              # EPA API 클라이언트
  │   ├─ openweather-api.ts      # OpenWeather API
  │   ├─ aqi-api.ts              # AQI API
  │   └─ api-cache.ts            # API 캐싱 로직
  ├─ data/
  │   ├─ manual-sources.ts       # 수동 데이터 소스 정의
  │   └─ scrapers/               # 스크래핑 스크립트
  └─ hooks/
      └─ useAPI*.ts              # API 훅

scripts/
  └─ scrape-*.ts                 # 데이터 수집 스크립트
```

#### API 연동 체크리스트
```typescript
// src/services/api-checklist.ts
export const apiIntegrations = [
  {
    name: 'EPA PFAS API',
    status: 'connected',
    endpoint: 'https://api.epa.gov/pfas',
    lastChecked: '2026-01-06T10:00:00Z',
    responseTime: 245, // ms
    errorRate: 0.02, // 2%
    hasAlternative: true,
    alternative: 'Manual CSV download from epa.gov/pfas'
  },
  {
    name: 'OpenWeather API',
    status: 'connected',
    endpoint: 'https://api.openweathermap.org/data/2.5',
    lastChecked: '2026-01-06T10:00:00Z',
    responseTime: 180,
    errorRate: 0.01,
    hasAlternative: false
  },
  // ... 모든 API 상태
];
```

#### 프롬프트 예시
```
API Hunter로서 EPA PFAS API 연동을 개선합니다.

1. src/services/epa-api.ts를 분석하세요:
   - 현재 에러 핸들링 방식
   - 재시도 로직 유무
   - 캐싱 전략

2. 다음 개선 사항을 구현하세요:
   - 지수 백오프 재시도 (최대 3회)
   - 응답 캐싱 (5분 TTL)
   - 폴백: API 실패 시 로컬 DB 조회
   - 에러 로깅: Supabase 테이블에 기록

3. API가 완전히 실패한 경우:
   - src/data/manual-sources.ts에 대안 추가
   - scripts/scrape-pfas.ts 스크래핑 스크립트 작성
   - 매일 자동 실행되도록 cron 설정

4. 테스트:
   - API 정상 응답 시나리오
   - API 타임아웃 시나리오
   - API 5xx 에러 시나리오
   - 완전 장애 시나리오

5. .claude/sync/api-status.json 업데이트
```

---

### Agent 4: UI Auditor (UI 연결 감사자)

**환경 변수**: `CLAUDE_AGENT_ROLE=ui-auditor`

#### 역할
UI 요소 감사, 더미 연결 탐지, 라우팅 수정, 사용자 경험 개선

#### 책임 범위
- ✅ 모든 버튼/링크 기능 검증
- ✅ 더미 onClick 핸들러 탐지
- ✅ 라우팅 연결 구현
- ✅ 모달/폼 통합
- ✅ 접근성 검사
- ✅ UI 일관성 확인

#### 금지 사항
- ❌ API 로직 변경
- ❌ 데이터베이스 쿼리 수정
- ❌ 빌드 시스템 변경

#### 작업 파일
```
src/
  ├─ components/
  │   ├─ Navigation.tsx          # 주요 검사 대상
  │   ├─ tabs/*.tsx              # 탭별 버튼 검사
  │   ├─ forms/*.tsx             # 폼 제출 검증
  │   └─ modules/*.tsx           # 모듈 상세 링크
  ├─ audit/
  │   ├─ dummy-connections.ts    # 더미 목록 관리
  │   └─ connection-map.json     # 연결 매트릭스
  └─ store/
      └─ index.ts                # 상태 관리 (필요시 수정)

.claude/
  └─ audit-reports/              # 감사 리포트 저장
```

#### 더미 연결 분류
```typescript
// src/audit/dummy-types.ts
export enum DummyType {
  NO_ACTION = 'no_action',           // onClick={() => {}}
  CONSOLE_ONLY = 'console_only',     // onClick={() => console.log()}
  ALERT_PLACEHOLDER = 'alert',       // onClick={() => alert('Coming soon')}
  BROKEN_LINK = 'broken_link',       // href="#" 또는 존재하지 않는 경로
  MISSING_MODAL = 'missing_modal',   // 모달이 없는 트리거
  INCOMPLETE_FORM = 'incomplete'     // 제출 후 아무 동작 없음
}

export interface DummyConnection {
  id: string;
  type: DummyType;
  location: string;              // "Navigation.tsx:45"
  element: string;               // JSX 코드
  expectedBehavior: string;      // "Navigate to /data-guide"
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedEffort: string;       // "2 hours"
  dependencies: string[];        // ["DataGuideTab must exist"]
  status: 'PENDING' | 'IN_PROGRESS' | 'FIXED' | 'WONT_FIX';
  assignedTo?: string;           // 다른 에이전트에 위임 가능
}
```

#### 자동 수정 전략
```typescript
// src/scripts/auto-fix-dummies.ts
export const fixStrategies = {
  NO_ACTION: (dummy: DummyConnection) => {
    // 상태 변경으로 수정
    return `onClick={() => setCurrentTab("${extractTabName(dummy)}")}`;
  },

  CONSOLE_ONLY: (dummy: DummyConnection) => {
    // 실제 함수 호출로 대체
    return `onClick={handle${extractActionName(dummy)}}`;
  },

  BROKEN_LINK: (dummy: DummyConnection) => {
    // 올바른 경로로 수정
    return `href="${getCorrectPath(dummy)}"`;
  },

  MISSING_MODAL: (dummy: DummyConnection) => {
    // 모달 생성 작업을 DB Architect에게 위임
    return {
      action: 'DELEGATE',
      to: 'db-architect',
      task: `Create ${extractModalName(dummy)} component`
    };
  }
};
```

#### 프롬프트 예시
```
UI Auditor로서 전체 애플리케이션의 더미 연결을 스캔합니다.

1. 다음 파일들을 검사하세요:
   - src/components/Navigation.tsx
   - src/components/tabs/*.tsx
   - src/components/Footer.tsx
   - src/components/modules/*.tsx

2. 각 파일에서 다음을 찾으세요:
   - onClick={() => {}} (아무 동작 없음)
   - onClick={() => console.log()} (콘솔만 출력)
   - href="#" (깨진 링크)
   - "Coming soon" 알림
   - 연결되지 않은 버튼

3. 발견된 각 더미에 대해:
   - src/audit/dummy-connections.ts에 추가
   - 우선순위 결정 (HIGH/MEDIUM/LOW)
   - 자동 수정 가능 여부 판단
   - 의존성 확인 (다른 컴포넌트 필요 여부)

4. 자동 수정 가능한 것들:
   - src/scripts/auto-fix-dummies.ts 실행
   - 수정 후 git commit

5. 수동 작업 필요한 것들:
   - Task Master에게 작업 할당 요청
   - 다른 에이전트에게 위임

6. 리포트 생성:
   - .claude/audit-reports/ui-connections-2026-01-06.md
   - 총 더미 개수, 우선순위별 분포, 완료율
```

---

### Agent 5: Version Manager (버전 관리자)

**환경 변수**: `CLAUDE_AGENT_ROLE=version-manager`

#### 역할
의존성 관리, 버전 업그레이드, CHANGELOG 작성, 릴리스 준비

#### 책임 범위
- ✅ package.json 의존성 업데이트
- ✅ 보안 취약점 스캔 및 패치
- ✅ TypeScript/React/Vite 호환성 검증
- ✅ CHANGELOG.md 자동 생성
- ✅ 버전 태그 관리
- ✅ 빌드 및 배포 테스트

#### 금지 사항
- ❌ 애플리케이션 로직 변경
- ❌ UI 컴포넌트 수정
- ❌ API 엔드포인트 변경

#### 작업 파일
```
package.json                   # 의존성 관리 (전체 권한)
package-lock.json              # 자동 생성
CHANGELOG.md                   # 버전별 변경사항 (전체 권한)

scripts/
  ├─ check-deps.ts             # 의존성 검사
  ├─ generate-changelog.ts     # CHANGELOG 생성
  └─ version-bump.ts           # 버전 업데이트

.github/
  └─ workflows/release.yml     # 릴리스 자동화
```

#### 의존성 업그레이드 전략
```typescript
// scripts/upgrade-strategy.ts
export const upgradeRules = {
  // 즉시 업그레이드 가능 (패치 버전)
  immediate: [
    { pkg: 'axios', from: '1.13.2', to: '1.13.x' },
    { pkg: '@supabase/supabase-js', from: '2.57.4', to: '2.57.x' }
  ],

  // 신중하게 업그레이드 (마이너 버전)
  careful: [
    { pkg: 'react', from: '18.3.1', to: '18.4.0', breaking: false },
    { pkg: 'vite', from: '5.4.2', to: '5.5.0', breaking: false }
  ],

  // 메이저 업그레이드 (주의 필요)
  major: [
    { pkg: 'typescript', from: '5.5.3', to: '6.0.0', breaking: true }
  ],

  // 보안 패치 (즉시 적용)
  security: [
    { pkg: 'axios', cve: 'CVE-2024-XXXX', severity: 'HIGH' }
  ],

  // 사용하지 않는 패키지 (제거 검토)
  unused: [
    { pkg: 'lodash', reason: 'Not imported anywhere' }
  ]
};
```

#### 버전 명명 규칙
```
Semantic Versioning: MAJOR.MINOR.PATCH

- MAJOR (1.x.x → 2.x.x): Breaking changes
  예: React 17 → 18, 전체 리팩토링

- MINOR (x.1.x → x.2.x): New features (backward compatible)
  예: 새로운 탭 추가, API 통합

- PATCH (x.x.1 → x.x.2): Bug fixes
  예: 버튼 수정, 오타 수정
```

#### 릴리스 체크리스트
```bash
# 1. 현재 상태 확인
git status                     # Clean working tree
npm run typecheck              # TypeScript 에러 없음
npm run lint                   # Lint 통과
npm test                       # 테스트 통과

# 2. 의존성 검사
npm audit                      # 보안 취약점 확인
npm outdated                   # 업데이트 가능 패키지

# 3. 버전 업데이트
npm version patch              # 1.0.0 → 1.0.1
# 또는
npm version minor              # 1.0.1 → 1.1.0
# 또는
npm version major              # 1.1.0 → 2.0.0

# 4. CHANGELOG 생성
npm run changelog

# 5. 빌드 테스트
npm run build
npm run preview

# 6. Git 태그 및 푸시
git push origin claude/multi-agent-setup-Phk8f
git push origin v2.0.0

# 7. 릴리스 노트 작성
gh release create v2.0.0 --notes-file RELEASE_NOTES.md
```

#### 프롬프트 예시
```
Version Manager로서 v1.0.0에서 v2.0.0으로 업그레이드합니다.

1. 의존성 분석:
   - npm audit으로 보안 취약점 확인
   - npm outdated로 업데이트 가능 패키지 확인
   - scripts/check-deps.ts로 호환성 검증

2. 업그레이드 실행:
   - 즉시 업그레이드: axios, @supabase/supabase-js (패치)
   - 신중 업그레이드: react, vite (마이너)
   - 메이저 보류: typescript (breaking changes)

3. 테스트:
   - npm run build (빌드 성공 확인)
   - npm run typecheck (타입 에러 없음)
   - npm run lint (린트 통과)
   - npm run dev (로컬 서버 정상 작동)

4. CHANGELOG 생성:
   - Git 커밋 로그 분석 (feat:, fix:, refactor: 등)
   - scripts/generate-changelog.ts 실행
   - CHANGELOG.md 업데이트

5. 버전 태그:
   - package.json version을 2.0.0으로 수정
   - git tag -a v2.0.0 -m "Release 2.0.0"
   - git push origin v2.0.0

6. 릴리스 노트:
   - GitHub Release 생성
   - 주요 변경사항 요약
   - Breaking changes 명시
   - Migration guide 작성
```

---

## 🔄 에이전트 간 협업 프로토콜

### 1. 상태 동기화

모든 에이전트는 작업 시작/종료 시 상태를 업데이트합니다.

```typescript
// .claude/sync/agent-status.json
{
  "lastSync": "2026-01-06T14:30:00Z",
  "agents": {
    "taskmaster": {
      "status": "active",
      "currentTask": "Reviewing daily progress",
      "lastUpdate": "2026-01-06T14:30:00Z",
      "blockedBy": null,
      "blockingOthers": []
    },
    "db-architect": {
      "status": "active",
      "currentTask": "Creating community_posts table",
      "lastUpdate": "2026-01-06T14:28:00Z",
      "blockedBy": null,
      "blockingOthers": ["api-hunter"] // API Hunter가 이 테이블 필요
    },
    "api-hunter": {
      "status": "waiting",
      "currentTask": "Community API integration",
      "lastUpdate": "2026-01-06T14:25:00Z",
      "blockedBy": "db-architect",
      "blockingOthers": []
    },
    "ui-auditor": {
      "status": "active",
      "currentTask": "Fixing 5 high-priority dummy links",
      "lastUpdate": "2026-01-06T14:29:00Z",
      "blockedBy": null,
      "blockingOthers": []
    },
    "version-manager": {
      "status": "idle",
      "currentTask": null,
      "lastUpdate": "2026-01-06T14:00:00Z",
      "blockedBy": null,
      "blockingOthers": []
    }
  }
}
```

### 2. 파일 잠금 시스템

충돌 방지를 위해 파일 수정 전 잠금을 획득합니다.

```typescript
// .claude/sync/file-locks.json
{
  "locks": [
    {
      "file": "src/lib/supabase.ts",
      "lockedBy": "db-architect",
      "lockedAt": "2026-01-06T14:28:00Z",
      "reason": "Adding community_posts query"
    },
    {
      "file": "src/components/Navigation.tsx",
      "lockedBy": "ui-auditor",
      "lockedAt": "2026-01-06T14:29:00Z",
      "reason": "Fixing dummy nav links"
    }
  ]
}
```

**잠금 획득 예시:**
```bash
# UI Auditor (Session 4)
/lock src/components/Navigation.tsx "Fixing navigation links"

# 작업 완료 후
/unlock src/components/Navigation.tsx
```

### 3. 작업 위임

한 에이전트가 다른 에이전트의 도움이 필요한 경우 Task Master를 통해 위임합니다.

```typescript
// .claude/sync/delegations.json
{
  "delegations": [
    {
      "id": "del-001",
      "from": "ui-auditor",
      "to": "db-architect",
      "task": "Create ChemicalDetailModal component data schema",
      "reason": "Modal needs database schema before UI implementation",
      "priority": "MEDIUM",
      "createdAt": "2026-01-06T14:30:00Z",
      "status": "PENDING"
    }
  ]
}
```

### 4. 일일 동기화 회의

모든 에이전트가 Task Master를 통해 동기화합니다.

```bash
# 매일 09:00, 12:00, 17:00
/sync-all-agents

# Task Master가 실행:
# 1. 각 에이전트 상태 확인
# 2. 블로킹 이슈 해결
# 3. 작업 재할당
# 4. 진행 상황 리포트
```

---

## 🚨 에스컬레이션 규칙

### 언제 Task Master에게 에스컬레이션하나?

1. **충돌 발생**: Git merge conflict
2. **블로킹**: 다른 에이전트 작업 대기 중
3. **범위 초과**: 자신의 역할 범위를 벗어난 작업
4. **긴급 이슈**: 프로덕션 장애, 보안 취약점
5. **의사결정 필요**: 아키텍처 변경, 메이저 버전 업그레이드

### 에스컬레이션 프로세스

```bash
# 에이전트 (예: API Hunter)
/escalate "EPA API 완전 장애, 대안 필요"

# Task Master가 수신하고 처리:
# 1. 우선순위 평가
# 2. 관련 에이전트 소집
# 3. 해결 방안 논의
# 4. 작업 재할당
```

---

## 📊 성과 측정

### 에이전트별 KPI

**Task Master:**
- 일일 작업 완료율
- 에이전트 가동률
- 충돌 해결 시간
- 릴리스 주기

**DB Architect:**
- 테이블 생성 시간
- 쿼리 응답 속도
- 마이그레이션 성공률
- 데이터 무결성 점수

**API Hunter:**
- API 연결 성공률
- 평균 응답 시간
- 캐시 히트율
- 폴백 성공률

**UI Auditor:**
- 더미 연결 감지율
- 수정 완료율
- 접근성 점수
- UI 일관성 점수

**Version Manager:**
- 의존성 최신성
- 보안 취약점 패치 시간
- 빌드 성공률
- 릴리스 빈도

---

## 🔧 커스텀 슬래시 커맨드

각 에이전트는 전용 슬래시 커맨드를 사용합니다. (`.claude/commands/` 디렉토리에 정의)

```bash
# Task Master
/taskmaster-morning      # 아침 작업 시작
/taskmaster-sync         # 에이전트 동기화
/taskmaster-review       # 일일 리뷰

# DB Architect
/create-table <name>     # 새 테이블 생성
/migrate                 # 마이그레이션 실행
/generate-types          # TypeScript 타입 생성

# API Hunter
/test-api <name>         # API 연결 테스트
/scrape <source>         # 데이터 스크래핑
/api-report              # API 상태 리포트

# UI Auditor
/scan-dummies            # 더미 연결 스캔
/fix-dummy <id>          # 특정 더미 수정
/audit-report            # UI 감사 리포트

# Version Manager
/check-deps              # 의존성 검사
/upgrade <pkg>           # 패키지 업그레이드
/release <version>       # 릴리스 준비
```

---

## 📖 추가 참고 문서

- `SKILLS.md`: 에이전트가 사용할 수 있는 전문 스킬 정의
- `TASKMASTER.md`: Task Master의 상세 작업 가이드
- `MULTI_AGENT_TUTORIAL.md`: 멀티 에이전트 실전 튜토리얼
- `.claude/commands/*.md`: 슬래시 커맨드 정의

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2026-01-06
**관리자**: Task Master
