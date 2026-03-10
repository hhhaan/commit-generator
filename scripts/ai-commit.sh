#!/bin/bash

npx gen-cmt 

if [ $? -eq 0 ]; then
    COMMIT_MSG=$(cat /tmp/ai_commit_msg.txt)
    
    echo "----------------------------------------"
    echo "$COMMIT_MSG"
    echo "----------------------------------------"
    
    printf "\n이 메시지를 사용하시겠습니까? (y/e/n): "
    read -r response < /dev/tty
    
    case $response in
        [yY]|"")
            echo "커밋을 실행합니다..."
            git commit --no-verify -m "$COMMIT_MSG"
            rm -f /tmp/ai_commit_msg.txt
            exit 0
            ;;
        [eE])
            echo "$COMMIT_MSG" > /tmp/ai_commit_edit.txt
            vim /tmp/ai_commit_edit.txt < /dev/tty
            EDITED_MSG=$(cat /tmp/ai_commit_edit.txt)
            echo "----------------------------------------"
            echo "$EDITED_MSG"
            echo "----------------------------------------"
            git commit --no-verify -m "$EDITED_MSG"
            rm -f /tmp/ai_commit_edit.txt
            rm -f /tmp/ai_commit_msg.txt
            exit 0
            ;;
        *)
            echo "커밋이 취소되었습니다."
            rm -f /tmp/ai_commit_msg.txt
            exit 1
            ;;
    esac
else
    echo "AI 메시지 생성 실패, 일반 커밋을 진행합니다."
    exit 1
fi