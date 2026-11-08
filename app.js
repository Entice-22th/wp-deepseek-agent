/**
 * WP DeepSeek Chat - Frontend Logic
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var sendBtn = document.getElementById('send-btn');
        var userInput = document.getElementById('user-input');
        var chatMessages = document.getElementById('chat-messages');

        // 如果找不到核心元素，说明当前页面没有嵌入聊天组件，直接退出
        if (!sendBtn || !userInput || !chatMessages) return;

        function sendMessage() {
            var text = userInput.value.trim();
            if (!text) return;

            // 从页面里读取后端注入的 JSON 配置 (防止在 WP 中被缓存或覆盖)
            var configEl = document.getElementById('wp-ai-chat-config');
            if (!configEl) {
                appendMessage('后台配置未加载，请确保已安装 PHP 后端代码并刷新页面。', 'ai-message');
                return;
            }
            var wpAiChatData = JSON.parse(configEl.textContent);

            // 显示用户消息
            appendMessage(text, 'user-message');
            userInput.value = '';
            sendBtn.disabled = true;
            sendBtn.innerText = '思考中...';

            // 显示加载提示
            var loadingMsg = appendMessage('DeepSeek 正在思考...', 'ai-message');

            var formData = new FormData();
            formData.append('action', 'hx_deepseek_chat'); // 注意：与 PHP 的 action 名称一致
            formData.append('message', text);
            formData.append('security', wpAiChatData.nonce);

            // 发送 AJAX 请求
            fetch(wpAiChatData.ajaxurl, {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                if (!response.ok) { throw new Error('HTTP ' + response.status); }
                return response.json();
            })
            .then(function(data) {
                loadingMsg.remove();
                if (data.success) {
                    appendMessage(data.data, 'ai-message');
                } else {
                    appendMessage('出错了：' + data.data, 'ai-message');
                }
            })
            .catch(function(error) {
                loadingMsg.remove();
                appendMessage('请求失败，请检查 F12 控制台报错。', 'ai-message');
                console.error('Error:', error);
            })
            .finally(function() {
                sendBtn.disabled = false;
                sendBtn.innerText = '发送';
                userInput.focus();
            });
        }

        // 工具函数：将文本追加到聊天框
        function appendMessage(text, className) {
            var div = document.createElement('div');
            div.className = 'message ' + className;
            div.innerText = text; // 使用 innerText 防止 XSS 攻击
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight; // 自动滚动到底部
            return div;
        }

        // 绑定事件
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    });
})();
