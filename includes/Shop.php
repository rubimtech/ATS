<?php

defined('ABSPATH') or exit;

require_once 'Helpers.php';
require_once 'Settings.php';
require_once 'Bot.php';

class Shop
{
    /**
     * @var string
     */
    protected $nonceParam;

    /**
     * @var string
     */
    protected $nonceName;

    public function __construct()
    {
        add_action('parse_request', [$this, 'show']);
        add_action('wp_ajax_nopriv_telegram_shop_create_invoice_link',  [$this, 'createInvoiceLink']);
        add_action('wp_ajax_telegram_shop_create_invoice_link',  [$this, 'createInvoiceLink']);

        $this->nonceName  = 'tgshop-request-settings';
        $this->nonceParam = 'tgshop-request-settings-nonce';

        add_filter( 'rest_request_after_callbacks', function($response) {
            if ( !$response || is_wp_error( $response ) ) {
                return $response;
            }
            $response->header( $this->nonceParam, wp_create_nonce($this->nonceName) );
            return $response;
        }, 10, 3 );
    }

    public function show() {
        global $wp;

        if(is_admin()) {
            return;
        }

        if(!preg_match("/telegram-page-(.*)\/?$/", $wp->request, $matches)) {
            return;
        }
        
        $botName = $matches[1];

        $bot = new Bot(Settings::getBotByUserName($botName));
        if(!$bot->isActive()) {
            return;
        }

        $payments = $bot->getPaymentsFlat();
        Helpers::view('index', [
            'payments' => esc_attr($payments),
            'botName' => esc_attr($bot->getName()), 
            'settings' => Settings::getSettings(),
            'security' => [
                'key' => esc_attr($this->nonceParam), 
                'value' => esc_attr(wp_create_nonce($this->nonceName))
            ]
        ]);
        exit();
    }

    function createInvoiceLink() {
        if (wp_verify_nonce(AdminPage::getFromSuperGlobal($_POST, $this->nonceParam), $this->nonceName) === false) {
            wp_send_json_error(
                array('message' => esc_html__('Failed nonce verification', 'algolplus-telegram-shop-for-woocommerce'))
            );
        }

        $userId = get_current_user_id();
        $botName = AdminPage::getFromSuperGlobal($_REQUEST, 'botName', '');
        $paymentName = AdminPage::getFromSuperGlobal($_REQUEST, 'paymentName', '');

        $bot = new Bot(Settings::getBotByUserName($botName));
        
        if(!$bot->isActive()) {
            return;
        }

        $paymentToken = $bot->getPaymentTokenByName($paymentName);
        if(!$paymentToken) {
            return;
        }

        $customer = WC()->customer;
        $cart = WC()->cart;
        $checkout = WC()->checkout();

        $cart->calculate_totals();

        $orderId = $checkout->create_order([
            'payment_method' => 'telegram'
        ]);
        $order = wc_get_order($orderId);
        $orderKey = $order->get_order_key();

        $order->set_customer_id( $customer->get_id() );
		$order->set_address( $customer->get_billing(), 'billing' );
		$order->set_address( $customer->get_shipping(), 'shipping' );
        $order->calculate_totals();
        $order->save();

        

        $prices = array_values(array_map(function($item) {
            $name          = $item->get_name();
            $quantity      = $item->get_quantity();
            $line_subtotal = $item->get_subtotal(); 
    
            return [
                'label' => "{$name}" . ($quantity > 1 ? " х {$quantity}" : ''),
                'amount' => intval($line_subtotal * 100),
            ];
        }, $order->get_items()));

        foreach($order->get_tax_totals() as $item ) {
            $prices[] = [
                'label' => "Tax({$item->label}):",
                'amount' => intval($item->amount * 100),
            ];
        }

        foreach( $order->get_items( 'shipping' ) as $item_id => $item ) {
            $prices[] = [
                'label' => "Shipping({$item->get_name()}):",
                'amount' => intval($item->get_total() * 100),
            ];
        }

        $result = wp_remote_post(
            "https://api.telegram.org/bot" . $bot->getToken() . "/createInvoiceLink?", [
                'body' => [
                    'title' => "Order",
                    'description' => "Order #{$orderId}",
                    'payload' => wp_json_encode(['userId' => $userId, 'orderId' => $orderId, 'orderKey' => $orderKey]),
                    'provider_token' => $paymentToken,
                    'currency' => $order->get_order_currency(),
                    'prices' => wp_json_encode($prices),
                ]
            ]
        );

        $result = json_decode($result['body'], true);
        if ($result['ok']) {
            $cart->empty_cart();
            wp_send_json_success([
                'url' => $result['result'], 
                'orderId' => $orderId, 
                'orderKey' => $orderKey, 
                'debug' => [
                    'prices' => $prices
                ]
            ]);  
        } else {
            wp_send_json_error([
                'message' => $result['description'],
                'debug' => [
                    'prices' => $prices
                ]
            ]);
        }
    }
}