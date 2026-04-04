document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ Light Mode';
    }

    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️ Light Mode';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙 Dark Mode';
            localStorage.setItem('theme', 'light');
        }
    });

    // Load Chat History from localStorage
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(function(msg) {
        renderChatMessage(msg.message, msg.sender);
    });

    // Debug Code Function
    window.debugCode = function() {
        const codeInput = document.getElementById('code-input').value.trim();
        const language = document.getElementById('language-selector').value;
        const aiOutput = document.getElementById('ai-output');

        if (!codeInput) {
            aiOutput.textContent = '⚠️ Please paste some code to analyze.';
            aiOutput.style.color = '#ef4444';
            return;
        }

        aiOutput.style.color = 'var(--text-color)';
        aiOutput.textContent = '🔍 Analyzing your code...';

        // Simulate AI analysis (replace with actual API call later)
        setTimeout(function() {
            const suggestions = analyzeCode(codeInput, language);
            aiOutput.textContent = suggestions;
        }, 1500);
    };

    // Simple Code Analyzer (placeholder - replace with AI API)
    function analyzeCode(code, language) {
        let issues = [];

        if (language === 'python') {
            if (code.includes('print(') && !code.includes(')')) {
                issues.push('❌ Missing closing parenthesis in print statement');
            }
            if (code.includes('=') && !code.includes('==') && code.includes('if ')) {
                issues.push('⚠️ Possible assignment instead of comparison in if statement');
            }
            if (!code.includes('import') && code.includes('import')) {
                issues.push('⚠️ Check import statements');
            }
        } else if (language === 'javascript') {
            if (code.includes('var ')) {
                issues.push('💡 Consider using let or const instead of var');
            }
            if (code.includes('==') && !code.includes('===')) {
                issues.push('💡 Use === instead of == for strict equality');
            }
            if (code.includes('console.log') && !code.includes(';')) {
                issues.push('⚠️ Missing semicolon after console.log');
            }
        }

        if (issues.length === 0) {
            return `✅ No obvious issues detected in your ${language} code!\n\n💡 Tips:\n- Add error handling\n- Consider edge cases\n- Write unit tests`;
        }

        return `🐛 Found ${issues.length} issue(s):\n\n${issues.join('\n\n')}\n\n💡 Review and fix accordingly!`;
    }

    // Send Chat Message
    window.sendMessage = function() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();

        if (!message) return;

        // Add user message
        addChatMessage(message, 'user');
        chatInput.value = '';

        // Simulate AI response
        setTimeout(function() {
            const response = generateAIResponse(message);
            addChatMessage(response, 'ai');
        }, 1000);
    };

    // Add Chat Message to UI and Save
    function addChatMessage(message, sender) {
        // Save to history
        chatHistory.push({ message: message, sender: sender });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

        renderChatMessage(message, sender);
    }

    // Render Chat Message (UI only, no save)
    function renderChatMessage(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        messageDiv.style.marginBottom = '0.75rem';
        messageDiv.style.padding = '0.75rem';
        messageDiv.style.borderRadius = '8px';
        messageDiv.style.backgroundColor = sender === 'user' ? 'var(--primary-color)' : 'var(--bg-color)';
        messageDiv.style.color = sender === 'user' ? 'white' : 'var(--text-color)';
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Generate AI Response (placeholder - replace with AI API)
    function generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('error') || lowerMessage.includes('bug')) {
            return '🔍 Can you share the specific error message or code snippet? I\'ll help you debug it!';
        } else if (lowerMessage.includes('how') && lowerMessage.includes('fix')) {
            return '💡 To fix this, check your variable scopes, ensure proper syntax, and add error handling. Share the code for specific help!';
        } else if (lowerMessage.includes('explain')) {
            return '📚 I\'d be happy to explain! Could you provide the code or concept you\'d like me to break down?';
        } else if (lowerMessage.includes('thank')) {
            return '😊 You\'re welcome! Happy to help. Let me know if you need anything else!';
        } else {
            return '🤖 Thanks for your message! Share your code or describe the issue, and I\'ll help you debug it.';
        }
    }

    // Allow Enter key to send chat message
    document.getElementById('chat-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
