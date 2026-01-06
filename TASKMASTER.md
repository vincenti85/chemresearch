# 🎯 Task Master 운영 가이드

> **역할**: ChemResearch 멀티 에이전트 시스템 총괄 조율자
> **목표**: 5개 에이전트의 효율적 협업 및 프로젝트 성공적 완료
> **우선순위**: 팀 생산성 극대화, 충돌 최소화, 일정 준수

---

## 📋 목차

1. [Task Master의 역할](#1-task-master의-역할)
2. [일일 루틴](#2-일일-루틴)
3. [작업 보드 관리](#3-작업-보드-관리)
4. [에이전트 조율](#4-에이전트-조율)
5. [충돌 해결](#5-충돌-해결)
6. [품질 관리](#6-품질-관리)
7. [릴리스 관리](#7-릴리스-관리)

---

## 1. Task Master의 역할

### 1.1 핵심 책임

```
┌──────────────────────────────────────────────┐
│         Task Master 책임 영역                 │
├──────────────────────────────────────────────┤
│ 1. 전략 수립: 프로젝트 로드맵 및 일정 관리      │
│ 2. 작업 할당: 에이전트별 작업 분배 및 우선순위  │
│ 3. 품질 보증: 코드 리뷰, 테스트, 통합 검증      │
│ 4. 충돌 중재: Git 충돌, 의존성 충돌 해결        │
│ 5. 진행 추적: 일일/주간 진행 상황 모니터링      │
│ 6. 커뮤니케이션: 에이전트 간 정보 동기화        │
└──────────────────────────────────────────────┘
```

### 1.2 권한

✅ **전체 프로젝트 파일 접근 (읽기/쓰기)**
✅ **모든 Git 브랜치 머지 권한**
✅ **에이전트 작업 할당/재할당**
✅ **프로덕션 배포 승인**
✅ **긴급 상황 시 다른 에이전트 작업 중단 가능**

### 1.3 금지 사항

❌ 다른 에이전트의 전문 영역에 직접 개입 (예외: 긴급 상황)
❌ 에이전트 간 충돌 무시 또는 임의 결정
❌ 검증 없는 프로덕션 배포

---

## 2. 일일 루틴

### 2.1 오전 루틴 (09:00 - 09:30)

```bash
# Session 1 - Task Master 터미널

# 1. 작업 시작 선언
/taskmaster-morning

# 실행 내용:
```

**체크리스트:**
```markdown
## 🌅 오전 시작 체크리스트

### 1️⃣ 전날 작업 리뷰
- [ ] `.claude/reports/daily-{yesterday}.md` 읽기
- [ ] 미완료 작업 확인
- [ ] 블로킹 이슈 파악

### 2️⃣ Git 상태 확인
- [ ] `git status` - 모든 변경사항 커밋됨?
- [ ] `git log --oneline --since="yesterday"` - 전날 커밋 리뷰
- [ ] `git branch -a` - 머지 필요한 브랜치 확인

### 3️⃣ 에이전트 상태 확인
```bash
cat .claude/sync/agent-status.json | jq '.agents'
```
- [ ] 모든 에이전트 상태가 정상인가?
- [ ] 블로킹 체인 있는가?
- [ ] 어제 완료 못한 작업의 담당 에이전트 확인

### 4️⃣ 오늘의 목표 설정
```typescript
// .claude/sync/daily-plan.md 업데이트
## Daily Plan - 2026-01-06

### 🎯 오늘의 목표
1. [HIGH] violations 테이블 완성 및 API 연동
2. [HIGH] Navigation 더미 링크 5개 수정
3. [MEDIUM] 의존성 보안 패치 적용
4. [LOW] 테스트 커버리지 70% 달성

### 📋 에이전트별 작업

#### DB Architect
- [ ] violations 테이블 스키마 완성
- [ ] RLS 정책 추가
- [ ] 시딩 데이터 작성

#### API Hunter
- [ ] EPA API 재시도 로직 구현
- [ ] violations API 엔드포인트 연동
- [ ] API 응답 캐싱 (5분 TTL)

#### UI Auditor
- [ ] Navigation.tsx 더미 링크 5개 수정
- [ ] ViolationsTab 상세 버튼 연결
- [ ] 더미 연결 리포트 업데이트

#### Version Manager
- [ ] npm audit 실행
- [ ] 보안 패치 적용 (axios, vite)
- [ ] package-lock.json 업데이트

### ⚠️ 블로킹 이슈
- API Hunter가 violations 테이블 대기 중
  → DB Architect가 오전 중 완료 예정

### 📊 예상 완료 시간
- violations 테이블: 11:00
- API 연동: 14:00
- UI 수정: 16:00
- 보안 패치: 15:00
```

### 5️⃣ 작업 할당
```bash
# 각 에이전트에게 작업 할당
# (실제로는 .claude/sync/task-board.json 업데이트)

# DB Architect
/assign db-architect "Complete violations table with RLS policies"

# API Hunter
/assign api-hunter "Implement EPA API retry logic"

# UI Auditor
/assign ui-auditor "Fix 5 high-priority navigation dummy links"

# Version Manager
/assign version-manager "Apply security patches for axios and vite"
```
```

---

### 2.2 중간 점검 (12:00 - 12:15)

```bash
/taskmaster-midday

# 실행 내용:
```

**체크리스트:**
```markdown
## 🌞 정오 점검 체크리스트

### 1️⃣ 진행 상황 확인
```bash
# 각 에이전트 상태 조회
cat .claude/sync/agent-status.json | jq '.agents | to_entries[] | {agent: .key, status: .value.status, task: .value.currentTask}'
```

### 2️⃣ 완료율 계산
```typescript
// 예상 대비 실제 완료율
const morning_tasks = 4; // 오전에 계획된 작업
const completed = 2;     // 실제 완료된 작업
const completion_rate = (completed / morning_tasks) * 100; // 50%

if (completion_rate < 60) {
  console.log('⚠️ 진행 속도 느림 - 우선순위 재조정 필요');
}
```

### 3️⃣ 블로킹 해결
- violations 테이블 완성되었나? → API Hunter 블로킹 해제
- Git 충돌 발생했나? → 즉시 해결
- 에이전트 간 의존성 문제 있나?

### 4️⃣ 우선순위 재조정
```markdown
만약 진행이 늦다면:
1. LOW 우선순위 작업 내일로 연기
2. MEDIUM 작업 중 일부 다른 에이전트에 재할당
3. HIGH 작업에 리소스 집중
```

### 5️⃣ 오후 계획 조정
```bash
# .claude/sync/daily-plan.md 업데이트
## Afternoon Adjustments

- DB Architect: violations 완료 지연 → API Hunter 다른 작업 먼저 진행
- UI Auditor: 5개 → 3개로 목표 축소, 품질 우선
- Version Manager: 보안 패치 완료 → 빌드 테스트 추가
```
```

---

### 2.3 종료 루틴 (17:00 - 17:30)

```bash
/taskmaster-evening

# 실행 내용:
```

**체크리스트:**
```markdown
## 🌆 저녁 마무리 체크리스트

### 1️⃣ 작업 완료 확인
```bash
# 각 에이전트의 오늘 커밋 확인
git log --oneline --since="today" --all

# 체크:
# - DB Architect: migrations/ 파일 커밋됨?
# - API Hunter: services/ 파일 커밋됨?
# - UI Auditor: components/ 파일 커밋됨?
# - Version Manager: package.json 커밋됨?
```

### 2️⃣ Git 통합
```bash
# 모든 feature 브랜치를 main branch로 머지
git checkout claude/multi-agent-setup-Phk8f

# 충돌 없이 머지 가능한 것부터
git merge feature/db-schema --no-ff
git merge feature/api-integration --no-ff
git merge feature/ui-connections --no-ff
git merge feature/version-2.0 --no-ff

# 충돌 있으면 수동 해결
# 해결 후 커밋
git add .
git commit -m "merge: Integrate all agent work for 2026-01-06"

# 푸시
git push -u origin claude/multi-agent-setup-Phk8f
```

### 3️⃣ 통합 테스트
```bash
# 빌드 성공 확인
npm run build

# 타입 체크
npm run typecheck

# 린트
npm run lint

# 로컬 서버 실행
npm run dev

# 수동 테스트:
# - 모든 탭 정상 작동?
# - API 연동 정상?
# - 더미 링크 수정됨?
```

### 4️⃣ 일일 리포트 생성
```typescript
// scripts/generate-daily-report.ts
const report = {
  date: '2026-01-06',
  planned: 4,
  completed: 3,
  completion_rate: 75,
  agents: {
    'db-architect': {
      tasks: ['violations table', 'RLS policies'],
      completed: 2,
      blocked: 0
    },
    'api-hunter': {
      tasks: ['EPA retry logic', 'violations API'],
      completed: 1, // EPA만 완료
      blocked: 1    // violations API는 DB 대기
    },
    'ui-auditor': {
      tasks: ['Navigation links', 'Violations detail'],
      completed: 2,
      blocked: 0
    },
    'version-manager': {
      tasks: ['Security patches'],
      completed: 1,
      blocked: 0
    }
  },
  issues: [
    {
      type: 'BLOCKING',
      description: 'API Hunter blocked by DB Architect delays',
      resolved: false,
      action: 'Complete violations table tomorrow morning'
    }
  ],
  tomorrow: [
    'violations API integration',
    'UI testing with real data',
    'Version 2.0 release preparation'
  ]
};

fs.writeFileSync(
  `.claude/reports/daily-${report.date}.md`,
  formatReport(report)
);
```

### 5️⃣ 내일 계획
```markdown
# Daily Plan - 2026-01-07

## 🎯 Tomorrow's Goals
1. [CARRY-OVER] violations API integration (API Hunter)
2. [HIGH] Complete all navigation dummy fixes (UI Auditor)
3. [HIGH] Version 2.0 release candidate (Version Manager)
4. [MEDIUM] E2E tests for violations flow (Task Master)

## 📝 Notes
- DB schema work is complete, unblock API Hunter
- Focus on quality over quantity tomorrow
- Prepare for v2.0.0 release by Friday
```

### 6️⃣ 에이전트 상태 리셋
```bash
# 모든 에이전트를 'idle' 상태로
jq '.agents | to_entries | map({key: .key, value: (.value | .status = "idle" | .currentTask = null)}) | from_entries | {agents: .}' \
  .claude/sync/agent-status.json > temp.json && mv temp.json .claude/sync/agent-status.json
```
```

---

## 3. 작업 보드 관리

### 3.1 작업 보드 구조

```json
// .claude/sync/task-board.json
{
  "project": "ChemResearch v2.0",
  "sprint": "2026-01-06 to 2026-01-10",
  "columns": {
    "backlog": [
      {
        "id": "task-001",
        "title": "Implement dark mode",
        "priority": "LOW",
        "estimatedHours": 8,
        "assignedTo": null,
        "dependencies": []
      }
    ],
    "todo": [
      {
        "id": "task-002",
        "title": "Create violations table",
        "priority": "HIGH",
        "estimatedHours": 3,
        "assignedTo": "db-architect",
        "dependencies": [],
        "createdAt": "2026-01-06T09:00:00Z"
      }
    ],
    "in_progress": [
      {
        "id": "task-003",
        "title": "Fix Navigation dummy links",
        "priority": "HIGH",
        "estimatedHours": 4,
        "assignedTo": "ui-auditor",
        "dependencies": [],
        "startedAt": "2026-01-06T10:00:00Z"
      }
    ],
    "review": [
      {
        "id": "task-004",
        "title": "EPA API retry logic",
        "priority": "HIGH",
        "estimatedHours": 2,
        "assignedTo": "api-hunter",
        "dependencies": [],
        "completedAt": "2026-01-06T14:30:00Z",
        "reviewedBy": null
      }
    ],
    "done": [
      {
        "id": "task-005",
        "title": "Apply security patches",
        "priority": "HIGH",
        "estimatedHours": 1,
        "assignedTo": "version-manager",
        "dependencies": [],
        "completedAt": "2026-01-06T15:00:00Z",
        "reviewedBy": "taskmaster",
        "reviewedAt": "2026-01-06T16:00:00Z"
      }
    ]
  }
}
```

### 3.2 작업 보드 명령어

```bash
# 새 작업 추가
/task-add "Implement user authentication" --priority=HIGH --assign=db-architect

# 작업 상태 변경
/task-move task-003 in_progress → review

# 작업 재할당
/task-reassign task-002 db-architect → api-hunter

# 우선순위 변경
/task-priority task-001 LOW → MEDIUM

# 작업 보드 시각화
/task-board
```

**시각화 출력:**
```
┌─────────────┬──────────────┬──────────────┬─────────┬──────┐
│   Backlog   │     Todo     │ In Progress  │  Review │ Done │
├─────────────┼──────────────┼──────────────┼─────────┼──────┤
│ [LOW] Dark  │ [HIGH] Viola │ [HIGH] Nav   │ [HIGH]  │ [H]  │
│ mode (8h)   │ tions (3h)   │ links (4h)   │ EPA API │ Sec  │
│             │              │              │ (2h)    │ pat  │
│             │              │              │         │ (1h) │
├─────────────┼──────────────┼──────────────┼─────────┼──────┤
│ Total: 1    │ Total: 1     │ Total: 1     │ Total:1 │ Tot:1│
└─────────────┴──────────────┴──────────────┴─────────┴──────┘

Progress: ████████████░░░░░░░░ 60%
```

---

## 4. 에이전트 조율

### 4.1 작업 할당 전략

**1. 병렬 작업 최대화**
```typescript
// ✅ Good: 독립적인 작업을 병렬로
const parallelTasks = [
  { agent: 'db-architect', task: 'Create chemical_compounds table' },
  { agent: 'ui-auditor', task: 'Fix Footer links' },
  { agent: 'version-manager', task: 'Update dependencies' }
];
// 이 세 작업은 서로 의존성이 없으므로 동시 진행 가능

// ❌ Bad: 순차적 의존성을 병렬로
const badParallel = [
  { agent: 'db-architect', task: 'Create violations table' },
  { agent: 'api-hunter', task: 'violations API' } // ← DB 테이블 필요!
];
// API Hunter는 DB Architect 완료 후 시작해야 함
```

**2. 스킬 매칭**
```typescript
// 각 에이전트의 강점에 맞게 할당
const taskAssignment = {
  'Create database schema': 'db-architect',      // ✅ 데이터베이스 전문
  'Fix API timeout': 'api-hunter',                // ✅ API 전문
  'Scan dummy connections': 'ui-auditor',         // ✅ UI 전문
  'Upgrade React version': 'version-manager',     // ✅ 버전 관리 전문
  'Code review': 'taskmaster'                     // ✅ 총괄 검토
};
```

**3. 부하 분산**
```typescript
// 각 에이전트의 현재 작업량 확인
const workload = {
  'db-architect': { tasks: 2, estimatedHours: 5 },
  'api-hunter': { tasks: 1, estimatedHours: 2 },
  'ui-auditor': { tasks: 3, estimatedHours: 8 },   // ⚠️ 과부하!
  'version-manager': { tasks: 0, estimatedHours: 0 } // 유휴
};

// UI Auditor 작업 일부를 다른 에이전트에 재할당
reassignTask('Fix Admin tab buttons', 'ui-auditor', 'api-hunter');
```

### 4.2 의존성 관리

**의존성 그래프 생성:**
```typescript
// scripts/dependency-graph.ts
interface TaskDependency {
  task: string;
  dependsOn: string[];
  blocksOthers: string[];
}

const dependencies: TaskDependency[] = [
  {
    task: 'violations-table',
    dependsOn: [],
    blocksOthers: ['violations-api', 'violations-ui']
  },
  {
    task: 'violations-api',
    dependsOn: ['violations-table'],
    blocksOthers: ['violations-ui']
  },
  {
    task: 'violations-ui',
    dependsOn: ['violations-table', 'violations-api'],
    blocksOthers: []
  }
];

// 실행 순서 결정
function topologicalSort(deps: TaskDependency[]): string[] {
  // 위상 정렬 알고리즘
  // 결과: ['violations-table', 'violations-api', 'violations-ui']
}

// 병렬 실행 가능한 작업 찾기
function findParallelTasks(deps: TaskDependency[]): string[][] {
  return [
    ['violations-table', 'nav-links', 'security-patch'], // 동시 실행 가능
    ['violations-api'],                                   // violations-table 후
    ['violations-ui']                                     // violations-api 후
  ];
}
```

### 4.3 블로킹 해결

**블로킹 타입별 해결 방법:**

| 블로킹 타입 | 원인 | 해결 방법 | 예상 시간 |
|------------|------|----------|----------|
| **의존성 블로킹** | A 작업이 B 작업 대기 | B 작업 우선순위 상향 | 즉시 |
| **Git 충돌** | 같은 파일 수정 | 수동 머지 | 10-30분 |
| **API 장애** | 외부 서비스 다운 | 폴백 전략 활성화 | 즉시 |
| **환경 이슈** | 라이브러리 버전 충돌 | package-lock.json 재생성 | 5-10분 |
| **지식 부족** | 에이전트가 방법 모름 | 에스컬레이션, 가이드 제공 | 변동적 |

**블로킹 해결 프로세스:**
```bash
# 1. 블로킹 감지
/detect-blocking

# 출력:
# ⚠️ Blocking detected:
# - api-hunter blocked by db-architect (task: violations-api)
# - Blocking duration: 2 hours 15 minutes

# 2. 원인 분석
/analyze-blocking api-hunter

# 출력:
# Cause: Waiting for violations table schema
# Expected completion: 30 minutes
# Recommendation: Keep waiting (under 3 hours threshold)

# 3. 해결 액션
# 옵션 A: 대기 (예상 시간 < 1시간)
/wait api-hunter

# 옵션 B: 다른 작업 할당 (예상 시간 > 1시간)
/reassign api-hunter "Implement AQI API caching"

# 옵션 C: 긴급 (critical path)
/escalate db-architect "Complete violations table ASAP - blocking API Hunter"
```

---

## 5. 충돌 해결

### 5.1 Git 머지 충돌

**시나리오**: DB Architect와 API Hunter가 `src/lib/supabase.ts` 동시 수정

```bash
# Task Master (Session 1)

# 1. 머지 시도
git checkout claude/multi-agent-setup-Phk8f
git merge feature/db-schema
# Auto-merging src/lib/supabase.ts
# CONFLICT (content): Merge conflict in src/lib/supabase.ts

# 2. 충돌 내용 확인
git diff --name-only --diff-filter=U
# src/lib/supabase.ts

# 3. 파일 열기
code src/lib/supabase.ts

# 4. 수동 해결
# <<<<<<< HEAD (feature/db-schema - DB Architect)
# export const getViolations = () => supabase.from('violations').select('*');
# =======
# export const cacheAPI = (key, data, ttl) => { ... };
# >>>>>>> feature/api-integration (API Hunter)

# 5. 양쪽 모두 유지 (충돌 아님, 단순 추가)
# export const getViolations = () => supabase.from('violations').select('*');
# export const cacheAPI = (key, data, ttl) => { ... };

# 6. 충돌 해결 커밋
git add src/lib/supabase.ts
git commit -m "merge: Resolve supabase.ts conflict - kept both DB query and API cache"

# 7. 에이전트에게 알림
echo "✅ Conflict resolved in src/lib/supabase.ts - both changes merged" \
  >> .claude/sync/notifications.txt
```

**복잡한 충돌 (로직 변경):**
```bash
# 두 에이전트가 같은 함수를 다르게 수정한 경우

# DB Architect 버전:
function fetchData() {
  return supabase.from('users').select('id, name');
}

# API Hunter 버전:
function fetchData() {
  const cached = cache.get('users');
  if (cached) return cached;
  return api.get('/users');
}

# Task Master 해결:
function fetchData() {
  // 1. 캐시 확인 (API Hunter 로직)
  const cached = cache.get('users');
  if (cached) return cached;

  // 2. Supabase 조회 (DB Architect 로직)
  const data = await supabase.from('users').select('id, name');

  // 3. 캐시 저장
  cache.set('users', data, 300);
  return data;
}

# 두 의도를 모두 통합하여 더 나은 솔루션 제공
```

### 5.2 파일 잠금 충돌

**시나리오**: 두 에이전트가 같은 파일 수정 시도

```bash
# UI Auditor가 Navigation.tsx 수정 중
/lock src/components/Navigation.tsx "Fixing nav links"

# DB Architect가 Navigation.tsx 수정 시도
/lock src/components/Navigation.tsx "Adding violations nav item"

# ❌ Error:
# File is locked by ui-auditor
# Reason: Fixing nav links
# Locked at: 2026-01-06T10:15:00Z (30 minutes ago)

# Task Master 개입
/check-lock src/components/Navigation.tsx

# 출력:
# Locked by: ui-auditor
# Duration: 30 minutes
# Estimated completion: 15 minutes

# 옵션:
# 1. DB Architect 대기 (15분 이하)
/wait db-architect 15m

# 2. UI Auditor에게 우선순위 조정 요청
/message ui-auditor "Can you commit your nav changes? DB Architect needs the file."

# 3. 강제 해제 (긴급 상황만)
/force-unlock src/components/Navigation.tsx --reason="Critical navigation bug"
```

### 5.3 의존성 충돌

**시나리오**: Version Manager가 React 18.3 → 18.4 업그레이드, UI Auditor가 React 18.3 기반 코드 작성

```bash
# Task Master 확인
/check-dependencies

# ⚠️ Conflict detected:
# - Version Manager upgraded React to 18.4
# - UI Auditor's code uses React 18.3 API (createRoot changed)

# 해결 전략
# 1. 변경사항 범위 확인
git diff feature/version-2.0 -- package.json

# 2. Breaking changes 분석
npm info react@18.4.0 --json | jq '.dist.notes'

# 3. UI Auditor에게 가이드 제공
cat > .claude/guides/react-18.4-migration.md << 'EOF'
# React 18.4 Migration Guide

## Breaking Changes
- `createRoot` 이제 두 번째 파라미터 필요 없음
- `render` 메서드 deprecation 경고

## Code Updates Required
```diff
- import { render } from 'react-dom';
+ import { createRoot } from 'react-dom/client';

- render(<App />, document.getElementById('root'));
+ createRoot(document.getElementById('root')!).render(<App />);
```
EOF

# 4. UI Auditor에게 알림
/notify ui-auditor "React upgraded to 18.4 - see migration guide at .claude/guides/react-18.4-migration.md"
```

---

## 6. 품질 관리

### 6.1 코드 리뷰 체크리스트

**자동 검사 (CI에서 실행):**
```bash
# .github/workflows/quality-check.yml
name: Quality Gate

on: [pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - name: TypeScript Check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Unit Tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Bundle Size Check
        run: |
          SIZE=$(du -sk dist | cut -f1)
          if [ $SIZE -gt 5000 ]; then
            echo "Bundle too large: ${SIZE}KB"
            exit 1
          fi
```

**수동 리뷰 (Task Master):**
```markdown
## Code Review Checklist

### 1️⃣ 기능성
- [ ] 요구사항 충족
- [ ] Edge case 처리
- [ ] 에러 핸들링

### 2️⃣ 코드 품질
- [ ] 명확한 변수명
- [ ] 함수 분리 (SRP)
- [ ] 중복 코드 없음
- [ ] 주석 적절 (복잡한 로직만)

### 3️⃣ 성능
- [ ] N+1 쿼리 없음
- [ ] 불필요한 리렌더 없음
- [ ] 메모리 누수 없음

### 4️⃣ 보안
- [ ] SQL Injection 방어
- [ ] XSS 방어
- [ ] 민감 정보 노출 없음
- [ ] CORS 설정 적절

### 5️⃣ 테스트
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 통과
- [ ] 커버리지 > 70%

### 6️⃣ 문서화
- [ ] README 업데이트 (필요시)
- [ ] API 문서 업데이트
- [ ] CHANGELOG 업데이트
```

### 6.2 품질 메트릭

```typescript
// scripts/quality-metrics.ts
interface QualityMetrics {
  codeQuality: {
    lintErrors: number;
    lintWarnings: number;
    typeErrors: number;
    complexity: number; // 평균 cyclomatic complexity
  };
  testing: {
    coverage: number;   // %
    passRate: number;   // %
    totalTests: number;
  };
  performance: {
    buildTime: number;    // seconds
    bundleSize: number;   // KB
    lighthouse: {
      performance: number; // 0-100
      accessibility: number;
      bestPractices: number;
      seo: number;
    };
  };
  security: {
    vulnerabilities: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
}

// 목표 메트릭
const TARGET_METRICS: QualityMetrics = {
  codeQuality: {
    lintErrors: 0,
    lintWarnings: 0,
    typeErrors: 0,
    complexity: 10
  },
  testing: {
    coverage: 70,
    passRate: 100,
    totalTests: 50
  },
  performance: {
    buildTime: 60,
    bundleSize: 500,
    lighthouse: {
      performance: 90,
      accessibility: 95,
      bestPractices: 90,
      seo: 90
    }
  },
  security: {
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 5
    }
  }
};

// 실제 메트릭 측정
async function measureMetrics(): Promise<QualityMetrics> {
  // 구현...
}

// 목표 대비 비교
function compareMetrics(actual: QualityMetrics, target: QualityMetrics) {
  const issues: string[] = [];

  if (actual.codeQuality.lintErrors > target.codeQuality.lintErrors) {
    issues.push(`Lint errors: ${actual.codeQuality.lintErrors} (target: 0)`);
  }

  if (actual.testing.coverage < target.testing.coverage) {
    issues.push(`Coverage: ${actual.testing.coverage}% (target: 70%)`);
  }

  // ... 모든 메트릭 비교

  return issues;
}
```

---

## 7. 릴리스 관리

### 7.1 릴리스 준비 체크리스트

```markdown
# Release v2.0.0 Checklist

## 📋 Pre-Release (1 week before)

### Code Freeze
- [ ] 모든 feature 브랜치 머지 완료
- [ ] 신규 기능 개발 중단
- [ ] 버그 수정 및 테스트만 진행

### Testing
- [ ] 모든 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] E2E 테스트 통과
- [ ] 성능 테스트 (Lighthouse)
- [ ] 보안 스캔 (npm audit)
- [ ] 접근성 테스트 (axe)

### Documentation
- [ ] README.md 업데이트
- [ ] API 문서 업데이트
- [ ] CHANGELOG.md 완성
- [ ] Migration guide 작성 (Breaking changes 있는 경우)

## 🚀 Release Day

### Final Checks
- [ ] `git status` clean
- [ ] `npm run typecheck` 통과
- [ ] `npm run lint` 통과
- [ ] `npm run build` 성공
- [ ] `npm test` 모두 통과

### Version Bump
```bash
# package.json 버전 업데이트
npm version major  # 1.x.x → 2.0.0

# 또는
npm version minor  # x.1.x → x.2.0
npm version patch  # x.x.1 → x.x.2
```

### Git Tagging
```bash
git tag -a v2.0.0 -m "Release version 2.0.0

Major changes:
- New violations reporting system
- Enhanced API integration
- Improved UI/UX
- Security patches

See CHANGELOG.md for full details"

git push origin v2.0.0
git push origin claude/multi-agent-setup-Phk8f
```

### Build & Deploy
```bash
# Production build
npm run build

# Deploy to production
npm run deploy

# Verify deployment
curl https://chemresearch.app/health
# Expected: {"status":"ok","version":"2.0.0"}
```

### GitHub Release
```bash
gh release create v2.0.0 \
  --title "ChemResearch v2.0.0" \
  --notes-file RELEASE_NOTES.md \
  --latest
```

## 📊 Post-Release

### Monitoring (첫 24시간)
- [ ] 에러 로그 모니터링
- [ ] 성능 메트릭 확인
- [ ] 사용자 피드백 수집

### Rollback Plan (문제 발생 시)
```bash
# 이전 버전으로 롤백
git revert v2.0.0
npm version patch  # 2.0.1 (롤백 버전)
git push origin main
npm run deploy
```

### Communication
- [ ] 팀에 릴리스 알림
- [ ] 사용자에게 공지
- [ ] 문서 사이트 업데이트
```

### 7.2 릴리스 노트 템플릿

```markdown
# ChemResearch v2.0.0 Release Notes

**Release Date**: 2026-01-10
**Release Manager**: Task Master

---

## 🎉 Highlights

- **Violations Reporting System**: 새로운 환경 위반 신고 기능
- **Enhanced API Integration**: EPA, OpenWeather API 안정성 개선
- **Improved UI/UX**: 모든 더미 링크 제거, 일관된 사용자 경험
- **Security Patches**: 모든 의존성 보안 취약점 해결

---

## ✨ New Features

### Violations Reporting
- 사용자가 환경 위반 사항을 신고할 수 있는 새 기능
- 위치 정보 (위도/경도) 자동 수집
- 증거 파일 업로드 (이미지, PDF)
- 신고 상태 추적 (Pending → Investigating → Resolved)

**Usage**:
```typescript
import { submitViolation } from './services/violations';

await submitViolation({
  type: 'pfas',
  location: { lat: 37.7749, lng: -122.4194 },
  description: 'Suspected PFAS contamination in water supply',
  evidence: [file1, file2]
});
```

### API Retry Logic
- 모든 외부 API 호출에 자동 재시도 로직 추가
- 지수 백오프 (1s → 2s → 4s)
- 최대 3회 재시도
- 폴백 전략: API 실패 시 캐시된 데이터 사용

---

## 🔧 Improvements

- **Performance**: 초기 로딩 시간 30% 개선 (3.2s → 2.2s)
- **Accessibility**: WCAG 2.1 AA 준수 (Lighthouse 점수: 95/100)
- **Bundle Size**: 520KB → 480KB (7.7% 감소)
- **Database**: 쿼리 성능 최적화 (평균 응답 시간 50% 개선)

---

## 🐛 Bug Fixes

- Fixed: Navigation 링크가 작동하지 않던 문제 (#12)
- Fixed: EPA API 타임아웃 시 앱이 멈추던 문제 (#15)
- Fixed: Admin 탭에서 에러 발생 시 무한 로딩 (#18)
- Fixed: 모바일에서 메뉴가 겹치던 문제 (#21)

---

## 🔒 Security

- **axios**: 1.13.2 → 1.13.3 (CVE-2024-XXXX)
- **vite**: 5.4.2 → 5.4.3 (보안 패치)
- **react**: 18.3.1 → 18.4.0 (보안 개선)

All critical and high vulnerabilities resolved.

---

## ⚠️ Breaking Changes

### React 18.4 Upgrade

**Before**:
```typescript
import { render } from 'react-dom';
render(<App />, document.getElementById('root'));
```

**After**:
```typescript
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')!).render(<App />);
```

### Supabase API Changes

**Before**:
```typescript
const { data } = await supabase.from('violations').select();
```

**After**:
```typescript
const { data } = await supabase.from('violations').select('*');
// '*' 명시 필수
```

**Migration Guide**: See [MIGRATION.md](./MIGRATION.md)

---

## 📊 Statistics

- **Commits**: 87
- **Files Changed**: 45
- **Lines Added**: 3,247
- **Lines Deleted**: 1,892
- **Contributors**: 5 (agents)
- **Development Time**: 5 days

---

## 🙏 Credits

이 릴리스는 5개의 전문화된 에이전트가 협업하여 완성했습니다:

- **Task Master**: 프로젝트 조율 및 품질 관리
- **DB Architect**: 데이터베이스 설계 및 최적화
- **API Hunter**: API 통합 및 안정성 개선
- **UI Auditor**: 사용자 경험 개선
- **Version Manager**: 의존성 관리 및 릴리스 준비

---

## 📚 Resources

- **Documentation**: https://docs.chemresearch.app
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)
- **Migration Guide**: [MIGRATION.md](./MIGRATION.md)
- **Report Issues**: https://github.com/vincenti85/chemresearch/issues

---

**Full Changelog**: https://github.com/vincenti85/chemresearch/compare/v1.0.0...v2.0.0
```

---

## 🔄 지속적 개선

### 주간 회고

매주 금요일 17:00 - 17:30:

```markdown
# Weekly Retrospective - Week of 2026-01-06

## 🎯 What Went Well
- 모든 에이전트가 할당된 작업 100% 완료
- Git 충돌이 예상보다 적었음 (3건)
- 릴리스 준비가 일정대로 진행됨

## 🚧 What Could Be Improved
- API Hunter가 2일간 블로킹됨 (DB 작업 지연)
- 코드 리뷰 시간 부족 (평균 10분, 목표 30분)
- 테스트 커버리지 목표 미달 (65%, 목표 70%)

## 💡 Action Items for Next Week
- [ ] DB Architect 작업에 버퍼 시간 추가 (예상 시간 + 25%)
- [ ] 코드 리뷰 전용 시간 확보 (매일 16:00-16:30)
- [ ] Test Engineer 에이전트 추가 검토
- [ ] 일일 동기화 회의 시간 단축 (30분 → 15분)

## 📊 Metrics
- Velocity: 42 story points (목표: 40) ✅
- Bug Rate: 3 bugs/week (목표: < 5) ✅
- Code Review Time: 10 min avg (목표: 30 min) ❌
- Test Coverage: 65% (목표: 70%) ❌
```

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2026-01-06
**작성자**: Task Master
**다음 리뷰**: 2026-01-13
