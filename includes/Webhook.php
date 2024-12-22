<?php

defined('ABSPATH') or exit;

require_once 'Settings.php';
require_once 'User.php';
require_once 'Bot.php';
class Webhook
{
    protected $token;
    protected $secretToken;

    public function __construct()
    {
        $botData           = \Settings::getBots();
        $this->token       = $botData['telegram_bot_token'] ?? '';
        $this->secretToken = $botData['secret_token'] ?? '';

        add_action('rest_api_init', function () {
            register_rest_route('algol/telegram-api/v1', '/webhook', array(
                array(
                    'methods'             => \WP_REST_Server::ALLMETHODS,
                    'callback'            => array($this, 'getMessage'),
                    'permission_callback' => '__return_true'
                )
            ));
        });
    }

    public function getMessage($request)
    {
        $headers = getallheaders();
        $secretToken = $headers['X-Telegram-Bot-Api-Secret-Token'] ?? false;
        
        $bot = new Bot(Settings::getBotBySecretToken($secretToken));

        if(!$bot->isActive()) {
            return;
        }

        $token = $bot->getToken();

        $message          = $request->get_param('message');
        $preCheckoutQuery = $request->get_param('pre_checkout_query');
        $shippingQuery    = $request->get_param('shipping_query');

        $successfulPayment = $message['successful_payment'] ?? null;
        if($successfulPayment) {
            $payload = json_decode($successfulPayment['invoice_payload']);
            $orderId = $payload->orderId;
            $order = wc_get_order($orderId);
            
            $order->update_status( 'completed' );
        } else if ($message) {
            $chat = $message['chat'];

            if ($message['text'] === '/ping') {
                $response = wp_remote_post(
                    "https://api.telegram.org/bot{$token}/sendMessage",
                    [
                        'body' => [
                            'chat_id' => $chat['id'],
                            'text'    => 'Pong!',
                        ]
                    ]
                );
            } elseif ($message['text'] === '/start') {
                $response = wp_remote_post(
                    "https://api.telegram.org/bot{$token}/sendMessage",
                    [
                        'body' => [
                            'chat_id'      => $chat['id'],
                            'text'         => 'Here\'s the link!',
                            'parse_mode'   => 'Markdown',
                            'reply_markup' => '{"inline_keyboard":[[{"text":"Link","web_app":{"url":"' . $bot->getMiniAppUrl() . '"}}]]}',
                        ]
                    ]
                );
            }
        } elseif ($preCheckoutQuery) {
            $preCheckoutQueryId = $preCheckoutQuery['id'];

            $response           = wp_remote_post(
                "https://api.telegram.org/bot{$token}/answerPreCheckoutQuery",
                [
                    'body' => [
                        'pre_checkout_query_id' => $preCheckoutQueryId,
                        'ok'                    => true
                    ]
                ]
            );
        }
    }
}