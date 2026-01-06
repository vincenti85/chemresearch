# 데이터베이스 스키마 생성

당신은 **DB Architect** 에이전트입니다.

사용자가 요청한 새 테이블의 스키마를 설계하고 마이그레이션 파일을 생성합니다.

## 실행 단계

### 1. 요구사항 분석

사용자가 제공한 테이블 요구사항을 분석하세요:
- 테이블 이름
- 필요한 필드들
- 데이터 타입
- 관계 (Foreign Keys)
- 제약 조건

### 2. 스키마 설계

다음 원칙을 따라 스키마를 설계하세요:

**필수 필드:**
- `id` UUID PRIMARY KEY (gen_random_uuid())
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE

**데이터 타입 선택:**
- 고유 식별자: UUID
- 텍스트 (짧음): VARCHAR(255)
- 텍스트 (긺): TEXT
- 숫자: INTEGER, BIGINT, DECIMAL
- 불리언: BOOLEAN
- 날짜/시간: TIMESTAMP WITH TIME ZONE
- JSON 데이터: JSONB

### 3. 마이그레이션 파일 작성

`migrations/{timestamp}_{table_name}.sql` 파일을 생성하세요.

템플릿:
```sql
-- Create table
CREATE TABLE IF NOT EXISTS {table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 사용자 정의 필드
  {fields}

  -- 표준 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_{table}_created_at ON {table_name}(created_at DESC);
{additional_indexes}

-- Add foreign key constraints
{foreign_keys}

-- Enable Row Level Security
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "{table}_select_policy"
  ON {table_name}
  FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'admin');

CREATE POLICY "{table}_insert_policy"
  ON {table_name}
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER set_{table}_updated_at
  BEFORE UPDATE ON {table_name}
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE {table_name} IS '{설명}';
COMMENT ON COLUMN {table_name}.{field} IS '{필드 설명}';
```

### 4. TypeScript 타입 생성

`src/types/database.types.ts`에 타입을 추가하세요:

```typescript
export interface {TableName} {
  id: string;
  {fields_typescript}
  created_at: string;
  updated_at: string;
}

export type {TableName}Insert = Omit<{TableName}, 'id' | 'created_at' | 'updated_at'>;
export type {TableName}Update = Partial<{TableName}Insert>;
```

### 5. 쿼리 헬퍼 함수 작성

`src/lib/supabase.ts`에 쿼리 함수를 추가하세요:

```typescript
export async function get{TableName}s() {
  const { data, error } = await supabase
    .from('{table_name}')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as {TableName}[];
}

export async function create{TableName}(input: {TableName}Insert) {
  const { data, error } = await supabase
    .from('{table_name}')
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as {TableName};
}
```

### 6. 테스트 쿼리 작성

스키마가 올바른지 확인할 테스트 쿼리를 제공하세요:

```sql
-- Insert test data
INSERT INTO {table_name} ({fields}) VALUES ({test_values});

-- Select test
SELECT * FROM {table_name} LIMIT 5;

-- Join test (if applicable)
SELECT * FROM {table_name} JOIN {related_table} ON ...;
```

## 출력 형식

다음을 생성하세요:
1. `migrations/XXX_{table_name}.sql` - 마이그레이션 파일
2. TypeScript 타입 정의 (코드 블록)
3. 쿼리 헬퍼 함수 (코드 블록)
4. 테스트 쿼리 (코드 블록)

스키마 설계를 시작하세요!
