export default class Filters
{
    constructor(app) {
        this.app = app;

        this.params = {
            // type: 'simple',
            page: 1,
            per_page: 10,
            orderby: 'menu_order',
        }
    }

    getParams() {
        return this.params;
    }

    setParams(params) {
        this.params = {...this.params, ...params};
        this.params.page = 1;
        if(!this.params.search) {
            delete this.params.search;
        }
        
        if(!this.params.category) {
            delete this.params.category;
        }
        // this.app.show('list');
    }

    incrPage() {
        this.params.page++;
    }

}