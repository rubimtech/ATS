<?php
defined('ABSPATH') or exit;
?>
<!DOCTYPE html>
<html lang="en" styel="style="--tg-theme-accent-text-color: #168acd; --tg-color-scheme: light; --tg-theme-bg-color: #ffffff; --tg-theme-button-color: #40a7e3; --tg-theme-button-text-color: #ffffff; --tg-theme-destructive-text-color: #d14e4e; --tg-theme-header-bg-color: #ffffff; --tg-theme-hint-color: #999999; --tg-theme-link-color: #168acd; --tg-theme-secondary-bg-color: #f1f1f1; --tg-theme-section-bg-color: #ffffff; --tg-theme-section-header-text-color: #168acd; --tg-theme-section-separator-color: #e7e7e7; --tg-theme-subtitle-text-color: #999999; --tg-theme-text-color: #000000; --tg-viewport-height: 720px; --tg-viewport-stable-height: 720px;>
<head>
	<meta charset="utf-8">
	<title>telegram-page</title>
	<meta name="viewport"
	      content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"/>
	<meta name="format-detection" content="telephone=no"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<meta name="MobileOptimized" content="176"/>
	<meta name="HandheldFriendly" content="True"/>
	<meta name="robots" content="noindex, nofollow"/>

    <?php
    // we include scripts directly to avoid doing unnecessary wp_footer()
    // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript
    ?>
    <?php // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript ?>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <?php // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript ?>
    <script>
        window.Telegram.WebApp.expand();
        let appData = <?php echo wp_json_encode([
            'placeHolder' => wc_placeholder_img_src(),
            'ajaxurl' => admin_url('admin-ajax.php'),
            'payments' => $payments,
            'botName'  => $botName,
            'countries' => WC()->countries->get_countries(),
            'states' => WC()->countries->get_states(),
            'security' => $security,
        ]); ?>;
    </script>
    <?php // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript ?>
    <script type="module" src="<?php echo esc_attr(Helpers::asset('js/app.min.js')); ?>"></script>
    <?php // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet ?>
    <link rel="stylesheet" href="<?php echo esc_attr(Helpers::asset('css/main.css')); ?>"/>
</head>

<body>
    <div class="pages">
        <div class="list open">
            <?php if($settings['hide_product_search'] !== 'on'): ?>
                <div class="autocomplete">
                    <input type="search" id="autoComplete" placeholder="<?php esc_html_e("Search for product",'algolplus-telegram-shop-for-woocommerce');?>">
                </div>
            <?php endif; ?>

            <?php if($settings['hide_category_selector'] !== 'on'): ?>
                <div class="list-category">
                    <span class="list-category-label"><?php esc_html_e("Category",'algolplus-telegram-shop-for-woocommerce');?></span>
                    <span class="list-category-value js-category-value"><?php esc_html_e("Any products",'algolplus-telegram-shop-for-woocommerce');?></span>
                </div>
            <?php endif; ?>
            
            <div class="list-items list-items-columns<?php echo esc_attr($settings['product_columns']) ?>"></div>
        </div>

        <div class="cart">
            <div class="cart-header-info">
                <div><h1><?php esc_html_e("Cart",'algolplus-telegram-shop-for-woocommerce');?></div>
                <div class="cart-btn-clear-all js-pr-items-clear-btn"><?php esc_html_e("Clear Cart",'algolplus-telegram-shop-for-woocommerce');?></div>
            </div>

            <div class="cart-items"></div>
            
        </div>

        <div class="category">
            <h1><?php esc_html_e("Category",'algolplus-telegram-shop-for-woocommerce');?></h1>
            <div class="category-items"></div>
        </div>

        <div class="product"></div>
        <div class="checkout">
            <?php $customer = WC()->customer; ?>
            <h1>Checkout</h1>
            <h3>Details</h3>
            <form class="customer-details">
            </form>
            <h3>Shipping options</h3>
            <form class="shipping-details">
            </form>
            <div class="total-details"></div>

            <div class="payment-btns" ></div>
        </div>
        <div class="thankyou"></div>
    </div>

    <div class="test-btns" >
        <button id="test-tg-main-btn" style="display: none">tg</button>
    </div>

    <button id="test-tg-back-btn" style="display: none">back</button>
</body>
</html>