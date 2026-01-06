# 🎓 ChemResearch 멀티 에이전트 스킬 라이브러리

> **프로젝트**: 화학 연구 및 환경 모니터링 웹 애플리케이션
> **목적**: 각 에이전트가 사용할 수 있는 재사용 가능한 전문 스킬 정의
> **버전**: 1.0.0

---

## 📖 개요

이 문서는 ChemResearch 프로젝트의 5개 에이전트가 사용할 수 있는 전문 스킬들을 정의합니다. 각 스킬은 특정 도메인 지식과 실행 가능한 코드를 포함합니다.

### 스킬 사용 방법

```bash
# Claude Code에서 스킬 사용
/skill <skill-name>

# 예시
/skill database-schema-design
/skill api-retry-logic
/skill dummy-scanner
```

---

## 🗄️ Database Skills (DB Architect)

### Skill 1: Database Schema Design

**파일**: `.claude/skills/database-schema-design.md`

```markdown
# Database Schema Design Skill

## 목적
Supabase 데이터베이스 스키마를 설계하고 마이그레이션 파일을 생성합니다.

## 입력
- 테이블 이름
- 필드 요구사항
- 관계 정의

## 실행 프로세스

### 1. 요구사항 분석
```typescript
interface SchemaRequirements {
  tableName: string;
  fields: {
    name: string;
    type: 'uuid' | 'text' | 'integer' | 'timestamp' | 'json' | 'boolean';
    nullable: boolean;
    unique?: boolean;
    default?: any;
  }[];
  relationships: {
    table: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
    foreignKey: string;
  }[];
  indexes: string[];
  rls?: boolean; // Row Level Security
}
```

### 2. SQL 생성 템플릿
```sql
-- migrations/{timestamp}_{table_name}.sql

