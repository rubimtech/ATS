import cartItemTemplate from "./templates/cartItem.js";
import StoreApi from "./StoreApi.js";
import Page from "./Page.js";
import { imgAspectRatio } from "./functions";
import doneTemplate from "./templates/icons/done";
import loadingTemplate from "./templates/icons/loading";
import {wc_price} from "./functions";

import currencies from "./currencies.json";
export default class Cart extends Page
{
    constructor() {
        super(...arguments);
        this.cart = null;

        this.elItems = document.querySelector('.cart-items');

        StoreApi.getCart(this.updateCart.bind(this));

        document.addEventListener('click', (e) => {
            if(e.target.closest('.js-item-incr-btn')) {
                e.preventDefault();
                const item = e.target.closest('.js-item');
                if(item.classList.contains('cart-item')) {
                    const key = item.dataset.itemKey;
                    const cartItem = this.cart.items.find((item) => {
                        return item.key == key;
                    });
                    const quantity = cartItem.quantity+1;
                    StoreApi.updateItem(key, quantity, this.updateCart.bind(this));

                } else if(item.classList.contains('list-item')) {
                    const id = item.dataset.itemId;
                    StoreApi.addItem(id, 1, this.updateCart.bind(this));
                    item.querySelector('.list-item-incr-button').innerHTML = loadingTemplate();
                }
            } else if(e.target.closest('.js-item-decr-btn')) {
                e.preventDefault();
                const item = e.target.closest('.js-item');
                let cartItem = null;
                if(item.classList.contains('cart-item')) {
                    const key = item.dataset.itemKey;
                    cartItem = this.cart.items.find((item) => {
                        return item.key == key;
                    });
                } else if(item.classList.contains('list-item')) {
                    const id = item.dataset.itemId;

                    cartItem = this.cart.items.find((item) => {
                        return item.id == id;
                    });
                }

                if(!cartItem) {
                    console.log('Error: No found cart item');
                    return;
                }

                const key = cartItem.key;
                const quantity = cartItem.quantity-1;

                if(quantity > 0) {
                    StoreApi.updateItem(key, quantity, this.updateCart.bind(this));
                } else if(quantity == 0) {
                    StoreApi.removeItem(key, this.updateCart.bind(this));
                }
            } if (e.target.closest('.js-pr-item-incr-btn')) {
                e.preventDefault();
                const item = e.target.closest('.js-pr-item');
                if(item.classList.contains('product-item')) {
                    const id = item.dataset.itemId;
                    const type = item.dataset.itemType;
                    let quantity = parseInt(item.querySelector('.product-item-number').value);

                    let variations = [];
                    const selects = item.querySelectorAll('.product-item-variations');
                    selects.forEach(select => {
                        const attributeName = select.name.replace('attribute_', '');
                        const attributeValue = select.value;
                        if (attributeValue) {
                            variations.push({
                                attribute: attributeName,
                                value: attributeValue
                            });
                        }
                    });

                    if (type === 'variable' && variations.length > 0) {
                        StoreApi.addVariableItem(id, quantity, variations, this.updateCart.bind(this))
                    } else {
                        StoreApi.addItem(id, quantity, this.updateCart.bind(this));
                    }

                    const addToCartButton = item.querySelector('.js-pr-item-incr-btn');
                    if (addToCartButton) {
                        addToCartButton.innerHTML = loadingTemplate();
                    }

                    item.querySelector(".product-item-success").style.opacity = '100%';

                    setTimeout(function() {
                        item.querySelector(".product-item-success").style.opacity = '0%';
                    }, 3000);
                }
            } else if (e.target.closest('.js-pr-item-trash-btn')) {
                const item = e.target.closest('.js-item');
                const key = item.dataset.itemKey;
                const cartItem = this.cart.items.find((item) => {
                    return item.key == key;
                });
                StoreApi.removeItem(key, this.updateCart.bind(this));
            } else if(e.target.closest('.js-pr-items-clear-btn')) {
                const itemsWithCount = document.querySelectorAll('.list-item[data-item-count]:not([data-item-count="0"])');
                itemsWithCount.forEach((listItem) => {
                    listItem.setAttribute('data-item-count', '0');
                    const counterElement = listItem.querySelector('.list-item-counter.js-item-counter');
                    const addToCartButton = listItem.querySelector('.js-item-incr-btn');
                    if (addToCartButton) {
                        addToCartButton.innerHTML = addToCartButton.dataset.defaultText;
                    }
                    if (counterElement) {
                        counterElement.textContent = '0';
                    }
                });

                StoreApi.removeAllCartItems(this.updateCart.bind(this));
            }
        });
    }

    updateCart(data = null) {
        if(data?.code) {
            console.log(`Error: ${data.message}`);
            this.cart = data.data.cart;
        } else if(data != null) {
            this.cart = data;
        }

        if(this.cart?.items) {
            document.querySelectorAll('.js-item').forEach((item) => {
                let quantity = 0;
                const cartItem = this.cart.items.find(({id}) => id == item.dataset.itemId);
                if(cartItem) {
                    quantity = cartItem.quantity;
                }

                item.dataset.itemCount = quantity;
                item.querySelector('.js-item-counter').innerHTML = quantity;
                const listItemButton = item.querySelector('.list-item-incr-button');
                if (listItemButton) {
                    if (quantity > 0) {
                        listItemButton.innerHTML = doneTemplate();
                    } else {
                        listItemButton.innerHTML = listItemButton.dataset.defaultText;
                    }
                }
            });

            const productItem = document.querySelector('.product-item')

            if (productItem) {
                const productButton = productItem.querySelector('.js-pr-item-incr-btn');
                const productQuantity = this.cart.items.find(({id}) => id == productItem.dataset.itemId)?.quantity;

                if (productQuantity > 0) {
                    productButton.innerHTML = doneTemplate();
                } else {
                    productButton.innerHTML = productButton.dataset.defaultText;
                }
            }
        }

        if (!this.cart?.items || this.cart.items.length === 0) {
            document.querySelector('.cart-items').innerHTML = `<div class="empty-cart">The cart is empty</div>`;
            document.querySelector('.js-pr-items-clear-btn').style.display = 'none';
            this.app.buttons.updateButtons();
        } else {
            document.querySelector('.js-pr-items-clear-btn').style.display = 'block';
            this.app.buttons.updateButtons(false);

            this.elItems.innerHTML = this.cart.items.map(cartItemTemplate).join('');

            if(this.cart?.totals) {
                let minAmount = currencies[this.cart.totals.currency_code];
                if(minAmount && this.cart.totals.total_price < minAmount) {
                    this.app.buttons.updateButtons(false, `Min order - ${wc_price(minAmount, {...this.cart.totals, html: false})}`);
                }
            }

            this.elItems.childNodes.forEach(item => imgAspectRatio(item.querySelector('.cart-item-photo > img')))
            if(appData.payments.length > 1) {
                document.querySelector('.payment-btns').innerHTML = appData.payments.map((name) => {
                    return `<button data-payment-name="${name}">Pay via ${name}</button>`;
                }).join('');
            }
        }

        this.app.checkout.update(this.cart);
    }

    show() {
        StoreApi.getCart(this.updateCart.bind(this));
        return true;
    }
}