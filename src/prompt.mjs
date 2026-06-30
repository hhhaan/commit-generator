import fs from 'fs';
import path from 'path';

const BASE = `
You are an expert Git commit message generator.
Analyze the git diff and write a commit message conveying the intent of the change.

[Rules]
- Format: [type]: [summary]
- Types: feat|fix|refactor|docs|style|test|chore
- First line = core outcome (max 60 chars)
- Trivial/single-purpose change → summary line only, NO bullets
- Otherwise → 1~3 bullets: What + Why, naming key functions/vars/libs
- No markdown, no code blocks. Commit message only.
- Ignore lockfiles (package-lock.json, yarn.lock, *.lock)
- Order: core logic first, config/deps last.
`.trim();

const LANG = {
    ko: 'Write all commit messages in Korean (한국어).',
    en: 'Write all commit messages in English.',
    ja: 'Write all commit messages in Japanese (日本語).',
    zh: 'Write all commit messages in Chinese (中文).',
};

const EXAMPLE = {
    ko: `Examples:
fix: 로그인 만료 토큰 갱신 누락 수정

refactor: 얼굴 감지 훅 연산 최적화
- useMemo로 감지 핸들러 참조 무결성 유지
- throttle 100ms → 200ms로 CPU 점유율 완화`,

    en: `Examples:
fix: Fix missing token refresh on login expiry

refactor: Optimize face detection hook
- Apply useMemo to keep detection handler referentially stable
- Increase throttle 100ms → 200ms to reduce CPU usage`,
};

export function buildSystemPrompt({ language = 'ko', customPrompt, promptExtras }) {
    if (customPrompt) {
        try {
            return fs.readFileSync(path.resolve(process.cwd(), customPrompt), 'utf-8');
        } catch {
            return customPrompt;
        }
    }

    const lang = LANG[language] ?? LANG.en;
    const example = EXAMPLE[language] ?? EXAMPLE.en;
    const extras = promptExtras ? `\n\n[Additional Rules]\n${promptExtras}` : '';

    return `${BASE}${extras}\n\n${lang}\n\n${example}`;
}