-- Create table
CREATE TABLE IF NOT EXISTS {table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  {fields}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
{indexes}

-- Add foreign keys
{foreign_keys}

-- Enable Row Level Security
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- Create policies
{policies}

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON {table_name}
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. TypeScript 타입 생성
```typescript
// src/types/database.types.ts
export interface {TableName} {
  id: string;
  {fields_typescript}
  created_at: string;
  updated_at: string;
}

export type {TableName}Insert = Omit<{TableName}, 'id' | 'created_at' | 'updated_at'>;
export type {TableName}Update = Partial<{TableName}Insert>;
```

### 4. 검증 체크리스트
- [ ] 모든 필수 필드가 NOT NULL인가?
- [ ] UUID가 primary key로 사용되는가?
- [ ] created_at, updated_at 타임스탬프가 있는가?
- [ ] 인덱스가 필요한 필드에 추가되었는가?
- [ ] Foreign key constraint가 올바른가?
- [ ] RLS 정책이 정의되었는가?

## 출력
- SQL 마이그레이션 파일
- TypeScript 타입 정의
- 테스트 쿼리 예시
```

---

### Skill 2: Database Migration

**파일**: `.claude/skills/database-migration.md`

```markdown
# Database Migration Skill

## 실행 단계

### 1. 마이그레이션 파일 생성
```bash
# 파일명 형식: {timestamp}_{description}.sql
# 예: 20260106_create_violations_table.sql

npm run migration:create -- create_violations_table
```

### 2. 마이그레이션 실행
```bash
# 로컬 환경
supabase db push

# 프로덕션 환경 (주의!)
supabase db push --db-url $PROD_DATABASE_URL
```

### 3. 롤백 계획
```sql
-- 항상 롤백 SQL도 함께 작성
-- rollback/{timestamp}_{description}.sql

DROP TABLE IF EXISTS violations CASCADE;
```

### 4. 데이터 백업
```bash
# 마이그레이션 전 필수 백업
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 안전 체크리스트
- [ ] 백업 완료
- [ ] 롤백 스크립트 준비
- [ ] 로컬에서 테스트 완료
- [ ] 의존성 확인 (다른 테이블/함수)
- [ ] 다운타임 필요 여부 확인
```

---

### Skill 3: Query Optimization

**파일**: `.claude/skills/query-optimization.md`

```markdown
# Query Optimization Skill

## 느린 쿼리 진단

### 1. EXPLAIN ANALYZE 사용
```sql
EXPLAIN ANALYZE
SELECT * FROM violations
WHERE status = 'pending'
  AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC
LIMIT 100;

-- 결과 분석:
-- - Seq Scan (전체 스캔) → 인덱스 추가 필요
-- - Sort 시간 > 10ms → 인덱스로 정렬 최적화
```

### 2. 인덱스 추가
```sql
-- 단일 컬럼 인덱스
CREATE INDEX idx_violations_status ON violations(status);

-- 복합 인덱스 (WHERE + ORDER BY 최적화)
CREATE INDEX idx_violations_status_created
ON violations(status, created_at DESC);

-- 부분 인덱스 (특정 조건만)
CREATE INDEX idx_violations_pending
ON violations(created_at DESC)
WHERE status = 'pending';
```

### 3. 쿼리 리팩토링
```typescript
// ❌ Bad: N+1 쿼리
for (const violation of violations) {
  const user = await supabase
    .from('users')
    .select('*')
    .eq('id', violation.user_id)
    .single();
}

// ✅ Good: JOIN으로 한 번에
const { data } = await supabase
  .from('violations')
  .select(`
    *,
    users(name, email)
  `)
  .eq('status', 'pending');
```
```

---

## 🌐 API Skills (API Hunter)

### Skill 4: API Retry Logic

**파일**: `.claude/skills/api-retry-logic.md`

```typescript
// API Retry Logic Skill

/**
 * 지수 백오프 재시도 로직
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // 재시도 불가능한 에러는 즉시 throw
      if (isNonRetriableError(error)) {
        throw error;
      }

      // 마지막 시도였으면 throw
      if (attempt === maxRetries) {
        throw new Error(
          `Failed after ${maxRetries} retries: ${lastError.message}`
        );
      }

      // 백오프 지연
      await sleep(delay);
      delay = Math.min(delay * backoffMultiplier, maxDelay);

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
    }
  }

  throw lastError!;
}

function isNonRetriableError(error: any): boolean {
  // 4xx 에러는 재시도 불가
  if (error.response?.status >= 400 && error.response?.status < 500) {
    return true;
  }
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 사용 예시
const epaData = await retryWithBackoff(
  () => axios.get('https://api.epa.gov/pfas'),
  { maxRetries: 3, initialDelay: 2000 }
);
```

---

### Skill 5: API Response Caching

**파일**: `.claude/skills/api-caching.md`

```typescript
// API Response Caching Skill

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * 캐시에서 데이터 조회
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // 만료 확인
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * 캐시에 데이터 저장
   */
  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  /**
   * 캐시 무효화
   */
  invalidate(keyPattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(keyPattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 모든 캐시 삭제
   */
  clear(): void {
    this.cache.clear();
  }
}

// 글로벌 인스턴스
export const apiCache = new APICache();

// 사용 예시
export async function fetchEPAData(zipCode: string) {
  const cacheKey = `epa:pfas:${zipCode}`;

  // 1. 캐시 확인
  const cached = apiCache.get(cacheKey);
  if (cached) {
    console.log('✅ Cache hit:', cacheKey);
    return cached;
  }

  // 2. API 호출
  console.log('⚠️ Cache miss, fetching from API:', cacheKey);
  const response = await axios.get(`https://api.epa.gov/pfas?zip=${zipCode}`);

  // 3. 캐시 저장 (5분 TTL)
  apiCache.set(cacheKey, response.data, 300);

  return response.data;
}
```

---

### Skill 6: API Fallback Strategy

**파일**: `.claude/skills/api-fallback.md`

```typescript
// API Fallback Strategy Skill

/**
 * API 폴백 전략
 * 1순위: 외부 API
 * 2순위: 캐시된 데이터
 * 3순위: 로컬 DB
 * 4순위: 기본값
 */
export async function fetchWithFallback<T>(
  primaryFn: () => Promise<T>,
  fallbacks: Array<() => Promise<T | null>>,
  defaultValue: T
): Promise<T> {
  // 1. Primary API 시도
  try {
    return await primaryFn();
  } catch (primaryError) {
    console.warn('Primary API failed:', primaryError);

    // 2. Fallback 순차 시도
    for (let i = 0; i < fallbacks.length; i++) {
      try {
        const result = await fallbacks[i]();
        if (result !== null) {
          console.log(`Fallback ${i + 1} succeeded`);
          return result;
        }
      } catch (fallbackError) {
        console.warn(`Fallback ${i + 1} failed:`, fallbackError);
      }
    }

    // 3. 모든 fallback 실패 시 기본값
    console.error('All fallbacks failed, using default value');
    return defaultValue;
  }
}

