import Page from "./Page.js";
import productItem from "./templates/productItem";
import StoreApi from "./StoreApi";
import {imgAspectRatio, wc_price} from "./functions";
export default class Product extends Page
{
    constructor() {
        super(...arguments);

        document.addEventListener('click', e => {
            if(e.target.closest('.js-item img') || e.target.closest('.js-item-sel-opt')) {
                const id = +e.target.closest('.js-item').dataset.itemId;
                this.app.show('product', {id});
            }
        });
    }

    show({id}) {
        if (this.app.list.products[id]) {
            let variations =  this.app.list.products[id].variations;
            const productHTML = productItem(this.app.list.products[id]);
            document.querySelector('.product').innerHTML = productHTML;

            if(this.app.list.products[id].type !== 'simple'){
                const selects = document.querySelectorAll('.product-item-variations');
                const addToCartButton = document.querySelector('.js-pr-item-incr-btn');
                const priceElem = document.querySelector('.product-item-price');

                async function changePriceBySelects(possibleVariations) {
                    priceElem.innerHTML = `<div class="product-item-price-loading">`
                    const variantProducts = await StoreApi.products({
                        type: 'variation',
                        parent: id,
                        include: possibleVariations.map(variant => variant.id).join(',')
                    });

                    const prices = variantProducts.map(variant => {
                        return parseFloat(variant.prices.sale_price ?? variant.prices.price);
                    })

                    const args = variantProducts[0].prices;
                    const maxPrice = Math.max.apply(Math, prices)
                    const minPrice = Math.min.apply(Math, prices)

                    priceElem.innerHTML = wc_price(minPrice, args) + (minPrice !== maxPrice ? ` - ` + wc_price(maxPrice, args) : '');
                }

                function checkSelects() {
                    let selectedAttributes = {};

                    selects.forEach(select => {
                        if (select.value !== '') {
                            selectedAttributes[select.dataset.itemName] = select.value;
                        }
                    });

                    selects.forEach(select => {
                        const options = select.querySelectorAll('option');
                        options.forEach(option => {
                            option.disabled = false;
                        });

                        const currentAttributeName = select.dataset.itemName;

                        const possibleVariations = variations.filter(variation => {
                            return Object.keys(selectedAttributes).every(key => {
                                return variation.attributes.some(attr => {
                                    return attr.name === key &&
                                        (attr.value === selectedAttributes[key] || attr.value === null);
                                });
                            });
                        });

                        changePriceBySelects(possibleVariations);

                        options.forEach(option => {
                            if (option.value !== '') {
                                const isOptionAvailable = possibleVariations.some(variation =>
                                    variation.attributes.some(attr =>
                                        attr.name === currentAttributeName &&
                                        (attr.value === option.value || attr.value === null)
                                    )
                                );
                                if (!isOptionAvailable) {
                                    option.disabled = true;
                                }
                            }
                        });
                    });

                    let allSelected = true;
                    selects.forEach(select => {
                        if (select.value === '') {
                            allSelected = false;
                        }
                    });

                    if (!allSelected) {
                        addToCartButton.disabled = true;
                        addToCartButton.classList.remove('btn-item-product-active');
                        addToCartButton.classList.add('btn-item-product-inactive');
                    } else {
                        addToCartButton.disabled = false;
                        addToCartButton.classList.remove('btn-item-product-inactive');
                        addToCartButton.classList.add('btn-item-product-active');
                    }
                }

                selects.forEach(select => {
                    select.addEventListener('change', checkSelects);
                });

                checkSelects();
            }
        }

        function makeNotice(elem, message) {
            elem.innerHTML = message;

            elem.style.opacity = "100%";

            setTimeout(function () {
                elem.style.opacity = '0%';
            }, 3000);
        }

        document.querySelectorAll('.product-item').forEach(function(item) {
            const minusButton = item.querySelector('.js-pr-item-minus');
            const plusButton = item.querySelector('.js-pr-item-plus');
            const quantityInput = item.querySelector('.product-item-number');
            const noticeElem = item.querySelector(".product-item-notice");

            imgAspectRatio(item.querySelector(".product-item-photo > img"))

            quantityInput.addEventListener('keyup', function () {
                let message = '';

                if (parseInt(quantityInput.value) > parseInt(quantityInput.max)) {
                    quantityInput.value = parseInt(quantityInput.max);
                    message = `The maximum number can be selected: ${quantityInput.max}`;
                }

                if (parseInt(quantityInput.value) < parseInt(quantityInput.min)) {
                    quantityInput.value = parseInt(quantityInput.min);
                    message = `The minimum number can be selected: ${quantityInput.min}`;
                }

                if (!message) {
                    makeNotice(noticeElem, message);
                }
            })

            minusButton.addEventListener('click', function() {
                let currentValue = parseInt(quantityInput.value);
                if (currentValue > parseInt(quantityInput.min)) {
                    quantityInput.value = currentValue - 1;
                } else {
                    makeNotice(noticeElem,`The minimum number can be selected: ${quantityInput.min}`);
                }
            });

            plusButton.addEventListener('click', function() {
                let currentValue = parseInt(quantityInput.value);
                if (currentValue < parseInt(quantityInput.max)) {
                    quantityInput.value = currentValue + 1;
                } else {
                    makeNotice(noticeElem,`The maximum number can be selected: ${quantityInput.max}`);
                }
            });
        });
        return true;
    }
}