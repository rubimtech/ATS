import {wc_price} from "../functions";

export default function shipping(data) {
    if(!data || !data?.shipping_rates[0]?.shipping_rates.length) {
        return `No shipping options available`;
    }
    return data.shipping_rates[0].shipping_rates.map((rate) => {
        const {rate_id, selected, name, price} = rate;
        return `<div class="shipping-option">
        <input type="radio" id="label_for_${rate_id}" name="rate_id" value="${rate_id}" ${ selected ? 'checked' : ''} />
        <label for="label_for_${rate_id}">${name} ${wc_price(price, rate)}</label>
    </div>`
    }).join('')
}