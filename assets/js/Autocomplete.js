export default class Autocomplete
{
    constructor(app) {

        this.app = app;
        this.el = document.querySelector("#autoComplete");
        if(!this.el) {
            return;
        }
        
        this.el.addEventListener('input', e => {
            const search = e.target.value;

            this.app.filters.setParams({search});

            this.app.show('list');
        }); 
    }
}