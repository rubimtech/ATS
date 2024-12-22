<?php

defined('ABSPATH') or exit;

class Settings
{
    const SETTINGS_SLUG = 'algol_tgshop_settings';
    const BOTS_SLUG = 'algol_tgshop_bots';
    const PAYMENT_TOKENS_SLUG = 'payment_tokens';
    const DEFAULT = array();

    public static function getSettings()
    {
        return array_merge([
            'hide_product_search' => 'off',
            'hide_category_selector' => 'off',
            'product_columns' => 2,
        ], get_option(self::SETTINGS_SLUG, []));
    }

    public static function saveSettings($settings)
    {
        update_option(self::SETTINGS_SLUG, $settings);
    }

    public static function getBots()
    {
        return get_option(self::BOTS_SLUG, []);
    }

    public static function saveBots($bots)
    {
        update_option(self::BOTS_SLUG, $bots);
    }

    public static function getPaymentTokens($id=0)
    {
        $bot = self::getBot($id);

        return $bot[self::PAYMENT_TOKENS_SLUG] ?? [];
    }

    public static function savePaymentTokens($paymentTokens, $id=0)
    {
        $bot = self::getBot($id);
        $bot[self::PAYMENT_TOKENS_SLUG] = $paymentTokens;
        self::saveBot($bot, $id);
    }

    public static function getBot($id=0)
    {
        return self::getBots()[$id] ?? [];
    }

    public static function saveBot($bot, $id=0)
    {
        $bots = self::getBots();
        $bots[$id] = $bot;
        self::saveBots($bots);
    }

    public static function getBotByUserName($username)
    {
        foreach(self::getBots() as $bot) {
            if(($bot['username'] ?? false) == $username) {
                return $bot;
            }
        }
        return false;
    }

    public static function getBotBySecretToken($token)
    {
        foreach(self::getBots() as $bot) {
            if(($bot['secret_token'] ?? false) == $token) {
                return $bot;
            }
        }
        return false;
    }

}