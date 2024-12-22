import Page from "./Page.js";
import StoreApi from "./StoreApi.js";

import {customerTemplate, stateTemplate} from "./templates/customer.js";
import shippingTemplate from "./templates/shipping.js";
import totalTemplate from "./templates/total.js";
export default class Checkout extends Page
{
    constructor() {
        super(...arguments);

        this.updateCustomerTimer = null;
        this.customerForm = document.querySelector('.customer-details');
        this.shippingForm = document.querySelector('.shipping-details');
        this.totalForm = document.querySelector('.total-details');
        this.allFormsElems = [];
        this.firstLoad = true;
        this.customError = null;

        this.customerForm.addEventListener('input', (e) => {
            if(e.target.closest('.js-country')) {
                const country = e.target.value;
                document.querySelector('.js-state').outerHTML = stateTemplate(country, '');
            }
            this.updateCustomer();
        });

        this.shippingForm.addEventListener('change', (e) => {
            StoreApi.selectShippingRate(0, e.target.value, (data) => {
                this.update(data, false, false);
            });
        });
    }

    updateCustomer() {
        if(this.updateCustomerTimer) {
            clearTimeout(this.updateCustomerTimer);
            this.updateCustomerTimer = null;
        }
        this.updateCustomerTimer = setTimeout(() => {
            this.customerForm.querySelector('[name="postcode"]').setCustomValidity('');
            if(!this.firstLoad && !this.checkValidity()) {
                return;
            }

            let formData = new FormData(this.customerForm)
            let address = {
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                address_1: formData.get('address_1'),
                address_2: formData.get('address_2'),
                city: formData.get('city'),
                state: formData.get('state'),
                postcode: formData.get('postcode'),
                country: formData.get('country'),
                email: formData.get('email'),
                phone: formData.get('phone'),
            };
            StoreApi.updateCustomer({
                billing_address: address,
                shipping_address: address
            }, (data) => {
                if(data.code && data.code == 'rest_invalid_param') {
                    let item = data.data.details.shipping_address;
                    if(item.code == 'invalid_postcode') {
                        // this.customerForm.querySelector('[name="postcode"]').setCustomValidity(item.message);
                        this.customerForm.querySelector('[name="postcode"]').dataset.error = true;
                    }

                    if(!this.firstLoad) {
                        this.checkValidity();
                    }
                    return;
                }
                this.update(data, false);
            });
        }, 500);
    }

    checkValidity() {
        let hasError = false;
        let customError = null;
        this.allFormsElems.forEach(input => {
            input.classList.remove('invalid'); 
            if(input.value.length === 0 || input.dataset.error) {
                if(input.dataset.error) {
                    customError = "Invalid email address";
                }
                delete input.dataset.error;
                hasError = true;
                input.classList.add('invalid');
            }
        });

        this.firstLoad = false;
        this.app.buttons.updateCheckoutButton(hasError, customError);
        return !hasError;
    }

    update(data, customer=true, shipping=true) {
        if(customer) {
            this.customerForm.innerHTML = customerTemplate(data);
        }
        if(shipping) {
            this.shippingForm.innerHTML = shippingTemplate(data);
        }

        this.allFormsElems = [...this.customerForm.querySelectorAll('.checkout input[required]')];

        // this.allFormsElems.forEach(input => {
        //     input.addEventListener('input', () => {
        //         this.checkValidity();
        //     })
        // });

        this.totalForm.innerHTML = totalTemplate(data);
    }

    show() {
        // this.checkValidity();
        return true;
    }

    getCartIdByslug(slug) {
        return this.invoices[slug] || false;
    }
}