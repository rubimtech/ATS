=== Algolplus Telegram Shop for WooCommerce ===
Contributors: algolplus
Donate link: 
Tags: telegram shop,telegram bot,woocommerce
Requires PHP: 7.0
Requires at least: 6.0
Tested up to: 6.7
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Fully functional shop in Telegram, based on your WooCommerce website

== Description ==
The plugin runs  mini-apps(not bot!).
Please try [this demo](https://t.me/mypricing_bot), you should use [Stripe test cards](https://docs.stripe.com/testing#cards) to place order.

== External services ==
This plugin connects to an [Telegram Bot API](https://core.telegram.org/bots/api) to add button to telegram bot, start mini app inside this bot.
It sends the user's details to API only when customer go to Checkout page and generate orders/invoices using  [Bot Payments API](https://core.telegram.org/bots/payments).
This service is provided by "Telegram Messenger Inc.": [terms of use](https://telegram.org/tos), [privacy policy](https://telegram.org/privacy).

== Frequently Asked Questions ==
= How to start using the plugin  =
We put detailed guide at plugin's settings, but in short
1. You should create bot using  [BotFather](https://t.me/BotFather) and put bot token in >WooCommerce>Telegram Shop
2. To accept  payments - you should generate payment system token and put this token in >WooCommerce>Telegram Shop too
3. Finally, press the button "Activate shop"

== Screenshots ==
1. Default shop view
2. Product page
3. Cart
4. Checkout
5. Bot setup
6. Settings for layout


== Changelog ==
1.0.0 inital version