// 사용 예시
const pfasData = await fetchWithFallback(
  // 1순위: EPA API
  () => axios.get('https://api.epa.gov/pfas').then(r => r.data),

  // 2순위: 캐시
  [
    async () => {
      const cached = apiCache.get('epa:pfas');
      return cached || null;
    },

    // 3순위: Supabase
    async () => {
      const { data } = await supabase
        .from('pfas_cache')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return data?.content || null;
    }
  ],

  // 4순위: 기본값
  { compounds: [], lastUpdated: null }
);
```

---

## 🎨 UI Skills (UI Auditor)

### Skill 7: Dummy Connection Scanner

**파일**: `.claude/skills/dummy-scanner.md`

```typescript
// Dummy Connection Scanner Skill

import * as fs from 'fs';
import * as path from 'path';

interface DummyPattern {
  pattern: RegExp;
  type: 'NO_ACTION' | 'CONSOLE_ONLY' | 'ALERT' | 'BROKEN_LINK';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

const DUMMY_PATTERNS: DummyPattern[] = [
  {
    pattern: /onClick=\{(?:\(\)\s*=>)?\s*\{\s*\}\s*\}/g,
    type: 'NO_ACTION',
    severity: 'HIGH'
  },
  {
    pattern: /onClick=\{(?:\(\)\s*=>)?\s*console\.log/g,
    type: 'CONSOLE_ONLY',
    severity: 'MEDIUM'
  },
  {
    pattern: /onClick=\{(?:\(\)\s*=>)?\s*alert\(/g,
    type: 'ALERT',
    severity: 'LOW'
  },
  {
    pattern: /href=["']#["']/g,
    type: 'BROKEN_LINK',
    severity: 'MEDIUM'
  }
];

export async function scanDummyConnections(
  srcDir: string = 'src/components'
): Promise<DummyConnection[]> {
  const dummies: DummyConnection[] = [];
  const files = getAllTsxFiles(srcDir);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, lineNum) => {
      DUMMY_PATTERNS.forEach(({ pattern, type, severity }) => {
        const matches = line.matchAll(pattern);
        for (const match of matches) {
          dummies.push({
            id: generateDummyId(file, lineNum),
            type,
            severity,
            location: `${path.relative(process.cwd(), file)}:${lineNum + 1}`,
            element: line.trim(),
            status: 'PENDING'
          });
        }
      });
    });
  }

  return dummies;
}

function getAllTsxFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllTsxFiles(fullPath));
    } else if (entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

// 사용 예시
const dummies = await scanDummyConnections('src/components');
console.log(`Found ${dummies.length} dummy connections`);

// 우선순위별 분류
const highPriority = dummies.filter(d => d.severity === 'HIGH');
console.log(`High priority: ${highPriority.length}`);
```

---

### Skill 8: Auto-Fix Dummies

**파일**: `.claude/skills/auto-fix-dummies.md`

```typescript
// Auto-Fix Dummies Skill

import { Edit } from './tools';

export async function autoFixDummy(dummy: DummyConnection): Promise<boolean> {
  const strategy = getFixStrategy(dummy);
  if (!strategy) {
    console.log(`❌ No auto-fix strategy for ${dummy.id}`);
    return false;
  }

  try {
    await strategy.fix(dummy);
    console.log(`✅ Fixed ${dummy.id}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to fix ${dummy.id}:`, error);
    return false;
  }
}

interface FixStrategy {
  canFix: (dummy: DummyConnection) => boolean;
  fix: (dummy: DummyConnection) => Promise<void>;
}

const strategies: FixStrategy[] = [
  // Strategy 1: NO_ACTION → setState
  {
    canFix: (d) => d.type === 'NO_ACTION' && d.element.includes('button'),
    fix: async (d) => {
      const [file, line] = d.location.split(':');
      const action = inferAction(d.element);

      await Edit({
        file_path: file,
        old_string: 'onClick={() => {}}',
        new_string: `onClick={() => ${action}}`
      });
    }
  },

  // Strategy 2: CONSOLE_ONLY → real function
  {
    canFix: (d) => d.type === 'CONSOLE_ONLY',
    fix: async (d) => {
      const [file, line] = d.location.split(':');
      const functionName = inferFunctionName(d.element);

      await Edit({
        file_path: file,
        old_string: d.element,
        new_string: d.element.replace(
          /console\.log\([^)]*\)/,
          `handle${functionName}()`
        )
      });
    }
  },

  // Strategy 3: BROKEN_LINK → correct path
  {
    canFix: (d) => d.type === 'BROKEN_LINK',
    fix: async (d) => {
      const [file, line] = d.location.split(':');
      const correctPath = inferCorrectPath(d.element);

      await Edit({
        file_path: file,
        old_string: 'href="#"',
        new_string: `href="${correctPath}"`
      });
    }
  }
];

