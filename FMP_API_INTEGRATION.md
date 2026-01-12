# Financial Modeling Prep API Integration Guide

이 문서는 Financial Modeling Prep (FMP) API를 프로젝트에 통합하고 Bolt.new 또는 유사한 환경에서 발생하는 연결 오류를 해결하는 방법을 설명합니다.

## 📋 목차 (Table of Contents)

1. [빠른 시작](#빠른-시작-quick-start)
2. [흔한 오류 및 해결방법](#흔한-오류-및-해결방법)
3. [API 사용 예제](#api-사용-예제)
4. [트러블슈팅](#트러블슈팅)
5. [프로덕션 배포](#프로덕션-배포)

---

## 빠른 시작 (Quick Start)

### 1. 환경 변수 설정

1. `.env.example` 파일을 `.env`로 복사:
```bash
cp .env.example .env
```

2. `.env` 파일에 FMP API 키 추가:
```env
VITE_FMP_API_KEY=TaZ5izhTVuDtlgsyvgGT87EkBeKCWrXC
```

### 2. 개발 서버 재시작

환경 변수를 적용하려면 개발 서버를 재시작해야 합니다:

```bash
# 서버 중지 (Ctrl+C)
# 서버 재시작
npm run dev
```

### 3. API 연결 테스트

브라우저에서 FMPTest 컴포넌트를 사용하여 연결을 테스트할 수 있습니다:

```tsx
import FMPTest from './components/FMPTest';

// App.tsx 또는 원하는 위치에 추가
<FMPTest />
```

---

## 흔한 오류 및 해결방법

### ❌ 문제 1: CORS 오류
```
Access to fetch at 'https://financialmodelingprep.com' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

**원인**: 브라우저가 보안상의 이유로 다른 도메인으로의 직접 요청을 차단

**✅ 해결방법**:
- **개발 환경**: Vite 프록시 사용 (이미 구성됨)
- **프로덕션**: 백엔드 프록시 또는 Netlify/Vercel 리다이렉트 사용

**설정 확인**:
```typescript
// vite.config.ts - 이미 구성되어 있음
server: {
  proxy: {
    '/api/fmp': {
      target: 'https://financialmodelingprep.com/api',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/fmp/, ''),
    }
  }
}
```

---

### ❌ 문제 2: 401 Unauthorized 또는 403 Forbidden
```
FMP API Authentication Error: Invalid API Key
```

**원인**: API 키가 잘못되었거나 설정되지 않음

**✅ 해결방법**:
1. `.env` 파일 확인:
   ```env
   VITE_FMP_API_KEY=TaZ5izhTVuDtlgsyvgGT87EkBeKCWrXC
   ```

2. API 키 앞에 `VITE_` 접두사가 있는지 확인 (Vite 필수)

3. 개발 서버 재시작:
   ```bash
   npm run dev
   ```

4. FMP 대시보드에서 API 키가 활성화되어 있는지 확인:
   - https://site.financialmodelingprep.com/developer/docs/dashboard

5. 구독 상태 확인 (유료 플랜이 활성화되어 있는지)

---

### ❌ 문제 3: 429 Too Many Requests
```
FMP API Rate Limit Exceeded
```

**원인**: API 호출 한도 초과

**✅ 해결방법**:
1. FMP 대시보드에서 현재 사용량 확인
2. API 호출 간격 조정 또는 캐싱 구현
3. 더 높은 플랜으로 업그레이드 고려

---

### ❌ 문제 4: Network Error / Timeout
```
FMP API Network Error. Please check your connection
```

**원인**:
- 네트워크 연결 문제
- 방화벽 차단
- Vite 프록시 미작동

**✅ 해결방법**:
1. 인터넷 연결 확인
2. 개발 서버가 실행 중인지 확인
3. 브라우저 콘솔에서 실제 요청 URL 확인
4. 방화벽이나 VPN이 요청을 차단하는지 확인

---

### ❌ 문제 5: 환경 변수가 undefined
```
console.warn('FMP API key not configured')
```

**원인**: Vite가 환경 변수를 인식하지 못함

**✅ 해결방법**:
1. 환경 변수가 `VITE_`로 시작하는지 확인
2. `.env` 파일이 프로젝트 루트에 있는지 확인
3. 개발 서버를 완전히 재시작 (Ctrl+C 후 다시 시작)
4. 브라우저 캐시 클리어

---

## API 사용 예제

### 기본 사용법

```typescript
import { fmpApi } from './lib/fmpApi';

// 1. 연결 테스트
const result = await fmpApi.testConnection();
console.log(result); // { success: true, message: '...' }

// 2. 주식 시세 조회
const quote = await fmpApi.getQuote('AAPL');
console.log(quote);

// 3. 회사 프로필 조회
const profile = await fmpApi.getProfile('AAPL');
console.log(profile);

// 4. 시장 상태 확인
const marketStatus = await fmpApi.getMarketStatus();
console.log(marketStatus);
```

### React 컴포넌트에서 사용

```typescript
import { useState, useEffect } from 'react';
import { fmpApi, StockQuote } from './lib/fmpApi';

function StockPrice() {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuote() {
      try {
        setLoading(true);
        const data = await fmpApi.getQuote('AAPL');
        setQuote(data[0]); // API returns array
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchQuote();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!quote) return <div>No data</div>;

  return (
    <div>
      <h2>{quote.name} ({quote.symbol})</h2>
      <p>Price: ${quote.price}</p>
      <p>Change: {quote.changesPercentage}%</p>
    </div>
  );
}
```

### 에러 처리

```typescript
try {
  const quote = await fmpApi.getQuote('AAPL');
  console.log(quote);
} catch (error) {
  if (error instanceof Error) {
    // 구체적인 에러 메시지 처리
    if (error.message.includes('Authentication')) {
      console.error('API 키를 확인하세요');
    } else if (error.message.includes('Rate Limit')) {
      console.error('API 호출 한도를 초과했습니다');
    } else if (error.message.includes('Network')) {
      console.error('네트워크 연결을 확인하세요');
    } else {
      console.error('API 오류:', error.message);
    }
  }
}
```

---

## 트러블슈팅

### 디버깅 체크리스트

✅ **환경 변수 확인**:
```bash
# 터미널에서 확인
echo $VITE_FMP_API_KEY

# 또는 코드에서 확인
console.log('API Key:', import.meta.env.VITE_FMP_API_KEY);
```

✅ **네트워크 요청 확인**:
1. 브라우저 개발자 도구 열기 (F12)
2. Network 탭 이동
3. API 요청 실행
4. 요청 URL, 헤더, 응답 확인

✅ **프록시 작동 확인**:
```typescript
// 개발 모드에서는 프록시 사용
console.log('Using proxy:', import.meta.env.DEV);
console.log('API Base:', import.meta.env.DEV ? '/api/fmp' : 'https://financialmodelingprep.com/api');
```

✅ **API 키 유효성 테스트**:
```bash
# 직접 curl로 테스트
curl "https://financialmodelingprep.com/api/v3/is-the-market-open?apikey=YOUR_API_KEY"
```

---

## 프로덕션 배포

### Netlify

`netlify.toml` 파일 생성:

```toml
[[redirects]]
  from = "/api/fmp/*"
  to = "https://financialmodelingprep.com/api/:splat"
  status = 200
  force = true
```

### Vercel

`vercel.json` 파일 생성:

```json
{
  "rewrites": [
    {
      "source": "/api/fmp/:path*",
      "destination": "https://financialmodelingprep.com/api/:path*"
    }
  ]
}
```

### 환경 변수 설정

프로덕션 환경에서 다음 환경 변수를 설정하세요:

```env
VITE_FMP_API_KEY=your_production_api_key
```

Netlify/Vercel 대시보드에서:
1. Site settings → Environment variables
2. `VITE_FMP_API_KEY` 추가
3. 값을 입력하고 저장
4. 재배포

---

## 추가 리소스

- 📚 [FMP API Documentation](https://site.financialmodelingprep.com/developer/docs)
- 🔑 [FMP Dashboard](https://site.financialmodelingprep.com/developer/docs/dashboard)
- 💬 [FMP Support](https://site.financialmodelingprep.com/contact)

---

## 요약

**개발 환경에서 API가 작동하지 않을 때**:

1. ✅ `.env` 파일에 `VITE_FMP_API_KEY` 설정
2. ✅ 개발 서버 재시작 (`npm run dev`)
3. ✅ FMPTest 컴포넌트로 연결 테스트
4. ✅ 브라우저 콘솔에서 에러 메시지 확인
5. ✅ API 키가 FMP 대시보드에서 활성화되어 있는지 확인

이 단계를 따르면 대부분의 연결 문제가 해결됩니다!
