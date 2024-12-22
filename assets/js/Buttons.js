export default class Buttons
{
    constructor(app) {
        this.app = app;

        this.history = [];
        this.currentPage = null;
        this.prevPage = null;

        this.buttons = {
            list: {page: 'cart', label: 'Cart'},
            cart: {page: 'checkout', label: 'Checkout'},
            category: {page: 'list', label: 'List'},
            product: {page: 'list', label: 'List'},
            checkout: {page: 'order', label: 'Place order'},
            order: {MainButton: false},
            thankyou: {page: 'list', label: 'Continue Shopping'},
        }

        if(appData.payments.length > 1) {
            this.buttons.cart = {MainButton: false};
        }

        //for debuging
        this.tg = this.app.tg.platform == 'unknown' ? {
            MainButton: new TestButton('#test-tg-main-btn'),
            BackButton: new TestButton('#test-tg-back-btn'),
            callback: [],
            themeParams: {
                button_color: '#RRGGBB'
            },
            onEvent(event, callback) { 
                this.callback[event] = callback;
            },
            call(event, object) {
                this.callback[event](object);
            }
        } : this.app.tg;

        this.tg.MainButton.onClick(() => {
            const currentPage = this.history[this.history.length - 1];

            if(currentPage == 'checkout' && !this.app.checkout.checkValidity()) {
                this.updateCheckoutButton(true);
                return;
            }
            if(currentPage == 'thankyou') {
                this.history = [];
            }

            this.app.show(this.buttons[currentPage].page);
        });

        this.tg.BackButton.onClick(() => {
            this.history = this.history.filter((i,idx) => this.history[idx-1] !== i);
            this.history.pop();
            const currentPage = this.history.pop();
            this.app.show(currentPage);
        });

        this.tg.onEvent('invoiceClosed', (object) => {

            if (object.status == 'paid') {
                this.history = ['list']; //clear history
                let data = this.app.order.getDataByslug(object.slug);
                this.app.show('thankyou', data);
            } else if (object.status == 'failed') {
                WebApp.showAlert("Don't worry, we'll save your choice.");
            } else if(object.status == 'cancelled') {
                this.history.pop();
                const currentPage = this.history.pop();
                this.app.show(currentPage);
            } 
        });
    }

    updateButtons(cartIsEmpty = true, errorBtn=false) {
        if(errorBtn) {
            this.buttons.list = {page: 'cart', label: 'Cart'};
            this.buttons.cart = {page: 'list', label: errorBtn, color: '#FF0000'};
        }else if (cartIsEmpty) {
            this.buttons.list = {MainButton: false};
            this.buttons.cart = {page: 'list', label: 'Continue Shopping'};
        } else {
            this.buttons.list = {page: 'cart', label: 'Cart'};
            this.buttons.cart = {page: 'checkout', label: 'Checkout'};
        }
        const currentPage = this.history[this.history.length - 1];
        this.switch(currentPage, false);
    }

    updateCheckoutButton(hasError, customError) {
        if (hasError) {
            this.tg.MainButton.color = '#FF0000';
            this.tg.MainButton.setText(customError || 'Some fields are empty');
        } else {
            this.tg.MainButton.color = this.tg.themeParams.button_color;
            this.tg.MainButton.setText(this.buttons.checkout.label);
        }
    }

    switch(page, addHistory = true) {
        if (addHistory) {
            this.history.push(page);
        }

        if(page == 'thankyou') {
            this.history = [page];
        }

        this.tg.MainButton.setText(this.buttons[page].label);
        this.tg.MainButton.color = this.buttons[page].color || this.tg.themeParams.button_color;
        (this.buttons[page].MainButton ?? true) ? this.tg.MainButton.show() : this.tg.MainButton.hide();
        this.history.length > 1 ? this.tg.BackButton.show() : this.tg.BackButton.hide();
    }
}

class TestButton {
    constructor(selector) {
        this.el = document.querySelector(selector);
        this.callback = null;

        this.el.addEventListener('click', (e) => {
            if(this.callback) {
                this.callback();
            }
        });
    }

    show() {
        this.el.style.display = 'block';
    }

    hide() {
        this.el.style.display = 'none';
    }

    setText(text) {
        this.el.innerText = text;
    }

    onClick(callback) {
        this.callback = callback;
    }

    set color(color) {
        this.el.style.background = color;
    }
}