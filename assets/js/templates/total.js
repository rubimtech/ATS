import {wc_price} from "../functions";

export default function total(data) {
    if (!data || !data?.totals || !data?.shipping_rates || !data?.shipping_address) {
        return '';
    }
    let {totals, shipping_rates, shipping_address} = data;
    const shippingOption = shipping_rates[0]?.shipping_rates.find((rate) => rate.selected)
    return `
    <hr>
    <div>
        <h4>
            Subtotal
        </h4>
        <p>
            ${wc_price(totals.total_items, totals)}
        </p>
    </div>
    ${shipping_rates[0]?.shipping_rates.length > 0 ? `
        <p>
            Shipping to ${[shipping_address.postcode, shipping_address.city, shipping_address.state, shipping_address.country].filter(Boolean).join(', ')}
        </p>
    ` : ''}
    ${shipping_rates[0]?.shipping_rates.length > 0 ? `
    <div>
        <h4>
            Shipping
            <br>
            <span>${shippingOption.name}</span>
        </h4>
        <p>
            ${wc_price(shippingOption.price, shippingOption)}
        </p>
        </div>
    ` : ''}
    ${totals.tax_lines.map(({name, price}) => {
        return `
            <div>
                <h4>
                    ${name}
                </h4>
                <p>
                    ${wc_price(price, totals)}
                </p>
            </div>
        `
        }
    ).join('')}
    <hr>
    <div class="total-details-total">
        <h3>
            Total
        </h3>
        <p>
            ${wc_price(totals.total_price, totals)}
        </p>
    </div>
    `;
}