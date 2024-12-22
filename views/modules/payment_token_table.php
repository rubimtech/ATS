<?php
/**
 * @var $paymentTokens array
 */
defined('ABSPATH') or exit;
?>

<p id="empty_payment_tokens_message" style="<?php
if ($paymentTokens) {
    echo 'display: none';
} ?>">
    <?php
    esc_html_e(
        "There's no payment tokens yet. Please, add the tokens to activate the payments in your Telegram shop",
        'algolplus-telegram-shop-for-woocommerce'
    ); ?>
</p>

<div class="payment-tokens-label">
    <p>
        <input type="hidden" value="payment_token" name="payment_tokens[0][name]" class="payment-token-name" type="text">
        <label>
            <span style="font-weight: bold;">Payment system token</span>
            <input value="<?php echo esc_attr($paymentTokens[0]['token'] ?? ''); ?>" name="payment_tokens[0][token]" class="payment-token" type="text">
        </label>

    </p>
</div>
<div id="payment_token_result"></div>
<div class="payment-tokens__buttons">
    <div class="button-spinner">
        <span class="spinner payment-token-spinner" style="float:none;"></span>
        <button type="submit" name="save-payment-tokens" class="save-payment-tokens button button-primary">
            <?php esc_html_e('Save payment tokens', 'algolplus-telegram-shop-for-woocommerce'); ?>
        </button>
    </div>
</div>
