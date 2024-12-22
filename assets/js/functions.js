export function imgAspectRatio(imgElem) {
    imgElem.onload = () => {
        if (imgElem.height >= imgElem.width) {
            imgElem.style.width = '100%';
        } else {
            imgElem.style.height = '100%';
        }
    }
}

export function wc_price(price, args) {
    price = price / Math.pow(10, args.currency_minor_unit);
    price = price.toFixed(2);

    var default_args = {
        decimal_sep: args.currency_decimal_separator,
        currency_position: 'right',
        currency_symbol: args.currency_symbol,
        trim_zeros: args.currency_thousand_separator,
        num_decimals: args.currency_minor_unit,
        html: args.html == undefined ? true : args.html
    };
    
    if (default_args.num_decimals > 0) {
        var wc_price_length = parseInt(price).toString().length;
        var wc_int_end_sep = wc_price_length + default_args.num_decimals;
        price = price.toString().substr(0, wc_int_end_sep + 1);
    } else {
        price = parseInt(price);
    }
    price = price.toString().replace('.', default_args.decimal_sep);
    var formatted_price = price;
    var formatted_symbol = default_args.html ? '<span class="woocommerce-Price-currencySymbol"> ' + default_args.currency_symbol + '</span>' : default_args.currency_symbol;


    formatted_price = formatted_price + formatted_symbol;

    formatted_price = default_args.html ? '<span class="woocommerce-Price-amount amount">' + formatted_price + '</span>' : formatted_price;
    return formatted_price;
}