function getFixStrategy(dummy: DummyConnection): FixStrategy | null {
  return strategies.find(s => s.canFix(dummy)) || null;
}

function inferAction(element: string): string {
  // "View Details" → setShowDetails(true)
  // "Submit" → handleSubmit()
  // "Close" → setIsOpen(false)

  if (element.includes('Details')) return 'setShowDetails(true)';
  if (element.includes('Submit')) return 'handleSubmit()';
  if (element.includes('Close')) return 'setIsOpen(false)';

  return 'handleClick()';
}

function inferFunctionName(element: string): string {
  const match = element.match(/([A-Z][a-z]+)/);
  return match ? match[1] : 'Click';
}

function inferCorrectPath(element: string): string {
  // 버튼 텍스트에서 경로 추론
  if (element.includes('Data Guide')) return '/data-guide';
  if (element.includes('Community')) return '/community';

  return '/';
}
```

---

## 📦 Version Skills (Version Manager)

### Skill 9: Dependency Audit

**파일**: `.claude/skills/dependency-audit.md`

```typescript
// Dependency Audit Skill

import { execSync } from 'child_process';
import * as fs from 'fs';

interface DependencyReport {
  package: string;
  current: string;
  wanted: string;
  latest: string;
  type: 'patch' | 'minor' | 'major';
  breaking: boolean;
  security: SecurityIssue[];
}

interface SecurityIssue {
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  cve: string;
  title: string;
  fixAvailable: boolean;
}

export async function auditDependencies(): Promise<{
  outdated: DependencyReport[];
  security: SecurityIssue[];
  unused: string[];
}> {
  // 1. 보안 취약점 확인
  const auditResult = execSync('npm audit --json').toString();
  const audit = JSON.parse(auditResult);

  // 2. 오래된 패키지 확인
  const outdatedResult = execSync('npm outdated --json').toString();
  const outdated = JSON.parse(outdatedResult || '{}');

  // 3. 사용하지 않는 패키지 확인
  const unused = await findUnusedDependencies();

  return {
    outdated: Object.entries(outdated).map(([pkg, info]: [string, any]) => ({
      package: pkg,
      current: info.current,
      wanted: info.wanted,
      latest: info.latest,
      type: determineUpdateType(info.current, info.latest),
      breaking: isBreakingChange(info.current, info.latest),
      security: audit.vulnerabilities?.[pkg] || []
    })),
    security: Object.values(audit.vulnerabilities || {}),
    unused
  };
}

function determineUpdateType(current: string, latest: string): 'patch' | 'minor' | 'major' {
  const [c_major, c_minor, c_patch] = current.split('.').map(Number);
  const [l_major, l_minor, l_patch] = latest.split('.').map(Number);

  if (l_major > c_major) return 'major';
  if (l_minor > c_minor) return 'minor';
  return 'patch';
}

function isBreakingChange(current: string, latest: string): boolean {
  const [c_major] = current.split('.').map(Number);
  const [l_major] = latest.split('.').map(Number);
  return l_major > c_major;
}

async function findUnusedDependencies(): Promise<string[]> {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const dependencies = Object.keys(packageJson.dependencies || {});

  const unused: string[] = [];

  for (const dep of dependencies) {
    // src/ 디렉토리에서 import 확인
    try {
      execSync(`grep -r "from '${dep}'" src/`);
    } catch {
      // grep이 아무것도 찾지 못하면 사용하지 않는 것
      unused.push(dep);
    }
  }

  return unused;
}

// 사용 예시
const report = await auditDependencies();
console.log('🔍 Dependency Audit Report\n');
console.log(`Outdated: ${report.outdated.length}`);
console.log(`Security issues: ${report.security.length}`);
console.log(`Unused: ${report.unused.length}`);
```

---

### Skill 10: CHANGELOG Generator

**파일**: `.claude/skills/changelog-generator.md`

```typescript
// CHANGELOG Generator Skill

import { execSync } from 'child_process';
import * as fs from 'fs';

