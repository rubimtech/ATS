function optionTemplate(obj, select) {
    let out = '';
    for(let key in obj) {
        let value = obj[key];
        out += `<option value="${key}" ${select == key ? 'selected' : ''} >
                ${value}
            </option>`;
    }
    return out;
}

export function stateTemplate(country, state, needShipping) {
    let states = appData.states[country] || false;
    return `${states ? 
        `<select class="js-state" name="state">
            ${optionTemplate(states, state)}
        </select>` 
        : 
        `<input class="js-state" name="state" placeholder="State" value="${state}" ${needShipping ? 'required' : ''}>`
    }`
}

export function customerTemplate(data) {
    if (!data || !data.shipping_address) {
        return '';
    }
    return `
    <input name="first_name" type="text" placeholder="First name" value="${data.shipping_address.first_name}" required>
    <input name="last_name" type="text" placeholder="Last name" value="${data.shipping_address.last_name}" required>
    <!-- <input name="company" placeholder="Company name (optional)"> -->

    <select class="js-country" name="country" ${data.needs_shipping ? 'required' : ''}>
        ${optionTemplate(appData.countries, data.shipping_address.country)}
    </select> 

    <input name="address_1" placeholder="Street address" value="${data.shipping_address.address_1}" ${data.needs_shipping ? 'required' : ''}>
    <!-- <input name="address_2" placeholder="Street address 2"> -->

    <input name="city" placeholder="Town / City" value="${data.shipping_address.city}" ${data.needs_shipping ? 'required' : ''}>

    ${stateTemplate(data.shipping_address.country, data.shipping_address.state, data.needs_shipping)}
    
    <input name="postcode" placeholder="ZIP Code" value="${data.shipping_address.postcode}" ${data.needs_shipping ? 'required' : ''}>
    <input name="phone" placeholder="Phone" value="${data.billing_address.phone}">
    <input name="email" placeholder="Email address" value="${data.billing_address.email}">`;
}