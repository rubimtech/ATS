<?php
/**
 * @var $settings array
 */
defined('ABSPATH') or exit;
?>
<input type="hidden" name="action" value="telegram_shop_save_settings">

<section class="tgshop_settings_table">
    <h3>
        <?php esc_html_e('Hide product search', 'algolplus-telegram-shop-for-woocommerce'); ?>
    </h3>
    <div>
        <input type="hidden" value="off" name="hide_product_search">
        <input <?php
        checked($settings['hide_product_search'], 'on') ?> value="on"
                                                                name="hide_product_search"
                                                                id="hide_product_search" type="checkbox">
    </div>

    <h3>
        <?php esc_html_e('Hide category selector', 'algolplus-telegram-shop-for-woocommerce'); ?>
    </h3>
    <div>
        <input type="hidden" value="off" name="hide_category_selector">
        <input <?php
        checked($settings['hide_category_selector'], 'on') ?> value="on"
                                                                name="hide_category_selector"
                                                                id="hide_category_selector" type="checkbox">
    </div>

    <h3>
        <?php esc_html_e('Show product columns', 'algolplus-telegram-shop-for-woocommerce'); ?>
    </h3>
    <div>
        <select name="product_columns">
            <?php for($i=1; $i<=5; $i++) {?>
                <option value="<?php echo esc_attr($i) ?>" <?php selected( $settings['product_columns'], $i ); ?>><?php echo esc_attr($i) ?></option>
            <?php } ?>
        </select>
    </div>

</section>
<button type="submit" class="button button-primary" name="save-settings">
    <?php esc_html_e(
            'SAVE SETTINGS',
            'algolplus-telegram-shop-for-woocommerce'
    )?>
</button>
