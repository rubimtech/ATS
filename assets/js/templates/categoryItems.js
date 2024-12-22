export function categoryItem({id, name, parent}, checked=false) {
    return `<label>
        ${name}
        <input class="category-item" name="category" type="radio" value="${id}" data-name="${name}" ${checked ? 'checked' : ''}>
    </label>`;
}


export function categoryItems(html) {
    if(!html) {
        return '';
    }
    return `<div class="category-item-wrap">${html}</div>`;
}