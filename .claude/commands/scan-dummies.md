# UI 더미 연결 스캔

당신은 **UI Auditor** 에이전트입니다.

모든 UI 컴포넌트를 스캔하여 기능이 연결되지 않은 더미 요소를 찾아냅니다.

## 실행 작업

### 1. 스캔 대상 파일

다음 파일들을 검사하세요:
- `src/components/Navigation.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/tabs/*.tsx`
- `src/components/modules/*.tsx`
- `src/components/forms/*.tsx`

### 2. 더미 패턴 탐지

다음 패턴을 찾으세요:

**1) No Action 버튼**
```typescript
// ❌ 더미
onClick={() => {}}
onClick={() => void 0}
onClick={undefined}
```

**2) Console Only**
```typescript
// ❌ 더미 (실제 기능 없음)
onClick={() => console.log('Clicked')}
onClick={() => console.log('TODO: implement')}
```

**3) Alert Placeholder**
```typescript
// ❌ 더미 (실제 구현 필요)
onClick={() => alert('Coming soon')}
onClick={() => alert('Feature not implemented')}
```

**4) Broken Links**
```typescript
// ❌ 더미
<a href="#">Link</a>
<a href="javascript:void(0)">Link</a>
<Link to="">Link</Link>
```

**5) Missing Modal**
```typescript
// ❌ 더미 (모달이 존재하지 않음)
<button onClick={() => setShowModal(true)}>View Details</button>
// But: showModal 상태는 있지만 modal 컴포넌트가 없음
```

### 3. 더미 목록 작성

발견한 각 더미에 대해 다음 정보를 수집하세요:

```typescript
interface DummyConnection {
  id: string;                    // 'nav-001'
  type: 'NO_ACTION' | 'CONSOLE_ONLY' | 'ALERT' | 'BROKEN_LINK' | 'MISSING_MODAL';
  location: string;              // 'Navigation.tsx:45'
  element: string;               // '<button onClick={() => {}}>Data Guide</button>'
  currentBehavior: string;       // 'No action'
  expectedBehavior: string;      // 'Navigate to /data-guide'
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedEffort: string;       // '1 hour'
  autoFixable: boolean;          // true/false
  dependencies: string[];        // ['DataGuideTab component must exist']
}
```

### 4. 우선순위 결정

각 더미의 우선순위를 다음 기준으로 결정하세요:

**HIGH Priority**:
- 주요 네비게이션 링크
- 핵심 기능 버튼 (Submit, Save 등)
- 사용자 여정의 critical path

**MEDIUM Priority**:
- 부가 기능 버튼
- 상세 보기 링크
- 필터/정렬 버튼

**LOW Priority**:
- Footer 링크
- 소셜 미디어 버튼
- 선택적 기능

### 5. 자동 수정 가능 여부 판단

다음 경우 자동 수정 가능:
- ✅ `onClick={() => {}}` → `onClick={() => setCurrentTab('...')}`
- ✅ `href="#"` → `href="/actual-path"`
- ✅ `console.log()` → 실제 함수 호출

다음 경우 수동 작업 필요:
- ❌ 새 컴포넌트 생성 필요
- ❌ 복잡한 상태 관리 추가
- ❌ API 연동 필요

### 6. 감사 리포트 생성

다음 형식으로 리포트를 작성하세요:

```markdown
# UI 더미 연결 감사 리포트
**날짜**: {오늘 날짜}
**감사자**: UI Auditor

## 📊 요약
- **총 더미 발견**: {개수}
- **HIGH 우선순위**: {개수}
- **MEDIUM 우선순위**: {개수}
- **LOW 우선순위**: {개수}
- **자동 수정 가능**: {개수}
- **수동 작업 필요**: {개수}

## 🔴 HIGH Priority (즉시 수정 필요)

### 1. Navigation - Data Guide 링크
- **위치**: `src/components/Navigation.tsx:45`
- **코드**:
  \`\`\`tsx
  <button onClick={() => {}}>Data Guide</button>
  \`\`\`
- **현재 동작**: 클릭해도 아무 일도 일어나지 않음
- **기대 동작**: Data Guide 탭으로 이동
- **자동 수정**: ✅ 가능
- **수정 방법**:
  \`\`\`tsx
  <button onClick={() => setCurrentTab('data-guide')}>Data Guide</button>
  \`\`\`
- **예상 시간**: 5분

### 2. ViolationsTab - View Details 버튼
- **위치**: `src/components/tabs/ViolationsTab.tsx:128`
- **코드**:
  \`\`\`tsx
  <button onClick={() => console.log('View details')}>View Details</button>
  \`\`\`
- **현재 동작**: 콘솔에만 로그 출력
- **기대 동작**: 위반 상세 모달 열기
- **자동 수정**: ❌ 불가능 (모달 컴포넌트 없음)
- **필요 작업**:
  1. `ViolationDetailModal.tsx` 컴포넌트 생성
  2. 상태 관리 추가 (`showModal`, `selectedViolation`)
  3. 버튼에 onClick 연결
- **예상 시간**: 2시간

## 🟡 MEDIUM Priority

### 3. Footer - About 링크
- **위치**: `src/components/Footer.tsx:67`
- **코드**: `<a href="#">About</a>`
- **현재 동작**: 페이지 최상단으로 스크롤
- **기대 동작**: About 페이지로 이동
- **자동 수정**: ✅ 가능
- **수정 방법**: `<a href="/about">About</a>`
- **예상 시간**: 2분

## 🟢 LOW Priority

{LOW 우선순위 더미들...}

## 📈 수정 계획

### 오늘 (즉시):
- [ ] HIGH #1: Navigation - Data Guide (5분)
- [ ] HIGH #3: Navigation - Community (5분)
- [ ] HIGH #5: Submit 버튼 연결 (10분)

### 이번 주:
- [ ] MEDIUM: Footer 링크 전체 (30분)
- [ ] MEDIUM: 상세 보기 버튼들 (3시간)

### 다음 주:
- [ ] LOW: 소셜 미디어 링크 (1시간)

## 🔧 자동 수정 스크립트

다음 더미들은 자동으로 수정할 수 있습니다:

\`\`\`bash
npm run fix-dummies -- --priority=HIGH --auto-fixable
\`\`\`

이것은 다음 수정을 적용합니다:
- Navigation.tsx: 4개 링크
- Footer.tsx: 3개 링크
- OverviewTab.tsx: 2개 버튼

## 📝 수동 작업 필요 목록

DB Architect에게 위임:
- [ ] ViolationDetailModal 데이터 스키마 설계

API Hunter에게 위임:
- [ ] Community 탭 API 연동

Task Master에게 에스컬레이션:
- [ ] 전체 네비게이션 구조 재검토 필요

## 📊 완료율 추적

- 전체 진행률: ██░░░░░░░░ 20% (5/25 수정됨)
- HIGH 진행률: ██████░░░░ 60% (3/5 수정됨)
- MEDIUM 진행률: █░░░░░░░░░ 10% (1/10 수정됨)
```

## 7. 출력 파일

감사 결과를 다음 파일에 저장하세요:
- `.claude/audit-reports/ui-connections-{date}.md` - 리포트
- `src/audit/dummy-connections.ts` - 구조화된 데이터

스캔을 시작하세요!
