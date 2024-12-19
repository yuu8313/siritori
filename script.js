document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const resetButton = document.getElementById('resetButton');
    const messageHistory = document.getElementById('messageHistory');
    const scoreElement = document.getElementById('score');
    
    let score = 0;
    let lastWord = '';
    let usedWords = new Set();

    const smallKanaMap = {
        'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
        'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'っ': 'つ', 'ゎ': 'わ'
    };

    function normalizeKana(word) {
        return word.replace(/(.)$/, (match, lastChar) => smallKanaMap[lastChar] || lastChar);
    }

    function isValidInput(input) {
        const hiraganaRegex = /^[ぁ-んー]+$/;
        return hiraganaRegex.test(input) && input.length >= 2;
    }

    function containsBlockedWord(input) {
        return window.blockedWords.some(word => input.includes(word));
    }

    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        messageDiv.textContent = text;
        messageHistory.appendChild(messageDiv);
        messageHistory.scrollTop = messageHistory.scrollHeight;
        
        anime({
            targets: messageDiv,
            opacity: [0, 1],
            translateX: isUser ? [50, 0] : [-50, 0],
            duration: 500,
            easing: 'easeOutCubic'
        });
    }

    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.style.opacity = '1';  
        notification.style.visibility = 'visible';
        notification.textContent = message;
        
        anime({
            targets: notification,
            translateX: [150, 0],
            duration: 800,
            easing: 'spring(1, 80, 10, 0)',
            complete: () => {
                setTimeout(() => {
                    anime({
                        targets: notification,
                        translateX: [0, 150],
                        opacity: [1, 0],
                        duration: 500,
                        easing: 'easeInBack',
                        complete: () => {
                            notification.style.visibility = 'hidden';  
                        }
                    });
                }, 2000);
            }
        });
    }

    function handleUserInput() {
        const word = userInput.value.trim();
        const normalizedWord = normalizeKana(word);

        if (!isValidInput(normalizedWord)) {
            showNotification('ひらがな2文字以上で入力してください');
            return;
        }

        if (containsBlockedWord(normalizedWord)) {
            showNotification('不適切な言葉が含まれています');
            userInput.value = '';
            return;
        }
        
        const normalizedLastWord = normalizeKana(lastWord);
        if (normalizedLastWord && normalizedWord[0] !== normalizedLastWord[normalizedLastWord.length - 1]) {
            showNotification('前の言葉の最後の文字から始めてください');
            return;
        }
        
        if (usedWords.has(normalizedWord)) {
            showNotification('すでに使用された言葉です');
            return;
        }
        
        addMessage(word, true); 
        usedWords.add(normalizedWord);
        lastWord = normalizedWord;
        score += normalizedWord.length;
        scoreElement.textContent = score;
        
        anime({
            targets: scoreElement,
            scale: [1.2, 1],
            duration: 300,
            easing: 'easeOutBounce'
        });
        
        userInput.value = '';

        if (normalizedWord.endsWith('ん')) {
            showNotification('ゲームオーバー！AIの勝ちです！');
            setTimeout(resetGame, 2000);
            return;
        }
        
        setTimeout(() => {
            const aiResponse = getAIResponse(normalizedWord);
            if (aiResponse) {
                addMessage(aiResponse, false);
                lastWord = aiResponse;
                usedWords.add(aiResponse);
            } else {
                showNotification('AIの負けです！おめでとう！');
                setTimeout(resetGame, 2000);
            }
        }, 1000);
    }

    function resetGame() {
        score = 0;
        lastWord = '';
        usedWords.clear();
        scoreElement.textContent = score;
        messageHistory.innerHTML = '';
        addMessage('しりとりを始めましょう！好きな言葉から始めてください', false);
    }

    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });
    resetButton.addEventListener('click', resetGame);

    // 初期メッセージ
    addMessage('しりとりを始めましょう！好きな言葉から始めてください', false);
});
