import StoreApi from "./StoreApi.js";

export default class Autocomplete
{
    constructor(app) {

        this.app = app;
        this.el = document.querySelector("#autoComplete");

        this.autoComplete = new autoComplete({
            selector: "#autoComplete",
            placeHolder: "Search for Product...",
            data: {
                src: async (query) => { 
                    let data = await StoreApi.products({search: query, per_page: 5});
                    return data;
                },
                keys: ['name'],
                cache: false
            },
            resultsList: {
                element: (list, data) => {
                    if (!data.results.length) {
                        // Create "No Results" message element
                        const message = document.createElement("div");
                        // Add class to the created element
                        message.setAttribute("class", "no_result");
                        // Add message text content
                        message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
                        // Append message element to the results list
                        list.prepend(message);
                    }
                },
                noResults: true,
            },
            resultItem: {
                highlight: true,
            }
        });

        this.el.addEventListener("selection", (e) => {
            this.app.show('list');
        });
    }
}