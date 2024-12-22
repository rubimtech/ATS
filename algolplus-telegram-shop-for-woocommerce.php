<?php
/**
 * Plugin Name: Algolplus Telegram Shop for WooCommerce
 * Plugin URI:
 * Description: Start selling in Telegram in few clicks
 * Version: 1.0.0
 * Author: AlgolPlus
 * Author URI: https://algolplus.com/
 * WC requires at least: 9.0
 * WC tested up to: 9.4
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Text Domain: algolplus-telegram-shop-for-woocommerce
 */

if ( ! defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

require_once 'includes/AdminPage.php';
require_once 'includes/Settings.php';
require_once 'includes/Webhook.php';
require_once 'includes/User.php';
require_once 'includes/Shop.php';

define('ALGOL_TGSHOP_PLUGIN_FILE', basename(__FILE__));
define('ALGOL_TGSHOP_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('ALGOL_TGSHOP_PLUGIN_VIEWS_PATH', ALGOL_TGSHOP_PLUGIN_PATH . '/views/');
define('ALGOL_TGSHOP_PLUGIN_URL', plugins_url('', __FILE__));

$adminPage = new AdminPage();
$adminPage->registerPage();

if ($adminPage->isAdminPage()) {
    add_action('admin_enqueue_scripts', array($adminPage, 'enqueueScripts'));
}

add_action( 'before_woocommerce_init', function() {
	if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', ALGOL_TGSHOP_PLUGIN_PATH . ALGOL_TGSHOP_PLUGIN_FILE, true);
	}
} );

new User();
new Webhook();
new Shop();