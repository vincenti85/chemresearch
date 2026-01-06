# 🤖 ChemResearch 멀티 에이전트 시스템

> **Claude Code 멀티 에이전트 협업 환경**
>
> 이 프로젝트는 5개의 전문화된 Claude Code 에이전트가 협업하여 개발됩니다.

---

## 🚀 빠른 시작

### 1. 필수 문서 읽기

시작하기 전에 다음 문서를 **반드시** 읽어주세요:

1. **[MULTI_AGENT_TUTORIAL.md](./MULTI_AGENT_TUTORIAL.md)** - 멀티 에이전트 실전 가이드
2. **[CLAUDE.md](./CLAUDE.md)** - 에이전트 역할 및 책임 정의
3. **[SKILLS.md](./SKILLS.md)** - 재사용 가능한 전문 스킬
4. **[TASKMASTER.md](./TASKMASTER.md)** - Task Master 운영 가이드

### 2. 환경 설정

```bash
# 저장소 클론
git clone https://github.com/vincenti85/chemresearch.git
cd chemresearch

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 API 키 추가

# 개발 서버 실행
npm run dev
```

### 3. 멀티 에이전트 세션 시작

**5개의 터미널 창을 열고 각각 다음을 실행:**

```bash
# Terminal 1 - Task Master
export CLAUDE_AGENT_ROLE="taskmaster"
cd /path/to/chemresearch
claude

# Terminal 2 - DB Architect
export CLAUDE_AGENT_ROLE="db-architect"
cd /path/to/chemresearch
claude

# Terminal 3 - API Hunter
export CLAUDE_AGENT_ROLE="api-hunter"
cd /path/to/chemresearch
claude

# Terminal 4 - UI Auditor
export CLAUDE_AGENT_ROLE="ui-auditor"
cd /path/to/chemresearch
claude

# Terminal 5 - Version Manager
export CLAUDE_AGENT_ROLE="version-manager"
cd /path/to/chemresearch
claude
```

---

## 🎭 에이전트 소개

### 🎯 Task Master
- **역할**: 전체 프로젝트 조율 및 품질 관리
- **주요 커맨드**: `/taskmaster-morning`, `/taskmaster-sync`
- **관리 파일**: `.claude/sync/`, `.claude/reports/`

### 🗄️ DB Architect
- **역할**: 데이터베이스 설계 및 최적화
- **주요 커맨드**: `/db-schema`, `/migrate`
- **관리 파일**: `migrations/`, `src/types/database.types.ts`

### 🌐 API Hunter
- **역할**: API 통합 및 데이터 수집
- **주요 커맨드**: `/api-audit`, `/test-api`
- **관리 파일**: `src/services/`, `src/data/`

### 🎨 UI Auditor
- **역할**: UI/UX 개선 및 더미 연결 수정
- **주요 커맨드**: `/scan-dummies`, `/fix-dummy`
- **관리 파일**: `src/components/`, `src/audit/`

### 📦 Version Manager
- **역할**: 의존성 관리 및 릴리스 준비
- **주요 커맨드**: `/version-check`, `/release`
- **관리 파일**: `package.json`, `CHANGELOG.md`

---

## 📂 프로젝트 구조

```
chemresearch/
├── .claude/                          # Claude Code 설정
│   ├── commands/                     # 슬래시 커맨드
│   │   ├── taskmaster-morning.md
│   │   ├── taskmaster-sync.md
│   │   ├── db-schema.md
│   │   ├── api-audit.md
│   │   ├── scan-dummies.md
│   │   └── version-check.md
│   ├── skills/                       # 재사용 가능한 스킬
│   ├── sync/                         # 에이전트 동기화
│   │   ├── agent-status.json
│   │   ├── task-board.json
│   │   ├── file-locks.json
│   │   └── daily-plan.md
│   └── reports/                      # 일일 리포트
│
├── src/                              # 소스 코드
│   ├── components/                   # React 컴포넌트
│   ├── services/                     # API 서비스
│   ├── types/                        # TypeScript 타입
│   ├── lib/                          # 유틸리티
│   └── hooks/                        # React 훅
│
├── migrations/                       # DB 마이그레이션
├── scripts/                          # 자동화 스크립트
│
├── MULTI_AGENT_TUTORIAL.md          # 멀티 에이전트 튜토리얼
├── CLAUDE.md                         # 에이전트 역할 정의
├── SKILLS.md                         # 스킬 라이브러리
├── TASKMASTER.md                     # Task Master 가이드
├── CHANGELOG.md                      # 변경 이력
└── README_MULTI_AGENT.md             # 이 파일
```

