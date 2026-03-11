# 릴리즈 & 배포 컨벤션

이 프로젝트는 [Semantic Release](https://semantic-release.gitbook.io/semantic-release/)를 사용하여 `main` 브랜치에 push하면 **자동으로 버전 관리 및 npm 배포**가 이루어집니다.

---

## 🔄 동작 흐름

```
커밋 작성 → main 브랜치 push → GitHub Actions 트리거
→ 커밋 메시지 분석 → 버전 자동 결정 → npm publish + GitHub Release 생성
```

---

## 📦 버전 범프 규칙

커밋 메시지의 **타입(type)** 에 따라 버전이 자동으로 결정됩니다.

| 커밋 타입                                         | 버전 변화         | 예시                            |
| ------------------------------------------------- | ----------------- | ------------------------------- |
| `fix:`                                            | **patch** (1.0.x) | `fix: 설정 파일 읽기 오류 수정` |
| `feat:`                                           | **minor** (1.x.0) | `feat: 다국어 커밋 메시지 지원` |
| `feat!:` 또는 `BREAKING CHANGE:`                  | **major** (x.0.0) | `feat!: CLI 옵션 구조 변경`     |
| `chore:`, `docs:`, `style:`, `refactor:`, `test:` | 배포 없음         | push만 되고 배포 안 됨          |

---

## ✍️ 커밋 메시지 형식

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### type 목록

| type       | 설명                               |
| ---------- | ---------------------------------- |
| `feat`     | 새로운 기능 추가                   |
| `fix`      | 버그 수정                          |
| `docs`     | 문서 변경 (배포 없음)              |
| `style`    | 코드 포맷, 세미콜론 등 (배포 없음) |
| `refactor` | 리팩토링 (배포 없음)               |
| `test`     | 테스트 추가/수정 (배포 없음)       |
| `chore`    | 빌드, 패키지 설정 등 (배포 없음)   |

### scope (선택사항)

변경 범위를 괄호 안에 명시합니다.

```
feat(config): 커스텀 프롬프트 파일 경로 옵션 추가
fix(openrouter): API 타임아웃 처리 추가
```

---

## 🚀 배포 예시

### Patch 배포 (1.0.3 → 1.0.4)

```bash
git commit -m "fix: API 응답 파싱 오류 수정"
git push origin main
```

### Minor 배포 (1.0.3 → 1.1.0)

```bash
git commit -m "feat: --dry-run 옵션 추가"
git push origin main
```

### Major 배포 (1.0.3 → 2.0.0)

```bash
git commit -m "feat!: 설정 파일 구조 변경

BREAKING CHANGE: .commitai.json의 model 필드가 models 배열로 변경됨"
git push origin main
```

### 배포 없이 push

```bash
git commit -m "docs: README 예시 추가"
git push origin main
# → GitHub Actions 실행되지만 버전 변경 및 배포 없음
```

---

## ⚙️ 초기 설정 (최초 1회)

### 1. NPM_TOKEN 발급

1. [npmjs.com](https://www.npmjs.com) 로그인
2. 프로필 → **Access Tokens** → **Generate New Token**
3. **Granular Access Token** 선택
4. 패키지: `@hanseungheon/gen-cmt`, 권한: **Read and Write**
5. 생성된 토큰 복사

### 2. GitHub Secrets 등록

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. Name: `NPM_TOKEN`, Value: 위에서 복사한 토큰 붙여넣기
4. **Add secret** 클릭

---

## 📁 관련 파일

| 파일                                                                | 역할                                     |
| ------------------------------------------------------------------- | ---------------------------------------- |
| [`.releaserc.json`](../.releaserc.json)                             | Semantic Release 플러그인 및 브랜치 설정 |
| [`.github/workflows/release.yml`](../.github/workflows/release.yml) | GitHub Actions 워크플로우                |
