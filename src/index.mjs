#!/usr/bin/env node
import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import dotenv from 'dotenv';
import { loadConfig } from './config.mjs';
import { buildSystemPrompt } from './prompt.mjs';
import { complete } from './openrouter.mjs';

dotenv.config({ path: '.env.local' });
dotenv.config();

function parseCLIArgs() {
    const args = process.argv.slice(2);
    const overrides = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const key = args[i].slice(2);
            const val = args[i + 1];
            if (val && !val.startsWith('--')) {
                overrides[key] = val;
                i++;
            }
        }
    }
    return overrides;
}

function isValid(msg, maxLen) {
    if (!msg?.includes(':')) return false;
    return msg.split('\n')[0].length <= maxLen;
}

function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase());
        });
    });
}

function editInVim(content) {
    const tmpFile = path.join(os.tmpdir(), `gen-cmt-edit-${Date.now()}.txt`);
    fs.writeFileSync(tmpFile, content, 'utf-8');
    spawnSync('vim', [tmpFile], { stdio: 'inherit' });
    const edited = fs.readFileSync(tmpFile, 'utf-8').trim();
    fs.unlinkSync(tmpFile);
    return edited;
}

async function main() {
    const config = loadConfig(parseCLIArgs());

    let diff;
    try {
        diff = execSync('git diff --cached --no-color --unified=1', { encoding: 'utf-8' });
    } catch {
        console.error('❌ git diff 실패. Git 저장소 안에서 실행하세요.');
        process.exit(1);
    }

    if (!diff.trim()) {
        console.log('ℹ️  Staged 변경사항 없음. git add 후 다시 실행하세요.');
        process.exit(1);
    }

    console.log('🤖 AI 커밋 메시지 생성 중...');

    let commitMsg = config.fallbackMessage;
    try {
        const raw = await complete(config, buildSystemPrompt(config), `Git diff:\n\n${diff}`);
        if (isValid(raw, config.maxFirstLineLength)) commitMsg = raw;
    } catch (err) {
        console.error(`❌ 생성 실패: ${err.message}`);
    }

    console.log('\n----------------------------------------');
    console.log(commitMsg);
    console.log('----------------------------------------\n');

    const answer = await prompt('이 메시지를 사용하시겠습니까? (y/e/n) [기본값: y]: ');

    if (answer === 'n') {
        console.log('커밋이 취소되었습니다.');
        process.exit(1);
    }

    let finalMsg = commitMsg;

    if (answer === 'e') {
        finalMsg = editInVim(commitMsg);
        if (!finalMsg) {
            console.log('메시지가 비어있어 커밋이 취소되었습니다.');
            process.exit(1);
        }
        console.log('\n----------------------------------------');
        console.log(finalMsg);
        console.log('----------------------------------------\n');
    }

    try {
        execSync(`git commit --no-verify -m ${JSON.stringify(finalMsg)}`, { stdio: 'inherit' });
        console.log('✅ 커밋 완료!');
    } catch {
        console.error('❌ git commit 실패.');
        process.exit(1);
    }
}

main();
