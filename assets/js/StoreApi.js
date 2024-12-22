let nonce = appData.nonce; 
export default class StoreApi
{
    static apiUrl = '/wp-json/wc/store/v1';
    
    static get(method, params, callback) {
        const searchParams = new URLSearchParams(params);

        const data = fetch(`${StoreApi.apiUrl}/${method}?${searchParams.toString()}`, {
            method: 'GET',
            headers: {
                'Telegram-Init-Data': window.Telegram.WebApp.initData,
                'X-Mini-App-Bot-Name': appData.botName,
            },
        })
        .then((response) => {
            if(response.headers.get(appData.security.key)) {
                appData.security.value = response.headers.get(appData.security.key);
            }
            return response.json();
        });

        if(callback) {
            data.then(callback);
        } else {
            return data;
        }
    }

    static post(method, params, callback) {
        const data = fetch(`${StoreApi.apiUrl}/${method}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Telegram-Init-Data': window.Telegram.WebApp.initData,
                'X-Mini-App-Bot-Name': appData.botName,
            },
            body: JSON.stringify(params),
        })
        .then((response) => {
            if(response.headers.get(appData.security.key)) {
                appData.security.value = response.headers.get(appData.security.key);
            }
            return response.json();
        });

        if(callback) {
            data.then(callback);
        } else {
            return data;
        }
    }

    static delete(method, callback) {
        const data = fetch(`${StoreApi.apiUrl}/${method}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Telegram-Init-Data': window.Telegram.WebApp.initData,
                'X-Mini-App-Bot-Name': appData.botName,
            },
            body: JSON.stringify(),
        })
            .then((response) => response.json());

        if(callback) {
            data.then(callback);
        } else {
            return data;
        }
    }

    static products(params, callback = null) {
        return StoreApi.get('products', params, callback);
    }

    static categories(callback = null) {
        return StoreApi.get('products/categories', {}, callback);
    }

    static getCart(callback = null) {
        return StoreApi.get('cart', {}, callback);
    }

    static addItem(id, quantity=1, callback) {
        return StoreApi.post('cart/add-item', {id, quantity}, callback);
    }

    static addVariableItem(id, quantity = 1, variations = [] , callback) {
        const params = {
            id,
            quantity,
            variation: variations
        };
        return StoreApi.post('cart/add-item', params, callback);
    }

    static updateItem(key, quantity, callback) {
        return StoreApi.post('cart/update-item', {key, quantity}, callback);
    }

    static removeItem(key, callback) {
        return StoreApi.post('cart/remove-item', {key}, callback);
    }

    static removeAllCartItems(callback) {
        return StoreApi.delete('cart/items/', callback);
    }

    static getOrder(orderId, key, callback) {
        return StoreApi.get(`order/${orderId}`, {key}, callback);
    }

    static updateCustomer(data, callback) {
        return StoreApi.post(`cart/update-customer`, data, callback);
    }

    static selectShippingRate(package_id, rate_id, callback) {
        return StoreApi.post(`cart/select-shipping-rate`, {package_id, rate_id}, callback);
    }
}