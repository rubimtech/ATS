<?php

defined('ABSPATH') or exit;

require_once 'Settings.php';
require_once 'Bot.php';
class AdminPage
{
    const SLUG = 'telegram_shop';
    const TAB_REQUEST_KEY = 'tab';

    /**
     * @var array[]
     */
    protected $tabs;

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
        $this->tabs = array(
            'bots'     => array(
                'filename' => 'bots.php',
                'label'    => __('Shop', 'algolplus-telegram-shop-for-woocommerce'),
            ),
            'settings' => array(
                'filename' => 'settings.php',
                'label'    => __('Settings', 'algolplus-telegram-shop-for-woocommerce'),
            ),
        );

        $this->nonceParam = 'tgshop-request-settings-nonce';
        $this->nonceName  = 'tgshop-request-settings';
    }

    static function getFromSuperGlobal($superGlobal, $postName, $defaultValue = null) {
        return isset($superGlobal[$postName]) ? self::sanitize_text_or_array_field(wp_unslash($superGlobal[$postName])) : $defaultValue;
    }

    static function sanitize_text_or_array_field($array_or_string) {
        if( is_string($array_or_string) ){
            $array_or_string = sanitize_text_field($array_or_string);
        }elseif( is_array($array_or_string) ){
            foreach ( $array_or_string as $key => &$value ) {
                if ( is_array( $value ) ) {
                    $value = self::sanitize_text_or_array_field($value);
                }
                else {
                    $value = sanitize_text_field( $value );
                }
            }
        }

        return $array_or_string;
    }

    public function registerPage()
    {
        add_action('admin_menu', function () {
            add_submenu_page(
                'woocommerce',
                __('Telegram Shop', 'algolplus-telegram-shop-for-woocommerce'),
                __('Telegram Shop', 'algolplus-telegram-shop-for-woocommerce'),
                'manage_woocommerce',
                self::SLUG,
                array($this, 'showAdminPage')
            );
        });
        add_action('wp_ajax_telegram_shop_save_settings', function () {
            if (wp_verify_nonce(AdminPage::getFromSuperGlobal($_POST, $this->nonceParam), $this->nonceName) === false) {
                wp_send_json_error(
                    array('message' => esc_html__('Failed nonce verification', 'algolplus-telegram-shop-for-woocommerce'))
                );
            }

            Settings::saveSettings([
                'hide_product_search'    => AdminPage::getFromSuperGlobal($_POST, 'hide_product_search', 'on'),
                'hide_category_selector' => AdminPage::getFromSuperGlobal($_POST,'hide_category_selector', 'on'),
                'product_columns'        => AdminPage::getFromSuperGlobal($_POST,'product_columns', 2),
            ]);
        });

        add_action('wp_ajax_telegram_shop_save_token', function () {
            if (wp_verify_nonce(AdminPage::getFromSuperGlobal($_POST, $this->nonceParam), $this->nonceName) === false) {
                wp_send_json_error(
                    array('message' => esc_html__('Failed nonce verification', 'algolplus-telegram-shop-for-woocommerce'))
                );
            }

            $botToken = AdminPage::getFromSuperGlobal($_POST,'telegram_bot_token');

            $botData = Settings::getBot();

            $botData['telegram_bot_token'] = $botToken;
            $botData['shop_activated']     = false;
            $botData['token_validated']    = false;
            $botData['username']           = '';

            $result = wp_remote_get("https://api.telegram.org/bot" . $botToken . "/getMe");
            $result = json_decode($result['body'], true);

            if ($result['ok']) {
                $botData['token_validated'] = true;
                $botData['username']        = $result['result']['username'];
                Settings::saveBot($botData);

                wp_send_json_success(array(
                    'message' => esc_html(
                        __(
                            'Token has been updated successfully - ',
                            'algolplus-telegram-shop-for-woocommerce'
                        ) . esc_html($botData['username'])
                    )
                ));
            } else {
                wp_send_json_error(array(
                    'message' => esc_html(
                        __(
                            'Token is not valid - ',
                            'algolplus-telegram-shop-for-woocommerce'
                        ) . $result['description']
                    )
                ));
            }
        });
        add_action('wp_ajax_telegram_shop_activate_shop', function () {
            if (wp_verify_nonce(AdminPage::getFromSuperGlobal($_POST, $this->nonceParam), $this->nonceName) === false) {
                wp_send_json_error(
                    array('message' => esc_html__('Failed nonce verification', 'algolplus-telegram-shop-for-woocommerce'))
                );
            }

            $botData = Settings::getBot();

            if ($botData && ! empty($botData['telegram_bot_token']) && ! $botData['shop_activated']) {
                $secretToken = wp_generate_password(12, false);

                $getQuery = array(
                    "url"          => home_url("/wp-json/algol/telegram-api/v1/webhook"),
                    "secret_token" => $secretToken
                );

                $result = wp_remote_get(
                    "https://api.telegram.org/bot" . $botData['telegram_bot_token'] . "/setWebhook?" . http_build_query(
                        $getQuery
                    )
                );
                $result = json_decode($result['body'], true);

                if ($result['ok']) {
                    $botData['shop_activated'] = true;
                    $botData['secret_token']   = $secretToken;
                    Settings::saveBot($botData);

                    $shopUrl = esc_html($botData['username'] ? 'https://t.me/' . $botData['username'] : '');

                    $bot = new Bot($botData);
                    $response = wp_remote_post(
                        "https://api.telegram.org/bot{$botData['telegram_bot_token']}/setChatMenuButton",
                        [
                            'body' => [
                                'menu_button' => wp_json_encode([
                                    'type' => 'web_app',
                                    'text' => 'Shop',
                                    'web_app' => [
                                        'url' => $bot->getMiniAppUrl()
                                    ]
                                ])
                            ]
                        ]
                    );
                    
                    wp_send_json_success(
                        array(
                            'shopUrl' => $shopUrl,
                            'message' => __('Shop is active at ', 'algolplus-telegram-shop-for-woocommerce') . $shopUrl
                        )
                    );
                } else {
                    wp_send_json_error(
                        array(
                            'message' => esc_html(
                                __('Bot activation failed - ', 'algolplus-telegram-shop-for-woocommerce') . $result['description']
                            )
                        )
                    );
                }
            } else {
                wp_send_json_error(array(
                    'message' => esc_html(
                        __('Bot activation failed - ', 'algolplus-telegram-shop-for-woocommerce') . __(
                            'plugin database error',
                            'algolplus-telegram-shop-for-woocommerce'
                        )
                    )
                ));
            }
        });
        add_action('wp_ajax_telegram_shop_deactivate_shop', function () {
            if (wp_verify_nonce(AdminPage::getFromSuperGlobal($_POST, $this->nonceParam), $this->nonceName) === false) {
                wp_send_json_error(
                    array('message' => esc_html__('Failed nonce verification', 'algolplus-telegram-shop-for-woocommerce'))
                );
            }

            $botData = Settings::getBot();

            if ($botData && ! empty($botData['telegram_bot_token']) && $botData['shop_activated']) {
                $getQuery = array(
                    "url" => '',
                );

                $result = wp_remote_get(
                    "https://api.telegram.org/bot" . $botData['telegram_bot_token'] . "/setWebhook?" . http_build_query(
                        $getQuery
                    )
                );
                $result = json_decode($result['body'], true);

                if ($result['ok']) {
                    $botData['shop_activated'] = false;
                    $botData['secret_token']   = '';
                    Settings::saveBot($botData);

                    wp_send_json_success(
                        array('message' => esc_html__('Bot successfully deactivated', 'algolplus-telegram-shop-for-woocommerce'))
                    );
                } else {
                    wp_send_json_error(array(
                        'message' => esc_html(
                            __('Bot deactivation failed - ', 'algolplus-telegram-shop-for-woocommerce') . $result['description']
                        )
                    ));
                }
            } else {
                wp_send_json_error(array(
                    'message' => esc_html(
                        __('Bot deactivation failed - ', 'algolplus-telegram-shop-for-woocommerce') . __(
                            'plugin database error',
                            'algolplus-telegram-shop-for-woocommerce'
                        )
                    )
                ));
            }
        });
        add_action('wp_ajax_telegram_shop_save_payment_tokens', function () {
            if (wp_verify_nonce(AdminPage::getFromSuperGlobal($_POST, $this->nonceParam), $this->nonceName) === false) {
                wp_send_json_error(
                    array('message' => esc_html__('Failed nonce verification', 'algolplus-telegram-shop-for-woocommerce'))
                );
            }
            $paymentTokens = AdminPage::getFromSuperGlobal($_POST,'payment_tokens', array());
            $paymentTokens = array_filter($paymentTokens, function($paymentToken) {
                if (empty($paymentToken['name']) || empty($paymentToken['token'])) {
                    return false;
                } else {
                    return true;
                }
            });
            Settings::savePaymentTokens($paymentTokens);
            ob_start();
            include ALGOL_TGSHOP_PLUGIN_VIEWS_PATH . 'modules/payment_token_table.php';
            $paymentTokensHtml = ob_get_contents();
            ob_end_clean();
            wp_send_json_success(
                array(
                    'message' => esc_html__(
                        'Payment tokens has been saved successfully',
                        'algolplus-telegram-shop-for-woocommerce'
                    ),
                    'paymentTokensHtml' => $paymentTokensHtml
                )
            );
        });
    }

    public function showAdminPage()
    {
        $tabs           = $this->tabs;
        $currentTabKey  = $this->detectCurrentTabKey();
        $security       = wp_create_nonce($this->nonceName);
        $security_param = $this->nonceParam;
        include ALGOL_TGSHOP_PLUGIN_VIEWS_PATH . 'admin_page.php';
    }

    public function renderCurrentTab()
    {
        $tabKey = $this->detectCurrentTabKey();

        if ($tabKey === 'bots') {
            $botData        = Settings::getBot();
            $botToken       = $botData['telegram_bot_token'] ?? '';
            $tokenValidated = $botData['token_validated'] ?? false;
            $shopActivated  = $botData['shop_activated'] ?? false;
            $shopUrl        = isset($botData['username']) ? 'https://t.me/' . $botData['username'] : '';
            $paymentTokens  = Settings::getPaymentTokens();
        } elseif ($tabKey === 'settings') {
            $settings = Settings::getSettings();
        }

        include ALGOL_TGSHOP_PLUGIN_VIEWS_PATH . 'tabs/' . $this->tabs[$tabKey]['filename'];
    }

    protected function detectCurrentTabKey()
    {
        $currentTabKey = null;

        // data isn't being change here, nonce verification is not needed
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if (isset($_REQUEST[self::TAB_REQUEST_KEY])) {
            // phpcs:ignore WordPress.Security.NonceVerification.Recommended
            $currentTabKey = self::getFromSuperGlobal($_REQUEST, self::TAB_REQUEST_KEY);
        }

        if ( ! isset($this->tabs[$currentTabKey])) {
            $currentTabKey = key($this->tabs);
        }

        return $currentTabKey;
    }

    public function isAdminPage()
    {
        // data isn't being change here, nonce verification is not needed
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        return isset($_GET['page']) && $_GET['page'] === self::SLUG;
    }

    public function enqueueScripts()
    {
        wp_enqueue_script(
            'algol-telegram-shop',
            ALGOL_TGSHOP_PLUGIN_URL . '/assets/js/telegram-shop.js',
            array(),
            '1.0.0',
            true
        );
        wp_enqueue_style('algol-telegram-shop', ALGOL_TGSHOP_PLUGIN_URL . '/assets/css/telegram-shop.css', array(), '1.0.0');
    }
}