interface ChangelogEntry {
  type: 'added' | 'fixed' | 'changed' | 'removed' | 'security';
  message: string;
  commit: string;
  author: string;
  date: string;
}

export async function generateChangelog(
  fromVersion: string,
  toVersion: string
): Promise<string> {
  // 1. Git 로그 가져오기
  const log = execSync(
    `git log ${fromVersion}..HEAD --pretty=format:"%H|%an|%ad|%s" --date=short`
  ).toString();

  // 2. 커밋 파싱
  const entries: ChangelogEntry[] = log.split('\n').map(line => {
    const [commit, author, date, message] = line.split('|');
    return {
      type: categorizeCommit(message),
      message: cleanMessage(message),
      commit,
      author,
      date
    };
  });

  // 3. 카테고리별 그룹화
  const grouped = groupByType(entries);

  // 4. CHANGELOG 생성
  const changelog = formatChangelog(toVersion, grouped);

  // 5. 파일에 추가
  const existing = fs.readFileSync('CHANGELOG.md', 'utf-8');
  fs.writeFileSync('CHANGELOG.md', changelog + '\n\n' + existing);

  return changelog;
}

function categorizeCommit(message: string): ChangelogEntry['type'] {
  if (message.startsWith('feat:')) return 'added';
  if (message.startsWith('fix:')) return 'fixed';
  if (message.startsWith('refactor:')) return 'changed';
  if (message.startsWith('remove:')) return 'removed';
  if (message.includes('security')) return 'security';
  return 'changed';
}

function cleanMessage(message: string): string {
  return message
    .replace(/^(feat|fix|refactor|remove):\s*/i, '')
    .trim();
}

function groupByType(entries: ChangelogEntry[]): Map<string, ChangelogEntry[]> {
  const map = new Map<string, ChangelogEntry[]>();

  for (const entry of entries) {
    const existing = map.get(entry.type) || [];
    existing.push(entry);
    map.set(entry.type, existing);
  }

  return map;
}

function formatChangelog(version: string, grouped: Map<string, ChangelogEntry[]>): string {
  const date = new Date().toISOString().split('T')[0];

  let md = `## [${version}] - ${date}\n\n`;

  const sections = [
    { key: 'added', title: 'Added' },
    { key: 'changed', title: 'Changed' },
    { key: 'fixed', title: 'Fixed' },
    { key: 'removed', title: 'Removed' },
    { key: 'security', title: 'Security' }
  ];

  for (const { key, title } of sections) {
    const entries = grouped.get(key);
    if (entries && entries.length > 0) {
      md += `### ${title}\n\n`;
      entries.forEach(entry => {
        md += `- ${entry.message} (${entry.commit.substring(0, 7)})\n`;
      });
      md += '\n';
    }
  }

  return md;
}

// 사용 예시
const changelog = await generateChangelog('v1.0.0', 'v2.0.0');
console.log(changelog);
```

---

## 🎯 Task Management Skills (Task Master)

### Skill 11: Agent Coordination

**파일**: `.claude/skills/agent-coordination.md`

```typescript
// Agent Coordination Skill

import * as fs from 'fs';

interface AgentStatus {
  agent: string;
  status: 'active' | 'idle' | 'waiting' | 'blocked';
  currentTask: string | null;
  blockedBy: string | null;
  blockingOthers: string[];
  lastUpdate: string;
}

export class AgentCoordinator {
  private statusFile = '.claude/sync/agent-status.json';

  /**
   * 모든 에이전트 상태 조회
   */
  getAllStatus(): Record<string, AgentStatus> {
    const content = fs.readFileSync(this.statusFile, 'utf-8');
    return JSON.parse(content).agents;
  }

  /**
   * 특정 에이전트 상태 업데이트
   */
  updateStatus(agent: string, update: Partial<AgentStatus>): void {
    const data = JSON.parse(fs.readFileSync(this.statusFile, 'utf-8'));
    data.agents[agent] = {
      ...data.agents[agent],
      ...update,
      lastUpdate: new Date().toISOString()
    };
    data.lastSync = new Date().toISOString();
    fs.writeFileSync(this.statusFile, JSON.stringify(data, null, 2));
  }

  /**
   * 블로킹 체인 탐지
   */
  detectBlockingChain(): string[] {
    const statuses = this.getAllStatus();
    const blocked: string[] = [];

    for (const [agent, status] of Object.entries(statuses)) {
      if (status.status === 'waiting' && status.blockedBy) {
        blocked.push(`${agent} ← blocked by ← ${status.blockedBy}`);
      }
    }

    return blocked;
  }