---

## 🔧 주요 커맨드

### Task Master 커맨드
```bash
/taskmaster-morning     # 오전 루틴 (작업 계획)
/taskmaster-sync        # 에이전트 동기화
/task-add              # 새 작업 추가
/task-assign           # 작업 할당
```

### DB Architect 커맨드
```bash
/db-schema             # 새 테이블 스키마 생성
/migrate               # 마이그레이션 실행
/generate-types        # TypeScript 타입 생성
```

### API Hunter 커맨드
```bash
/api-audit             # API 상태 감사
/test-api <name>       # 특정 API 테스트
/scrape <source>       # 데이터 스크래핑
```

### UI Auditor 커맨드
```bash
/scan-dummies          # 더미 연결 스캔
/fix-dummy <id>        # 특정 더미 수정
/audit-report          # UI 감사 리포트
```

### Version Manager 커맨드
```bash
/version-check         # 의존성 검사
/upgrade <pkg>         # 패키지 업그레이드
/release <version>     # 릴리스 준비
```

---

## 🔄 일일 워크플로우

### 오전 (09:00)
1. **Task Master**: `/taskmaster-morning` 실행
2. 각 에이전트: 할당된 작업 확인
3. 작업 시작

### 정오 (12:00)
1. **Task Master**: `/taskmaster-sync` 실행
2. 블로킹 이슈 해결
3. 우선순위 재조정

### 저녁 (17:00)
1. 작업 완료 및 커밋
2. **Task Master**: Git 통합
3. 일일 리포트 생성
4. 내일 계획 수립

---

## 📊 현재 작업 상태

### Sprint: 2026-01-06 ~ 2026-01-10

#### 진행 중
- [ ] Violations 테이블 완성 (DB Architect)
- [ ] EPA API 안정화 (API Hunter)
- [ ] Navigation 더미 링크 수정 (UI Auditor)
- [ ] 보안 패치 적용 (Version Manager)

#### 예정
- [ ] Violations API 연동
- [ ] 더미 연결 전체 수정
- [ ] v2.0.0 릴리스 준비

---

## 🤝 기여 가이드

### 새 에이전트 추가

1. `CLAUDE.md`에 새 에이전트 역할 정의
2. `.claude/commands/`에 전용 커맨드 추가
3. `.claude/sync/agent-status.json`에 상태 추가
4. `README_MULTI_AGENT.md` 업데이트

### 새 스킬 추가

1. `.claude/skills/{skill-name}.md` 생성
2. `SKILLS.md`에 문서화
3. 해당 에이전트에 할당

---

## 🆘 문제 해결

### Q: 에이전트가 블로킹되었어요
**A**: Task Master에게 에스컬레이션하세요:
```bash
/escalate "API Hunter blocked by DB Architect"
```

### Q: Git 충돌이 발생했어요
**A**: Task Master가 해결합니다. `.claude/sync/notifications.txt` 확인

### Q: 어떤 작업을 해야 할지 모르겠어요
**A**:
```bash
/taskmaster-sync  # 현재 상태 확인
cat .claude/sync/daily-plan.md  # 오늘 계획 보기
```

### Q: 파일이 잠겨있어요
**A**:
```bash
cat .claude/sync/file-locks.json  # 누가 잠갔는지 확인
/wait 15m  # 15분 대기 또는
/message {agent} "Can you unlock {file}?"  # 메시지 보내기
```

---

## 📚 추가 리소스

- [Claude Code 공식 문서](https://docs.anthropic.com/claude/docs)
- [Supabase 문서](https://supabase.com/docs)
- [React 18 문서](https://react.dev)
- [프로젝트 이슈 트래커](https://github.com/vincenti85/chemresearch/issues)

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

## 🙏 크레딧

이 멀티 에이전트 시스템은 Claude Code의 강력한 협업 기능을 활용하여 구축되었습니다.

**개발 팀**:
- Task Master (총괄 조율)
- DB Architect (데이터베이스)
- API Hunter (API 통합)
- UI Auditor (사용자 경험)
- Version Manager (버전 관리)

---

**마지막 업데이트**: 2026-01-06
**프로젝트 버전**: 1.0.0
**문서 버전**: 1.0.0
