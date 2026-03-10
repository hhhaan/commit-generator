import fs from 'fs';
import path from 'path';
import os from 'os';

const DEFAULTS = {
    model: 'nvidia/nemotron-3-nano-30b-a3b:free',
    temperature: 0.1,
    maxTokens: 2048,
    outputFile: '/tmp/ai_commit_msg.txt',
    language: 'ko',
    fallbackMessage: 'chore: 코드 변경사항 커밋',
    maxFirstLineLength: 60,
};

function readJsonSafe(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
        return {};
    }
}

export function loadConfig(cliOverrides = {}) {
    const globalConfig = readJsonSafe(path.join(os.homedir(), '.commitai.json'));
    const projectConfig = readJsonSafe(path.join(process.cwd(), '.commitai.json'));
    const envConfig = {
        ...(process.env.OPENROUTER_API_KEY && { apiKey: process.env.OPENROUTER_API_KEY }),
    };
    return { ...DEFAULTS, ...envConfig, ...globalConfig, ...projectConfig, ...cliOverrides };
}