  /**
   * 유휴 에이전트 찾기
   */
  findIdleAgents(): string[] {
    const statuses = this.getAllStatus();
    return Object.entries(statuses)
      .filter(([_, status]) => status.status === 'idle')
      .map(([agent, _]) => agent);
  }

  /**
   * 작업 재할당
   */
  reassignTask(from: string, to: string, task: string): void {
    this.updateStatus(from, {
      status: 'idle',
      currentTask: null
    });

    this.updateStatus(to, {
      status: 'active',
      currentTask: task
    });

    console.log(`📋 Task reassigned: ${from} → ${to}: ${task}`);
  }

  /**
   * 일일 리포트 생성
   */
  generateDailyReport(): string {
    const statuses = this.getAllStatus();
    const blockingChain = this.detectBlockingChain();

    let report = '# Agent Status Report\n\n';
    report += `Date: ${new Date().toISOString().split('T')[0]}\n\n`;

    report += '## Agent Status\n\n';
    for (const [agent, status] of Object.entries(statuses)) {
      report += `### ${agent}\n`;
      report += `- Status: ${status.status}\n`;
      report += `- Current Task: ${status.currentTask || 'None'}\n`;
      report += `- Blocked By: ${status.blockedBy || 'None'}\n`;
      report += `- Blocking Others: ${status.blockingOthers.join(', ') || 'None'}\n\n`;
    }

    if (blockingChain.length > 0) {
      report += '## ⚠️ Blocking Issues\n\n';
      blockingChain.forEach(chain => {
        report += `- ${chain}\n`;
      });
    }

    return report;
  }
}

// 사용 예시
const coordinator = new AgentCoordinator();

// 상태 업데이트
coordinator.updateStatus('db-architect', {
  status: 'active',
  currentTask: 'Creating violations table'
});

// 블로킹 체인 확인
const blocked = coordinator.detectBlockingChain();
if (blocked.length > 0) {
  console.log('⚠️ Blocking detected:', blocked);
}

// 일일 리포트
const report = coordinator.generateDailyReport();
fs.writeFileSync('.claude/reports/daily-2026-01-06.md', report);
```

---

## 🔧 스킬 실행 방법

### 슬래시 커맨드로 실행

각 스킬을 슬래시 커맨드로 등록합니다:

```bash
# .claude/commands/skill-db-schema.md
/skill database-schema-design

# .claude/commands/skill-api-retry.md
/skill api-retry-logic

# .claude/commands/skill-scan-dummies.md
/skill dummy-scanner
```

### 프로그래매틱 실행

```typescript
// scripts/run-skill.ts
import { Skill } from './tools';

async function main() {
  const skillName = process.argv[2];

  switch (skillName) {
    case 'db-schema':
      await Skill({ skill: 'database-schema-design' });
      break;

    case 'api-retry':
      await Skill({ skill: 'api-retry-logic' });
      break;

    case 'scan-dummies':
      await Skill({ skill: 'dummy-scanner' });
      break;

    default:
      console.error('Unknown skill:', skillName);
      process.exit(1);
  }
}

main();
```

---

## 📊 스킬 효과 측정

### 사용 통계
```typescript
// .claude/sync/skill-usage.json
{
  "database-schema-design": {
    "usedCount": 12,
    "avgExecutionTime": "3m 24s",
    "successRate": 0.92
  },
  "api-retry-logic": {
    "usedCount": 8,
    "avgExecutionTime": "1m 12s",
    "successRate": 0.88
  },
  "dummy-scanner": {
    "usedCount": 15,
    "avgExecutionTime": "45s",
    "successRate": 1.0
  }
}
```

---

## 🚀 신규 스킬 추가 가이드

### 1. 스킬 파일 생성
```bash
touch .claude/skills/my-new-skill.md
```

### 2. 스킬 구조 정의
```markdown
# My New Skill

## 목적
[스킬이 해결하는 문제]

## 입력
[필요한 입력 파라미터]

## 실행 프로세스
[단계별 실행 방법]

## 출력
[기대되는 결과]

## 사용 예시
[코드 예시]
```

### 3. 슬래시 커맨드 등록
```bash
echo "/skill my-new-skill" > .claude/commands/my-new-skill.md
```

### 4. SKILLS.md에 문서화
이 파일에 새 스킬 섹션 추가

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2026-01-06
**관리자**: Task Master
