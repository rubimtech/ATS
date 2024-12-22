import listItemTemplate from "./templates/listItem.js";
import StoreApi from "./StoreApi.js";
import Page from "./Page.js";
import { imgAspectRatio } from "./functions";

export default class List extends Page
{
    constructor() {
        super(...arguments);

        this.elItems = document.querySelector('.list-items');
        this.stopLoad = false;
        this.prevParams = null;

        this.products = {};

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.observer.unobserve(entry.target);

                    this.app.filters.incrPage();
                    this.load();
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 1.0
        });
    }

    get params() {
        return this.app.filters.getParams();
    }

    async load() {
        this.prevParams = this.params;
        const data = await StoreApi.products(this.params);
        data.forEach(item => {
            this.products[item.id] = item;
        });

        if(this.params.page == 1) {
            this.elItems.innerHTML = data.map(listItemTemplate).join('');
        } else {
            this.elItems.innerHTML += data.map(listItemTemplate).join('');
        }

        this.elItems.childNodes.forEach(item => {
            imgAspectRatio(item.querySelector('.list-item-photo > img'));
        });

        this.stopLoad = data.length < this.params.per_page;
        if(!this.stopLoad) {
            this.observer.observe(this.elItems.lastChild);
        }

        this.app.cart.updateCart();
    }

    show() {
        if(this.prevParams != this.params) {
            this.load();
        }
        return true;
    }
}