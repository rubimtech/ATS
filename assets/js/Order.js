import Page from "./Page.js";
import StoreApi from "./StoreApi.js";

export default class Order extends Page
{
    constructor() {
        super(...arguments);
        this.invoices = {};
        document.addEventListener('click', (e) => {
            let item;
            if(item = e.target.closest('.payment-btns button')) {
                let paymentName = item.dataset.paymentName;
                this.createInvoice(paymentName);
            }
        });
    }

    async createInvoice(paymentName) {
        var formData = new FormData();
        formData.append( 'action', 'telegram_shop_create_invoice_link' );
        formData.append( 'botName', appData.botName );
        formData.append( 'paymentName', paymentName );
        formData.append( appData.security.key, appData.security.value );
        let response = await fetch(appData.ajaxurl, {
            method: 'POST',
            headers: {
                'Telegram-Init-Data': window.Telegram.WebApp.initData,
            },
            body: formData
        });
        let data = await response.json();

        if(!data.success) {
            let hasError = true;
            let customError = data.data.message == 'Bad Request: CURRENCY_TOTAL_AMOUNT_INVALID' ? 'Order amount is too small' : data.data.message;
            this.app.buttons.updateCheckoutButton(hasError, customError);
            return false;
        }

        // Only for debug in browser
        if(this.app.tg.platform == 'unknown') {
            setTimeout(() => {
                const slug = '1312321';
                this.invoices[slug] = data.data;
                this.app.buttons.tg.call('invoiceClosed', {status: 'paid', slug});
            }, 200);
        } else {
            this.app.tg.openInvoice(data.data.url, (e) => {
                this.invoices[e.slug] = data.data;
            });
        }

        return true;
    }

    async show() {
        if(appData.payments.length == 1) {
            return await this.createInvoice(appData.payments[0]);
        }
        return false;
    }

    getDataByslug(slug) {
        console.log('getDataByslug', slug, this.invoices[slug])
        return this.invoices[slug] || false;
    }
}