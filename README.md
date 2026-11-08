# wp-deepseek-agent
基于 WordPress 7.0 原生 AI Client 的极简 DeepSeek 聊天窗口，纯代码无依赖。
WordPress 极简 AI 接入 (DeepSeek Chat)

本项目是一个纯代码实现的 WordPress AI 聊天助手接入方案。摒弃了臃肿的第三方 AI 聊天插件，利用 WordPress 7.0+ 原生内置的 AI Client SDK 结合原生 JavaScript (Fetch API)，实现了一个轻量、美观、响应式的聊天窗口，并完美接入 DeepSeek 大模型。

<img width="626" height="510" alt="图片" src="https://github.com/user-attachments/assets/80aec146-a6b6-46d8-835f-cf7e14454025" />


项目特性

极简轻量：没有引入 React/Vue 等重型框架，纯原生 `HTML + CSS + 原生 JS`，加载速度极快。
三端自适应：CSS 采用作用域隔离 (`#ai-chat-container`)，完美适配 PC、平板和手机端，不受主题样式干扰。
安全无痛：无需直接修改主题的 `functions.php`。推荐使用 `Code Snippets` 插件注入 PHP 逻辑，避免主题更新导致代码丢失或网站白屏。
原生 SDK 驱动：基于 WordPress 7.0+ 原生的 `wp_ai_client_prompt()` 函数，干净优雅。
前后端分离：AJAX 异步请求，并自带 Nonce 安全校验，防止恶意调用。

环境要求 (Prerequisites)

WordPress >= 7.0(必须，因为使用了原生 AI Client API)
已配置好 DeepSeek 的 API Key（推荐使用 DeepSeek 连接器插件或在 `wp-config.php` 中定义）
推荐安装 [Code Snippets](https://wordpress.org/plugins/code-snippets/) 插件

配置说明
默认使用系统设定的提示词。如需修改，请在 `backend-snippet.php` 中找到 `$system_prompt` 变量进行自定义修改。

