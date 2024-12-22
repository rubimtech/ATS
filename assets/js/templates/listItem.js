export default function listItem({id, name, images, add_to_cart:addToCart, price_html:priceHtml, type}) {
    let listItemButton;

    switch (type) {
        case 'simple':
            listItemButton =
                `<button class="list-item-incr-button js-item-incr-btn" data-default-text="${addToCart.text}">
                    ${addToCart.text}
                </button>`;
            break;
        case 'external':
            listItemButton =
                `<a class="external-item-btn"  href="${addToCart.url}" target="_blank" rel="noopener noreferrer">
                    Link
                </a>`;
            break;
        default:
            listItemButton =
                `<button class="list-item-incr-button js-item-sel-opt" data-default-text="${addToCart.text}">
                    ${addToCart.text}
                </button>`;
            break;
    }

    return `<div class="list-item js-item" data-item-id="${id}" data-item-count="0">
        <div class="list-item-counter js-item-counter">0</div>
        <div class="list-item-photo">
            <img src="${images[0]?.src ?? appData.placeHolder}" alt="${images[0]?.alt}">
        </div>
        <div class="list-item-label">
            <p class="list-item-title">${name}</p>
            ${priceHtml ? `<p class="list-item-price">${priceHtml}</p>` : ''}
        </div>
        <div class="list-item-buttons">
            <!---<button class="list-item-decr-button js-item-decr-btn">
				<span class="button-item-label">remove</span>
			</button>--->
			${listItemButton}
        </div>
    </div>`;
}