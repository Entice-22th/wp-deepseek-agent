
// 防止直接访问
if ( ! defined( 'ABSPATH' ) ) exit;

// 1. 在页面底部输出 JSON 配置块，防止 JS 变量污染
add_action( 'wp_footer', 'hx_output_ai_chat_config', 999 );
function hx_output_ai_chat_config() {
    if ( ! is_admin() ) {
        $config = array(
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'nonce'   => wp_create_nonce( 'ai_chat_nonce' )
        );
        echo '<script type="application/json" id="wp-ai-chat-config">' . wp_json_encode( $config ) . '</script>';
    }
}

// 2. 处理 AJAX 请求 (登录与未登录用户)
add_action( 'wp_ajax_hx_deepseek_chat', 'hx_handle_deepseek_chat_request' );
add_action( 'wp_ajax_nopriv_hx_deepseek_chat', 'hx_handle_deepseek_chat_request' );

function hx_handle_deepseek_chat_request() {
    // 安全校验
    check_ajax_referer( 'ai_chat_nonce', 'security' );

    $message = sanitize_text_field( $_POST['message'] );
    if ( empty( $message ) ) {
        wp_send_json_error( '消息不能为空哦！' );
    }

    // 检查 WordPress 版本是否支持 AI Client
    if ( ! function_exists( 'wp_ai_client_prompt' ) ) {
        wp_send_json_error( '您的WordPress版本过低，请升级到 7.0 或以上版本。' );
    }

    // 自定义系统提示词（开源时提取到变量，方便他人修改）
    $system_prompt = '你是一个乐于助人的 AI 助手。请用简洁、准确的语言回答用户的问题。';

    // 调用 AI 接口
    $result = wp_ai_client_prompt( $message )
        ->usingProvider( 'deepseek' )
        ->usingSystemInstruction( $system_prompt )
        ->generate_text();

    if ( is_wp_error( $result ) ) {
        wp_send_json_error( $result->get_error_message() );
    }

    wp_send_json_success( $result );
}
