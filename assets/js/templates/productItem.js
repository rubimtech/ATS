export default function productItem({id, name, images, description, add_to_cart:addToCart, price_html:priceHtml, type, attributes}) {
    return `
        <div class="product-item js-pr-item" data-item-id="${id}" data-item-count="0" data-item-type="${type}">
            <div class="product-item-photo">
                <img src="${images[0]?.src ?? appData.placeHolder}" alt="${images[0]?.alt}">
            </div>
            <div class="product-item-main">
                <div class="product-item-label">
                    <h1 class="product-item-title">${name}</h1>
                    <span class="product-item-price">${priceHtml}</span>
                </div>
            
                <div class="product-item-descriptions">
                    ${description}
                </div>
                
                ${type === 'variable' ?
                `<div class="variations-wrapper">
                ${attributes.map(attribute => `
                    <div class="variations">
                    <label for="${attribute.taxonomy}">${attribute.name}</label>
                        <select id="${attribute.taxonomy ? attribute.taxonomy: attribute.name}" data-item-name="${attribute.name}" class="product-item-variations" 
                            name="attribute_${attribute.taxonomy ? attribute.taxonomy: attribute.name}" data-attribute_name="attribute_${attribute.taxonomy ? attribute.taxonomy: attribute.name}" data-show_option_none="yes">
                            <option value="">SELECT ${attribute.name.toUpperCase()}</option>
                            ${attribute.terms.map(term => `
                                <option value="${term.slug}" class="attached enabled">${term.name}</option>
                            `).join('')}
                        </select>
                    </div>`).join('')}
                </div>` : ''}
                <div class="product-item-buttons">
                <div class="product-item-success">"${name}" has been added to your cart.</div>
                <p class="product-item-notice" style="opacity: 0%">N\D</p>
                <div class="product-item-quantity">
                    <button class="btn-product js-pr-item-minus">–</button>
                    <input class="product-item-number" type="number" step="1" min="${addToCart.minimum}" max="${addToCart.maximum}" value="${addToCart.minimum}">
                    <button class="btn-product js-pr-item-plus">+</button>
                </div>
                <button class="button-item-label js-pr-item-incr-btn btn-item-product-active" data-default-text="Add to cart">
                    Add to cart
                </button>
            </div>
            </div>
        </div>`;
}
