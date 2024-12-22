<?php

defined('ABSPATH') or exit;

require_once 'Settings.php';
require_once 'Validate.php';

class User
{
    const USER_SLUG = 'tgs_telegram_user_id';

    public function __construct()
    {
        $botData           = \Settings::getBots();
        $this->token       = $botData['telegram_bot_token'] ?? '';

        add_action('init', [$this, 'init' ], 1, 1 );
        add_action('rest_api_init', [$this, 'init' ]);
    }

    public function init() 
    {
        if(is_user_logged_in()) {
            add_filter( 'woocommerce_store_api_disable_nonce_check', '__return_true' );
            return;
        }
        
        $headers = getallheaders();
        $initData = $headers['Telegram-Init-Data'] ?? false;
        if(!$initData) {
            return;
        }

        if (empty($this->token)) {
            return;
        }

        if (!Validate::isSafe($this->token, $initData)) {
            return;
        }

        parse_str($initData, $initDataArray);
        $data = json_decode($initDataArray['user']);

        self::switchByData($data);
    }

    private static function get($data)
    {
        $data = (object)$data;
        $users = get_users([
            'meta_key' => self::USER_SLUG, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
            'meta_value' => $data->id, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
            'fields' => ['ID'],
            'number' => 1
        ]);

        $ids = wp_list_pluck($users, 'ID');
        if(!empty($ids[0])){
            return $ids[0];
        }
    
        return self::create($data);
    }

    private static function create($data)
    {
        $parse_url = wp_parse_url(get_bloginfo('url'));
        $email = $data->id . '@' . $parse_url['host'];
        $userId = wp_create_user( $data->id, wp_generate_password(), $email );
    
        $userData = [
            'ID'           => $userId,
            'display_name' => join(' ', array_filter([$data->first_name, $data->last_name])),
            'first_name'   => $data->first_name,
            'last_name'    => $data->last_name,
        ];
        wp_update_user($userData);
    
        update_user_meta($userId, self::USER_SLUG, $data->id);
    
        return $userId;
    }
    
    public static function switchByData($data) {
        $userId = self::get($data);
        self::switch($userId);
    }

    public static function switch($userId) {
        // known user?
        if ( $userId AND ( $user = get_userdata( $userId ) ) ) {
            wp_set_auth_cookie( $userId );
            wp_set_current_user( $userId, $user->user_login );
            wc_load_cart();
            do_action( 'wp_login', $user->user_login, $user );

            add_filter( 'woocommerce_store_api_disable_nonce_check', '__return_true' );

            return true;
        } else {
            // do not put before wp_set_auth_cookie() because of many 'Set-Cookie' which causes Nginx error 502 Bad Gateway
            wp_clear_auth_cookie();
        }

        return false;
    }
}