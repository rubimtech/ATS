<?php
/**
 * @var $botToken string
 * @var $tokenValidated bool
 * @var $shopActivated bool
 * @var $shopUrl string
 * @var $paymentTokens array
 */
defined('ABSPATH') or exit;
?>

<details style="margin-top: 10px; margin-bottom: 10px">
    <summary class="instruction-summary"><?php
        esc_html_e('How to get the bot token', 'algolplus-telegram-shop-for-woocommerce'); ?></summary>
    <p>
    <span style="color: red">
        <?php
        esc_html_e(
            "We recommend to follow the steps below using the mobile phone",
            'algolplus-telegram-shop-for-woocommerce'
        ); ?>
    </span>
        <?php
        esc_html_e(", otherwise install", 'algolplus-telegram-shop-for-woocommerce');
        ?>
        <a href="https://desktop.telegram.org/" target=_blank><?php
            esc_html_e('Telegram Desktop', 'algolplus-telegram-shop-for-woocommerce'); ?></a>
    </p>
    <ul class="launch-instruction">
        <li>
            <?php
            esc_html_e('Launch the ', 'algolplus-telegram-shop-for-woocommerce'); ?>
            <a href="https://t.me/BotFather" target=_blank><?php
                esc_html_e('BotFather', 'algolplus-telegram-shop-for-woocommerce'); ?></a>
        </li>
        <li>
            <?php
            esc_html_e(
                'Type the command /newbot and reply on the bot\'s questions until you get the token.',
                'algolplus-telegram-shop-for-woocommerce'
            );
            ?>
            <a href="https://core.telegram.org/bots/features#creating-a-new-bot" target=_blank><?php
                esc_html_e('Detailed guide', 'algolplus-telegram-shop-for-woocommerce'); ?></a>
        </li>
        <li>
            <?php
            esc_html_e(
                'Copy the token from the BotFather bot, paste it into the textbox below and click the 
        "Save token" button'
            , 'algolplus-telegram-shop-for-woocommerce'); ?>
        </li>
    </ul>
</details>
<table class="bot_token_table fixed-max-width">
    <tbody>
    <tr class="input-shop-row">
        <th scope="row">
            <?php
                esc_html_e('Telegram Bot Token', 'algolplus-telegram-shop-for-woocommerce'); 
            ?>
        </th>
        <td>
            <input
                value="<?php echo esc_attr($botToken);?>"
                name="telegram_bot_token" 
                id="telegram_bot_token" 
                type="text" 
                placeholder="<?php esc_html_e('Paste the token here', 'algolplus-telegram-shop-for-woocommerce');?>..."
            >
        </td>
    </tr>
    <tr class="input-shop-row">
        <th></th>
        <td>
            <div id="telegram_token_result"></div>
        </td>
    </tr>
    <tr class="save-shop-row">
        <th scope="row"></th>
        <td>
            <button type="submit" name="activate-shop" class="button button-primary activate-shop-button" style="<?php echo esc_attr($tokenValidated && ! $shopActivated ? '' : 'display:none;'); ?>">
                <?php esc_html_e('Activate shop', 'algolplus-telegram-shop-for-woocommerce'); ?>
            </button>
            <div class="button-spinner">
                <span class="spinner telegram-token-spinner" style="float:none;"></span>
                <button type="submit" name="save-token" class="button button-secondary">
                    <?php esc_html_e('Save token', 'algolplus-telegram-shop-for-woocommerce'); ?>
                </button>
            </div>
        </td>
    </tr>
    <tr class="shop-actions-row" style="<?php
    echo esc_attr($tokenValidated && $shopActivated ? '' : 'display:none;'); ?>">
        <th scope="row"></th>
        <td>
            <button type="button" id="open_shop_btn" class="button button-secondary" data-url="<?php
            echo esc_attr($shopUrl); ?>"><?php
                esc_html_e('Open shop', 'algolplus-telegram-shop-for-woocommerce'); ?></button>
            <button type="button" id="copy_shop_url_btn" class="button button-secondary" data-url="<?php
            echo esc_attr($shopUrl); ?>"><?php
                esc_html_e('Copy shop url', 'algolplus-telegram-shop-for-woocommerce'); ?></button>
            <button type="submit" name="deactivate-shop" class="button button-secondary"><?php
                esc_html_e('Deactivate shop', 'algolplus-telegram-shop-for-woocommerce'); ?></button>
        </td>
    </tr>
    </tbody>
</table>
<hr class="instruction-break-line">
<p>
    <span style="color: red">
        <?php
        esc_html_e(
            "Please, insert the payment tokens below. ",
            'algolplus-telegram-shop-for-woocommerce'
        ); ?>
    </span>
<details>
    <summary class="instruction-summary">
        <?php
        esc_html_e("How to get the payment token", 'algolplus-telegram-shop-for-woocommerce');
        ?>
    </summary>
    <ul class="launch-instruction">
        <li>
            <?php
            esc_html_e('Launch the ', 'algolplus-telegram-shop-for-woocommerce'); ?>
            <a href="https://t.me/BotFather" target=_blank><?php
                esc_html_e('BotFather', 'algolplus-telegram-shop-for-woocommerce'); ?></a>
        </li>
        <li>
            <?php
            esc_html_e(
                'Enter the /mybots command and select your store bot',
                'algolplus-telegram-shop-for-woocommerce'
            );
            ?>
        </li>
        <li>
            <?php
            esc_html_e(
                'Click the "Payments" button and select the bank',
                'algolplus-telegram-shop-for-woocommerce'
            ); ?>
        </li>
        <li>
            <?php
            esc_html_e(
                'Then follow the bank\'s instructions and get a payment token',
                'algolplus-telegram-shop-for-woocommerce'
            ); ?>
        </li>
        <li>
            <?php
            esc_html_e(
                'Copy the payment token, paste it into the token field below',
                'algolplus-telegram-shop-for-woocommerce'
            ); ?>
        </li>
        <li>
            <?php
            esc_html_e(
                'Click the "Save payment tokens" button',
                'algolplus-telegram-shop-for-woocommerce'
            ); ?>
        </li>
    </ul>
</details>
</p>
<div id="payment_tokens_container" class="payment_tokens_container fixed-max-width">
    <?php
    include ALGOL_TGSHOP_PLUGIN_VIEWS_PATH . 'modules/payment_token_table.php'; ?>
</div>
