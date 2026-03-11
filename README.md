# @hanseungheon/gen-cmt

AI-powered git commit message generator using [OpenRouter](https://openrouter.ai).  
Staged 변경사항을 분석해 Conventional Commits 형식의 메시지를 자동 생성하고, 인터랙티브 프롬프트로 확인/편집/취소를 선택합니다.

---

## 설치 방법 (Installation)

### 방법 1: 전역 설치 (추천) — 어디서든 `gen-cmt` 명령어 사용

```bash
npm install -g @hanseungheon/gen-cmt
```

설치 후 어떤 Git 프로젝트에서든 바로 사용:

```bash
gen-cmt
```

---

### 방법 2: 프로젝트 로컬 설치 — 팀 프로젝트에서 공유

```bash
npm install @hanseungheon/gen-cmt
```

`package.json`의 `scripts`에 등록:

```json
{
    "scripts": {
        "commit": "gen-cmt"
    }
}
```

사용:

```bash
git add .
npm run commit
```

---

### 방법 3: npx — 설치 없이 바로 사용

```bash
git add .
npx @hanseungheon/gen-cmt
```

---

## API Key 설정 (필수)

[OpenRouter](https://openrouter.ai/keys)에서 API Key를 발급받고, 프로젝트 루트에 `.env.local` 파일을 생성합니다:

```bash
# .env.local
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxx
```

> `.env` 파일도 지원합니다. `.env.local`이 우선 적용됩니다.

---

## 설정 (Configuration)

프로젝트별 또는 전역으로 `.commitai.json` 파일을 통해 동작을 커스터마이즈할 수 있습니다.

### 우선순위

```
CLI 옵션 > 프로젝트 .commitai.json > 전역 ~/.commitai.json > 기본값
```

### 설정 파일 위치

| 범위                            | 경로                          |
| ------------------------------- | ----------------------------- |
| 전역 (모든 프로젝트 적용)       | `~/.commitai.json`            |
| 프로젝트 (해당 프로젝트만 적용) | `프로젝트루트/.commitai.json` |

### 설정 예시

`.commitai.example.json` 참고:

```json
{
    "model": "nvidia/nemotron-3-nano-30b-a3b:free",
    "language": "ko",
    "maxFirstLineLength": 60,
    "temperature": 0.1,
    "maxTokens": 2048,
    "fallbackMessage": "chore: 코드 변경사항 커밋"
}
```

| 옵션                 | 기본값                                | 설명                             |
| -------------------- | ------------------------------------- | -------------------------------- |
| `model`              | `nvidia/nemotron-3-nano-30b-a3b:free` | OpenRouter 모델 ID               |
| `language`           | `ko`                                  | 커밋 메시지 언어 (`ko`, `en` 등) |
| `maxFirstLineLength` | `60`                                  | 첫 줄 최대 글자 수               |
| `temperature`        | `0.1`                                 | 창의성 수준 (0.0 ~ 1.0)          |
| `maxTokens`          | `2048`                                | 최대 토큰 수                     |
| `fallbackMessage`    | `chore: 코드 변경사항 커밋`           | AI 실패 시 대체 메시지           |

---

## 사용 방법 (Usage)

```bash
git add .          # 커밋할 파일 스테이징
gen-cmt            # AI 커밋 메시지 생성
```

실행 시 다음과 같은 인터랙티브 프롬프트가 표시됩니다:

```
🤖 AI 커밋 메시지 생성 중...

----------------------------------------
feat: add user authentication with JWT

- implement login/logout endpoints
- add token refresh mechanism
----------------------------------------

이 메시지를 사용하시겠습니까? (y/e/n) [기본값: y]:
```

### 프롬프트 옵션

| 입력           | 동작                               |
| -------------- | ---------------------------------- |
| `y` 또는 Enter | 메시지 그대로 커밋 실행            |
| `e`            | vim에서 메시지를 직접 편집 후 커밋 |
| `n`            | 커밋 취소                          |

---

## CLI 옵션으로 즉석 오버라이드

설정 파일 수정 없이 일회성으로 옵션을 변경할 수 있습니다:

```bash
# 영어로 커밋 메시지 생성
gen-cmt --language en

# 다른 모델 사용
gen-cmt --model openai/gpt-4o

# 여러 옵션 동시 사용
gen-cmt --model anthropic/claude-3.5-sonnet --language en --maxFirstLineLength 72
```

---

## 무료 모델 추천

[OpenRouter Free Models](https://openrouter.ai/models?order=pricing-asc) 참고:

| 모델                                  | 특징                      |
| ------------------------------------- | ------------------------- |
| `nvidia/nemotron-3-nano-30b-a3b:free` | 기본값, 빠르고 무료       |
| `x-ai/grok-4.1-fast`                  | 최고 품질 (유료지만 저렴) |

---

## 전역 설정 예시 (권장)

한 번만 설정하면 모든 프로젝트에서 API Key 없이 사용 가능:

```bash
# ~/.commitai.json 생성
cat > ~/.commitai.json << 'EOF'
{
  "apiKey": "sk-or-xxxxxxxxxxxx",
  "model": "nvidia/nemotron-3-nano-30b-a3b:free",
  "language": "ko"
}
EOF
```

---

## 이미 있는데 왜 만들었나

1. VSCode 내장 commit message 생성 기능이 불편해서
   - GitLens 자체 기능은 커스텀 프롬프트 반영이 안 됨
2. 자유롭게 컨벤션을 지정하고 싶어서
3. 커밋 메시지 작성이 생각보다 시간이 많이 걸려서, 작업 속도가 떨어짐.
4. agent 사용시에도 해당 라이브러리를 사용하면 불필요한 토큰 소모량을 줄일 수 있음.

---

## License

MIT © [hhhaan](https://github.com/hhhaan)
