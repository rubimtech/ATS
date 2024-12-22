import Page from "./Page.js";
import StoreApi from "./StoreApi.js";

import {wc_price} from "./functions";

const ThankyouItemTemplate = ({key, name, images, quantity, prices, totals}) => {
    return `<tr>
        <td>${name} х ${quantity}</td>
        <td>${wc_price(totals.line_subtotal, totals)}</td>
    </tr>`;
}

const ThankyouTemplate = ({id, status, items, totals, shipping_address, billing_address}) => {
    return `
    <h1>Order received</h1>
    <div class="order-details">
        <span>Thank you. Your order has been received.</span>
        <table>
            <tr><td style="width: 100%;">Order number</td><td>${id}</td></tr>
            <tr><td>Status</td><td>${status}</td></tr>
            

            <tr><td>Product</td><td>Total</td></tr>
            ${items.map(ThankyouItemTemplate).join('')}
            <tr><td>Subtotal</td><td>${wc_price(totals.subtotal, totals)}</td></tr>
            <tr><td>Shipping</td><td>${wc_price(totals.total_shipping, totals)}</td></tr>
            <tr><td>Total</td><td>${wc_price(totals.total_price, totals)}</td></tr>
        </table>
        <h2>Billing address</h2>
        <address>${Object.values(billing_address).filter(Boolean).join('<br>')}</address>
        <h2>Shipping address</h2>
        <address>${Object.values(shipping_address).filter(Boolean).join('<br>')}</address>
    </div>
    `;
}

export default class Thankyou extends Page
{
    constructor() {
        super(...arguments);

    }

    show(data) {
        StoreApi.getOrder(data.orderId, data.orderKey, (response) => {
            document.querySelector('.thankyou').innerHTML = ThankyouTemplate(response);
        });

        // Update cart page and counts after checkout
        this.app.cart.show();
        return true;
    }
}