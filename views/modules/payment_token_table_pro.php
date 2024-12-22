<?php
/**
 * @var $paymentTokens array
 */
defined('ABSPATH') or exit;
?>

<table class="payment-tokens <?php if ( ! $paymentTokens) {
    echo 'empty-payment-tokens';
} ?>">
    <tr>
        <th><?php
            esc_html_e('Payment system', 'algolplus-telegram-shop-for-woocommerce'); ?></th>
        <th><?php
            esc_html_e('Token', 'algolplus-telegram-shop-for-woocommerce'); ?></th>
        <th><?php
            esc_html_e('Action', 'algolplus-telegram-shop-for-woocommerce'); ?></th>
    </tr>
    <?php
    $index = 0;
    foreach ($paymentTokens as $paymentToken): ?>
        <tr>
            <td><input value="<?php
                echo esc_attr($paymentToken['name']); ?>" name="payment_tokens[<?php
                echo esc_attr($index); ?>][name]" class="payment-token-name" type="text"></td>
            <td><input value="<?php
                echo esc_attr($paymentToken['token']); ?>" name="payment_tokens[<?php
                echo esc_attr($index); ?>][token]" class="payment-token" type="text"></td>
            <td>
                <button type="button" class="delete-payment-token"><?php
                    esc_html_e('Delete', 'algolplus-telegram-shop-for-woocommerce'); ?></button>
            </td>
        </tr>
        <?php
        $index++;
    endforeach; ?>
    <tr class="new-payment-token" style='display: none;'>
        <td><input class="payment-token-name" type="text"></td>
        <td><input class="payment-token" type="text"></td>
        <td>
            <button type="button" class="delete-payment-token"><?php
                esc_html_e('Delete', 'algolplus-telegram-shop-for-woocommerce'); ?></button>
        </td>
    </tr>
</table>
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
<button type="button" id="add_payment_token" class="add-payment-token button button-secondary"><?php
    esc_html_e('Add payment token', 'algolplus-telegram-shop-for-woocommerce'); ?></button>
<button type="submit" name="save-payment-tokens" class="save-payment-tokens button button-primary"><?php
    esc_html_e('Save payment tokens', 'algolplus-telegram-shop-for-woocommerce'); ?></button>
<div id="payment_token_result"></div>
<span class="spinner payment-token-spinner" style="float:none;"></span>
