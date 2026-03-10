import fs from 'fs';
import path from 'path';

const BASE = `
You are an expert Git commit message generator.
Analyze the provided git diff and generate a commit message that helps fellow developers perfectly understand the intent of the changes.

[Rules]
- Format: [type]: [summary]
- Types: feat|fix|refactor|docs|style|test|chore
- First line = core outcome (max 60 chars)
- 2~5 bullets: What + How/Why, mention function/variable/library names
- No markdown, no code blocks. Output commit message only.
- Ignore: package-lock.json, yarn.lock, *.lock
- Order: core logic first, config/deps last.
`.trim();

const LANG = {
    ko: 'Write all commit messages in Korean (한국어).',
    en: 'Write all commit messages in English.',
    ja: 'Write all commit messages in Japanese (日本語).',
    zh: 'Write all commit messages in Chinese (中文).',
};

const EXAMPLE = {
    ko: `Example:
refactor: 얼굴 감지 훅의 불필요한 연산 제거 및 메모리 최적화

- useMemo를 적용하여 감지 핸들러의 참조 무결성 유지
- throttle 주기를 100ms → 200ms 조정으로 CPU 점유율 완화
- 감지 실패 시 예외 처리 로직 추가로 서비스 안정성 확보`,

    en: `Example:
refactor: Remove redundant computation in face detection hook

- Apply useMemo to preserve referential integrity of detection handler
- Increase throttle interval 100ms → 200ms to reduce CPU usage
- Add error handling for detection failures to improve stability`,
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
