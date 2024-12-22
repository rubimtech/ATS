<?php

defined('ABSPATH') or exit;
require_once 'Settings.php';
class Bot
{
    public function __construct($data)
    {
        $this->token = $data['telegram_bot_token'] ?? false;
        $this->shopActivated = $data['shop_activated'] ?? false;
        $this->tokenValidated = $data['token_validated'] ?? false;
        $this->name = $data['username'] ?? '';
        $this->secretToken = $data['secret_token'] ?? '';
        $this->payments = $data['payment_tokens'] ?? [];
    }

    public function getName() {
        return $this->name;
    }

    public function isActive() {
        return $this->tokenValidated && $this->shopActivated;
    }

    public function getToken() {
        return $this->token;
    }

    public function getSecretToken() {
        return $this->secretToken;
    }

    public function getPayments() {
        return $this->payments;
    }

    public function getPaymentsFlat() {
        return array_column($this->payments, 'name');
    }

    public function getPaymentTokenByName($name) {
        foreach ($this->payments as $payment) {
            if($payment['name'] == $name) {
                return $payment['token'];
            }
        }
        return false;
    }

    public function getMiniAppUrl() {
        return home_url('telegram-page-'.$this->getName());
    }

}