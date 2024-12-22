import StoreApi from "./StoreApi.js";
import {categoryItem, categoryItems} from "./templates/categoryItems.js";
import Page from "./Page.js";
export default class Category extends Page
{
    constructor() {
        super(...arguments);
        this.catButton = document.querySelector('.list-category');
        if(!this.catButton) {
            return;
        }

        this.catLabel = document.querySelector('.js-category-value');
        this.catItems = document.querySelector('.category-items');

        this.catButton.addEventListener('click', (e) => {
            this.app.show('category');
        });
        this.defaultCat = {id: 0, parent: null, name: 'All Products'};

        this.cats = [];

        document.addEventListener('click', (e) => {
            let item;
            if(item = e.target.closest('.category-item')) {
                this.showCats(item.value);
                this.catLabel.innerHTML = item.dataset.name;
                this.catLabel.dataset.id = item.value;

                this.app.filters.setParams({category: +item.value});
            }
        });
    }

    get id() {
        return this.app.filters.getParams().category ?? 0;
    }

    async show() {
        if(!this.cats.length) {
            this.cats = [this.defaultCat, ...await StoreApi.categories()];
        }

        this.showCats(this.id);

        return true;
    }

    showCats(id = 0) {
        let currentId = id;
        let html = this.cats
            .filter(({parent}) => parent == id)
            .map(item => categoryItem(item)).join('');

        while(true) {
            const item = this.cats.find(({id}) => id == currentId);
            html = categoryItem(item, item.id == id) + categoryItems(html);
            currentId = item.parent;
            if(currentId == null) {
                break;
            }
        }

        this.catItems.innerHTML = html;
    }
}