import List from "./List.js";
import Cart from "./Cart.js";
import Checkout from "./Checkout.js";
import Order from "./Order.js";
import Product from "./Product.js";
import Thankyou from "./Thankyou.js";
import Autocomplete from "./Autocomplete.js";
import Category from "./Category.js";
import Filters from "./Filters.js";
import Buttons from "./Buttons.js";

class App {
    constructor() {
        this.tg           = window.Telegram.WebApp;
        this.list         = new List(this);
        this.cart         = new Cart(this);
        this.checkout     = new Checkout(this);
        this.order        = new Order(this);
        this.product      = new Product(this);
        this.thankyou     = new Thankyou(this);
        this.autocomplete = new Autocomplete(this);
        this.category     = new Category(this);
        this.filters      = new Filters(this);
        this.buttons      = new Buttons(this);

        this.pages = {
            list: this.list,
            cart: this.cart,
            category: this.category,
            checkout: this.checkout,
            order: this.order,
            product: this.product,
            thankyou: this.thankyou,
        };
    }

    start() {
        this.show('list');
        // this.show('product', 570);
    }

    async show(page, params) {
        console.log('show', page, params);
        if(this.pages[page] && await this.pages[page].show(params)) {
            console.log('show ok ', page);
            this.buttons.switch(page);
            document.querySelector('.pages .open')?.classList.remove('open');
            document.querySelector(`.pages .${page}`)?.classList.add('open');
        }
    }
}

(new App).start();