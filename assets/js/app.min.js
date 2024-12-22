/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/js/Autocomplete.js":
/*!***********************************!*\
  !*** ./assets/js/Autocomplete.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Autocomplete)
/* harmony export */ });
class Autocomplete {
  constructor(app) {
    this.app = app;
    this.el = document.querySelector("#autoComplete");
    if (!this.el) {
      return;
    }
    this.el.addEventListener('input', e => {
      const search = e.target.value;
      this.app.filters.setParams({
        search
      });
      this.app.show('list');
    });
  }
}

/***/ }),

/***/ "./assets/js/Buttons.js":
/*!******************************!*\
  !*** ./assets/js/Buttons.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Buttons)
/* harmony export */ });
class Buttons {
  constructor(app) {
    this.app = app;
    this.history = [];
    this.currentPage = null;
    this.prevPage = null;
    this.buttons = {
      list: {
        page: 'cart',
        label: 'Cart'
      },
      cart: {
        page: 'checkout',
        label: 'Checkout'
      },
      category: {
        page: 'list',
        label: 'List'
      },
      product: {
        page: 'list',
        label: 'List'
      },
      checkout: {
        page: 'order',
        label: 'Place order'
      },
      order: {
        MainButton: false
      },
      thankyou: {
        page: 'list',
        label: 'Continue Shopping'
      }
    };
    if (appData.payments.length > 1) {
      this.buttons.cart = {
        MainButton: false
      };
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
      if (currentPage == 'checkout' && !this.app.checkout.checkValidity()) {
        this.updateCheckoutButton(true);
        return;
      }
      if (currentPage == 'thankyou') {
        this.history = [];
      }
      this.app.show(this.buttons[currentPage].page);
    });
    this.tg.BackButton.onClick(() => {
      this.history = this.history.filter((i, idx) => this.history[idx - 1] !== i);
      this.history.pop();
      const currentPage = this.history.pop();
      this.app.show(currentPage);
    });
    this.tg.onEvent('invoiceClosed', object => {
      if (object.status == 'paid') {
        this.history = ['list']; //clear history
        let data = this.app.order.getDataByslug(object.slug);
        this.app.show('thankyou', data);
      } else if (object.status == 'failed') {
        WebApp.showAlert("Don't worry, we'll save your choice.");
      } else if (object.status == 'cancelled') {
        this.history.pop();
        const currentPage = this.history.pop();
        this.app.show(currentPage);
      }
    });
  }
  updateButtons(cartIsEmpty = true, errorBtn = false) {
    if (errorBtn) {
      this.buttons.list = {
        page: 'cart',
        label: 'Cart'
      };
      this.buttons.cart = {
        page: 'list',
        label: errorBtn,
        color: '#FF0000'
      };
    } else if (cartIsEmpty) {
      this.buttons.list = {
        MainButton: false
      };
      this.buttons.cart = {
        page: 'list',
        label: 'Continue Shopping'
      };
    } else {
      this.buttons.list = {
        page: 'cart',
        label: 'Cart'
      };
      this.buttons.cart = {
        page: 'checkout',
        label: 'Checkout'
      };
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
    if (page == 'thankyou') {
      this.history = [page];
    }
    this.tg.MainButton.setText(this.buttons[page].label);
    this.tg.MainButton.color = this.buttons[page].color || this.tg.themeParams.button_color;
    this.buttons[page].MainButton ?? true ? this.tg.MainButton.show() : this.tg.MainButton.hide();
    this.history.length > 1 ? this.tg.BackButton.show() : this.tg.BackButton.hide();
  }
}
class TestButton {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.callback = null;
    this.el.addEventListener('click', e => {
      if (this.callback) {
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

/***/ }),

/***/ "./assets/js/Cart.js":
/*!***************************!*\
  !*** ./assets/js/Cart.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cart)
/* harmony export */ });
/* harmony import */ var _templates_cartItem_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./templates/cartItem.js */ "./assets/js/templates/cartItem.js");
/* harmony import */ var _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StoreApi.js */ "./assets/js/StoreApi.js");
/* harmony import */ var _Page_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Page.js */ "./assets/js/Page.js");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./functions */ "./assets/js/functions.js");
/* harmony import */ var _templates_icons_done__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./templates/icons/done */ "./assets/js/templates/icons/done.js");
/* harmony import */ var _templates_icons_loading__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./templates/icons/loading */ "./assets/js/templates/icons/loading.js");
/* harmony import */ var _currencies_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./currencies.json */ "./assets/js/currencies.json");








class Cart extends _Page_js__WEBPACK_IMPORTED_MODULE_2__["default"] {
  constructor() {
    super(...arguments);
    this.cart = null;
    this.elItems = document.querySelector('.cart-items');
    _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].getCart(this.updateCart.bind(this));
    document.addEventListener('click', e => {
      if (e.target.closest('.js-item-incr-btn')) {
        e.preventDefault();
        const item = e.target.closest('.js-item');
        if (item.classList.contains('cart-item')) {
          const key = item.dataset.itemKey;
          const cartItem = this.cart.items.find(item => {
            return item.key == key;
          });
          const quantity = cartItem.quantity + 1;
          _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].updateItem(key, quantity, this.updateCart.bind(this));
        } else if (item.classList.contains('list-item')) {
          const id = item.dataset.itemId;
          _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].addItem(id, 1, this.updateCart.bind(this));
          item.querySelector('.list-item-incr-button').innerHTML = (0,_templates_icons_loading__WEBPACK_IMPORTED_MODULE_5__["default"])();
        }
      } else if (e.target.closest('.js-item-decr-btn')) {
        e.preventDefault();
        const item = e.target.closest('.js-item');
        let cartItem = null;
        if (item.classList.contains('cart-item')) {
          const key = item.dataset.itemKey;
          cartItem = this.cart.items.find(item => {
            return item.key == key;
          });
        } else if (item.classList.contains('list-item')) {
          const id = item.dataset.itemId;
          cartItem = this.cart.items.find(item => {
            return item.id == id;
          });
        }
        if (!cartItem) {
          console.log('Error: No found cart item');
          return;
        }
        const key = cartItem.key;
        const quantity = cartItem.quantity - 1;
        if (quantity > 0) {
          _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].updateItem(key, quantity, this.updateCart.bind(this));
        } else if (quantity == 0) {
          _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].removeItem(key, this.updateCart.bind(this));
        }
      }
      if (e.target.closest('.js-pr-item-incr-btn')) {
        e.preventDefault();
        const item = e.target.closest('.js-pr-item');
        if (item.classList.contains('product-item')) {
          const id = item.dataset.itemId;
          const type = item.dataset.itemType;
          let quantity = parseInt(item.querySelector('.product-item-number').value);
          let variations = [];
          const selects = item.querySelectorAll('.product-item-variations');
          selects.forEach(select => {
            const attributeName = select.name.replace('attribute_', '');
            const attributeValue = select.value;
            if (attributeValue) {
              variations.push({
                attribute: attributeName,
                value: attributeValue
              });
            }
          });
          if (type === 'variable' && variations.length > 0) {
            _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].addVariableItem(id, quantity, variations, this.updateCart.bind(this));
          } else {
            _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].addItem(id, quantity, this.updateCart.bind(this));
          }
          const addToCartButton = item.querySelector('.js-pr-item-incr-btn');
          if (addToCartButton) {
            addToCartButton.innerHTML = (0,_templates_icons_loading__WEBPACK_IMPORTED_MODULE_5__["default"])();
          }
          item.querySelector(".product-item-success").style.opacity = '100%';
          setTimeout(function () {
            item.querySelector(".product-item-success").style.opacity = '0%';
          }, 3000);
        }
      } else if (e.target.closest('.js-pr-item-trash-btn')) {
        const item = e.target.closest('.js-item');
        const key = item.dataset.itemKey;
        const cartItem = this.cart.items.find(item => {
          return item.key == key;
        });
        _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].removeItem(key, this.updateCart.bind(this));
      } else if (e.target.closest('.js-pr-items-clear-btn')) {
        const itemsWithCount = document.querySelectorAll('.list-item[data-item-count]:not([data-item-count="0"])');
        itemsWithCount.forEach(listItem => {
          listItem.setAttribute('data-item-count', '0');
          const counterElement = listItem.querySelector('.list-item-counter.js-item-counter');
          const addToCartButton = listItem.querySelector('.js-item-incr-btn');
          if (addToCartButton) {
            addToCartButton.innerHTML = addToCartButton.dataset.defaultText;
          }
          if (counterElement) {
            counterElement.textContent = '0';
          }
        });
        _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].removeAllCartItems(this.updateCart.bind(this));
      }
    });
  }
  updateCart(data = null) {
    if (data?.code) {
      console.log(`Error: ${data.message}`);
      this.cart = data.data.cart;
    } else if (data != null) {
      this.cart = data;
    }
    if (this.cart?.items) {
      document.querySelectorAll('.js-item').forEach(item => {
        let quantity = 0;
        const cartItem = this.cart.items.find(({
          id
        }) => id == item.dataset.itemId);
        if (cartItem) {
          quantity = cartItem.quantity;
        }
        item.dataset.itemCount = quantity;
        item.querySelector('.js-item-counter').innerHTML = quantity;
        const listItemButton = item.querySelector('.list-item-incr-button');
        if (listItemButton) {
          if (quantity > 0) {
            listItemButton.innerHTML = (0,_templates_icons_done__WEBPACK_IMPORTED_MODULE_4__["default"])();
          } else {
            listItemButton.innerHTML = listItemButton.dataset.defaultText;
          }
        }
      });
      const productItem = document.querySelector('.product-item');
      if (productItem) {
        const productButton = productItem.querySelector('.js-pr-item-incr-btn');
        const productQuantity = this.cart.items.find(({
          id
        }) => id == productItem.dataset.itemId)?.quantity;
        if (productQuantity > 0) {
          productButton.innerHTML = (0,_templates_icons_done__WEBPACK_IMPORTED_MODULE_4__["default"])();
        } else {
          productButton.innerHTML = productButton.dataset.defaultText;
        }
      }
    }
    if (!this.cart?.items || this.cart.items.length === 0) {
      document.querySelector('.cart-items').innerHTML = `<div class="empty-cart">The cart is empty</div>`;
      document.querySelector('.js-pr-items-clear-btn').style.display = 'none';
      this.app.buttons.updateButtons();
    } else {
      document.querySelector('.js-pr-items-clear-btn').style.display = 'block';
      this.app.buttons.updateButtons(false);
      this.elItems.innerHTML = this.cart.items.map(_templates_cartItem_js__WEBPACK_IMPORTED_MODULE_0__["default"]).join('');
      if (this.cart?.totals) {
        let minAmount = _currencies_json__WEBPACK_IMPORTED_MODULE_6__[this.cart.totals.currency_code];
        if (minAmount && this.cart.totals.total_price < minAmount) {
          this.app.buttons.updateButtons(false, `Min order - ${(0,_functions__WEBPACK_IMPORTED_MODULE_3__.wc_price)(minAmount, {
            ...this.cart.totals,
            html: false
          })}`);
        }
      }
      this.elItems.childNodes.forEach(item => (0,_functions__WEBPACK_IMPORTED_MODULE_3__.imgAspectRatio)(item.querySelector('.cart-item-photo > img')));
      if (appData.payments.length > 1) {
        document.querySelector('.payment-btns').innerHTML = appData.payments.map(name => {
          return `<button data-payment-name="${name}">Pay via ${name}</button>`;
        }).join('');
      }
    }
    this.app.checkout.update(this.cart);
  }
  show() {
    _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].getCart(this.updateCart.bind(this));
    return true;
  }
}

/***/ }),

/***/ "./assets/js/Category.js":
/*!*******************************!*\
  !*** ./assets/js/Category.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Category)
/* harmony export */ });
/* harmony import */ var _StoreApi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StoreApi.js */ "./assets/js/StoreApi.js");
/* harmony import */ var _templates_categoryItems_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./templates/categoryItems.js */ "./assets/js/templates/categoryItems.js");
/* harmony import */ var _Page_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Page.js */ "./assets/js/Page.js");



class Category extends _Page_js__WEBPACK_IMPORTED_MODULE_2__["default"] {
  constructor() {
    super(...arguments);
    this.catButton = document.querySelector('.list-category');
    if (!this.catButton) {
      return;
    }
    this.catLabel = document.querySelector('.js-category-value');
    this.catItems = document.querySelector('.category-items');
    this.catButton.addEventListener('click', e => {
      this.app.show('category');
    });
    this.defaultCat = {
      id: 0,
      parent: null,
      name: 'All Products'
    };
    this.cats = [];
    document.addEventListener('click', e => {
      let item;
      if (item = e.target.closest('.category-item')) {
        this.showCats(item.value);
        this.catLabel.innerHTML = item.dataset.name;
        this.catLabel.dataset.id = item.value;
        this.app.filters.setParams({
          category: +item.value
        });
      }
    });
  }
  get id() {
    return this.app.filters.getParams().category ?? 0;
  }
  async show() {
    if (!this.cats.length) {
      this.cats = [this.defaultCat, ...(await _StoreApi_js__WEBPACK_IMPORTED_MODULE_0__["default"].categories())];
    }
    this.showCats(this.id);
    return true;
  }
  showCats(id = 0) {
    let currentId = id;
    let html = this.cats.filter(({
      parent
    }) => parent == id).map(item => (0,_templates_categoryItems_js__WEBPACK_IMPORTED_MODULE_1__.categoryItem)(item)).join('');
    while (true) {
      const item = this.cats.find(({
        id
      }) => id == currentId);
      html = (0,_templates_categoryItems_js__WEBPACK_IMPORTED_MODULE_1__.categoryItem)(item, item.id == id) + (0,_templates_categoryItems_js__WEBPACK_IMPORTED_MODULE_1__.categoryItems)(html);
      currentId = item.parent;
      if (currentId == null) {
        break;
      }
    }
    this.catItems.innerHTML = html;
  }
}

/***/ }),

/***/ "./assets/js/Checkout.js":
/*!*******************************!*\
  !*** ./assets/js/Checkout.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Checkout)
/* harmony export */ });
/* harmony import */ var _Page_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Page.js */ "./assets/js/Page.js");
/* harmony import */ var _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StoreApi.js */ "./assets/js/StoreApi.js");
/* harmony import */ var _templates_customer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./templates/customer.js */ "./assets/js/templates/customer.js");
/* harmony import */ var _templates_shipping_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./templates/shipping.js */ "./assets/js/templates/shipping.js");
/* harmony import */ var _templates_total_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./templates/total.js */ "./assets/js/templates/total.js");





class Checkout extends _Page_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.updateCustomerTimer = null;
    this.customerForm = document.querySelector('.customer-details');
    this.shippingForm = document.querySelector('.shipping-details');
    this.totalForm = document.querySelector('.total-details');
    this.allFormsElems = [];
    this.firstLoad = true;
    this.customError = null;
    this.customerForm.addEventListener('input', e => {
      if (e.target.closest('.js-country')) {
        const country = e.target.value;
        document.querySelector('.js-state').outerHTML = (0,_templates_customer_js__WEBPACK_IMPORTED_MODULE_2__.stateTemplate)(country, '');
      }
      this.updateCustomer();
    });
    this.shippingForm.addEventListener('change', e => {
      _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].selectShippingRate(0, e.target.value, data => {
        this.update(data, false, false);
      });
    });
  }
  updateCustomer() {
    if (this.updateCustomerTimer) {
      clearTimeout(this.updateCustomerTimer);
      this.updateCustomerTimer = null;
    }
    this.updateCustomerTimer = setTimeout(() => {
      this.customerForm.querySelector('[name="postcode"]').setCustomValidity('');
      if (!this.firstLoad && !this.checkValidity()) {
        return;
      }
      let formData = new FormData(this.customerForm);
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
        phone: formData.get('phone')
      };
      _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].updateCustomer({
        billing_address: address,
        shipping_address: address
      }, data => {
        if (data.code && data.code == 'rest_invalid_param') {
          let item = data.data.details.shipping_address;
          if (item.code == 'invalid_postcode') {
            // this.customerForm.querySelector('[name="postcode"]').setCustomValidity(item.message);
            this.customerForm.querySelector('[name="postcode"]').dataset.error = true;
          }
          if (!this.firstLoad) {
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
      if (input.value.length === 0 || input.dataset.error) {
        if (input.dataset.error) {
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
  update(data, customer = true, shipping = true) {
    if (customer) {
      this.customerForm.innerHTML = (0,_templates_customer_js__WEBPACK_IMPORTED_MODULE_2__.customerTemplate)(data);
    }
    if (shipping) {
      this.shippingForm.innerHTML = (0,_templates_shipping_js__WEBPACK_IMPORTED_MODULE_3__["default"])(data);
    }
    this.allFormsElems = [...this.customerForm.querySelectorAll('.checkout input[required]')];

    // this.allFormsElems.forEach(input => {
    //     input.addEventListener('input', () => {
    //         this.checkValidity();
    //     })
    // });

    this.totalForm.innerHTML = (0,_templates_total_js__WEBPACK_IMPORTED_MODULE_4__["default"])(data);
  }
  show() {
    // this.checkValidity();
    return true;
  }
  getCartIdByslug(slug) {
    return this.invoices[slug] || false;
  }
}

/***/ }),

/***/ "./assets/js/Filters.js":
/*!******************************!*\
  !*** ./assets/js/Filters.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Filters)
/* harmony export */ });
class Filters {
  constructor(app) {
    this.app = app;
    this.params = {
      // type: 'simple',
      page: 1,
      per_page: 10,
      orderby: 'menu_order'
    };
  }
  getParams() {
    return this.params;
  }
  setParams(params) {
    this.params = {
      ...this.params,
      ...params
    };
    this.params.page = 1;
    if (!this.params.search) {
      delete this.params.search;
    }
    if (!this.params.category) {
      delete this.params.category;
    }
    // this.app.show('list');
  }
  incrPage() {
    this.params.page++;
  }
}

/***/ }),

/***/ "./assets/js/List.js":
/*!***************************!*\
  !*** ./assets/js/List.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ List)
/* harmony export */ });
/* harmony import */ var _templates_listItem_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./templates/listItem.js */ "./assets/js/templates/listItem.js");
/* harmony import */ var _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StoreApi.js */ "./assets/js/StoreApi.js");
/* harmony import */ var _Page_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Page.js */ "./assets/js/Page.js");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./functions */ "./assets/js/functions.js");




class List extends _Page_js__WEBPACK_IMPORTED_MODULE_2__["default"] {
  constructor() {
    super(...arguments);
    this.elItems = document.querySelector('.list-items');
    this.stopLoad = false;
    this.prevParams = null;
    this.products = {};
    this.observer = new IntersectionObserver(entries => {
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
    const data = await _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].products(this.params);
    data.forEach(item => {
      this.products[item.id] = item;
    });
    if (this.params.page == 1) {
      this.elItems.innerHTML = data.map(_templates_listItem_js__WEBPACK_IMPORTED_MODULE_0__["default"]).join('');
    } else {
      this.elItems.innerHTML += data.map(_templates_listItem_js__WEBPACK_IMPORTED_MODULE_0__["default"]).join('');
    }
    this.elItems.childNodes.forEach(item => {
      (0,_functions__WEBPACK_IMPORTED_MODULE_3__.imgAspectRatio)(item.querySelector('.list-item-photo > img'));
    });
    this.stopLoad = data.length < this.params.per_page;
    if (!this.stopLoad) {
      this.observer.observe(this.elItems.lastChild);
    }
    this.app.cart.updateCart();
  }
  show() {
    if (this.prevParams != this.params) {
      this.load();
    }
    return true;
  }
}

/***/ }),

/***/ "./assets/js/Order.js":
/*!****************************!*\
  !*** ./assets/js/Order.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Order)
/* harmony export */ });
/* harmony import */ var _Page_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Page.js */ "./assets/js/Page.js");
/* harmony import */ var _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StoreApi.js */ "./assets/js/StoreApi.js");


class Order extends _Page_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    this.invoices = {};
    document.addEventListener('click', e => {
      let item;
      if (item = e.target.closest('.payment-btns button')) {
        let paymentName = item.dataset.paymentName;
        this.createInvoice(paymentName);
      }
    });
  }
  async createInvoice(paymentName) {
    var formData = new FormData();
    formData.append('action', 'telegram_shop_create_invoice_link');
    formData.append('botName', appData.botName);
    formData.append('paymentName', paymentName);
    formData.append(appData.security.key, appData.security.value);
    let response = await fetch(appData.ajaxurl, {
      method: 'POST',
      headers: {
        'Telegram-Init-Data': window.Telegram.WebApp.initData
      },
      body: formData
    });
    let data = await response.json();
    if (!data.success) {
      let hasError = true;
      let customError = data.data.message == 'Bad Request: CURRENCY_TOTAL_AMOUNT_INVALID' ? 'Order amount is too small' : data.data.message;
      this.app.buttons.updateCheckoutButton(hasError, customError);
      return false;
    }

    // Only for debug in browser
    if (this.app.tg.platform == 'unknown') {
      setTimeout(() => {
        const slug = '1312321';
        this.invoices[slug] = data.data;
        this.app.buttons.tg.call('invoiceClosed', {
          status: 'paid',
          slug
        });
      }, 200);
    } else {
      this.app.tg.openInvoice(data.data.url, e => {
        this.invoices[e.slug] = data.data;
      });
    }
    return true;
  }
  async show() {
    if (appData.payments.length == 1) {
      return await this.createInvoice(appData.payments[0]);
    }
    return false;
  }
  getDataByslug(slug) {
    console.log('getDataByslug', slug, this.invoices[slug]);
    return this.invoices[slug] || false;
  }
}

/***/ }),

/***/ "./assets/js/Page.js":
/*!***************************!*\
  !*** ./assets/js/Page.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Page)
/* harmony export */ });
class Page {
  constructor(app) {
    this.app = app;
  }
  show(params) {}
}

/***/ }),

/***/ "./assets/js/Product.js":
/*!******************************!*\
  !*** ./assets/js/Product.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Product)
/* harmony export */ });
/* harmony import */ var _Page_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Page.js */ "./assets/js/Page.js");
/* harmony import */ var _templates_productItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./templates/productItem */ "./assets/js/templates/productItem.js");
/* harmony import */ var _StoreApi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StoreApi */ "./assets/js/StoreApi.js");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./functions */ "./assets/js/functions.js");




class Product extends _Page_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
    document.addEventListener('click', e => {
      if (e.target.closest('.js-item img') || e.target.closest('.js-item-sel-opt')) {
        const id = +e.target.closest('.js-item').dataset.itemId;
        this.app.show('product', {
          id
        });
      }
    });
  }
  show({
    id
  }) {
    if (this.app.list.products[id]) {
      let variations = this.app.list.products[id].variations;
      const productHTML = (0,_templates_productItem__WEBPACK_IMPORTED_MODULE_1__["default"])(this.app.list.products[id]);
      document.querySelector('.product').innerHTML = productHTML;
      if (this.app.list.products[id].type !== 'simple') {
        const selects = document.querySelectorAll('.product-item-variations');
        const addToCartButton = document.querySelector('.js-pr-item-incr-btn');
        const priceElem = document.querySelector('.product-item-price');
        async function changePriceBySelects(possibleVariations) {
          priceElem.innerHTML = `<div class="product-item-price-loading">`;
          const variantProducts = await _StoreApi__WEBPACK_IMPORTED_MODULE_2__["default"].products({
            type: 'variation',
            parent: id,
            include: possibleVariations.map(variant => variant.id).join(',')
          });
          const prices = variantProducts.map(variant => {
            return parseFloat(variant.prices.sale_price ?? variant.prices.price);
          });
          const args = variantProducts[0].prices;
          const maxPrice = Math.max.apply(Math, prices);
          const minPrice = Math.min.apply(Math, prices);
          priceElem.innerHTML = (0,_functions__WEBPACK_IMPORTED_MODULE_3__.wc_price)(minPrice, args) + (minPrice !== maxPrice ? ` - ` + (0,_functions__WEBPACK_IMPORTED_MODULE_3__.wc_price)(maxPrice, args) : '');
        }
        function checkSelects() {
          let selectedAttributes = {};
          selects.forEach(select => {
            if (select.value !== '') {
              selectedAttributes[select.dataset.itemName] = select.value;
            }
          });
          selects.forEach(select => {
            const options = select.querySelectorAll('option');
            options.forEach(option => {
              option.disabled = false;
            });
            const currentAttributeName = select.dataset.itemName;
            const possibleVariations = variations.filter(variation => {
              return Object.keys(selectedAttributes).every(key => {
                return variation.attributes.some(attr => {
                  return attr.name === key && (attr.value === selectedAttributes[key] || attr.value === null);
                });
              });
            });
            changePriceBySelects(possibleVariations);
            options.forEach(option => {
              if (option.value !== '') {
                const isOptionAvailable = possibleVariations.some(variation => variation.attributes.some(attr => attr.name === currentAttributeName && (attr.value === option.value || attr.value === null)));
                if (!isOptionAvailable) {
                  option.disabled = true;
                }
              }
            });
          });
          let allSelected = true;
          selects.forEach(select => {
            if (select.value === '') {
              allSelected = false;
            }
          });
          if (!allSelected) {
            addToCartButton.disabled = true;
            addToCartButton.classList.remove('btn-item-product-active');
            addToCartButton.classList.add('btn-item-product-inactive');
          } else {
            addToCartButton.disabled = false;
            addToCartButton.classList.remove('btn-item-product-inactive');
            addToCartButton.classList.add('btn-item-product-active');
          }
        }
        selects.forEach(select => {
          select.addEventListener('change', checkSelects);
        });
        checkSelects();
      }
    }
    function makeNotice(elem, message) {
      elem.innerHTML = message;
      elem.style.opacity = "100%";
      setTimeout(function () {
        elem.style.opacity = '0%';
      }, 3000);
    }
    document.querySelectorAll('.product-item').forEach(function (item) {
      const minusButton = item.querySelector('.js-pr-item-minus');
      const plusButton = item.querySelector('.js-pr-item-plus');
      const quantityInput = item.querySelector('.product-item-number');
      const noticeElem = item.querySelector(".product-item-notice");
      (0,_functions__WEBPACK_IMPORTED_MODULE_3__.imgAspectRatio)(item.querySelector(".product-item-photo > img"));
      quantityInput.addEventListener('keyup', function () {
        let message = '';
        if (parseInt(quantityInput.value) > parseInt(quantityInput.max)) {
          quantityInput.value = parseInt(quantityInput.max);
          message = `The maximum number can be selected: ${quantityInput.max}`;
        }
        if (parseInt(quantityInput.value) < parseInt(quantityInput.min)) {
          quantityInput.value = parseInt(quantityInput.min);
          message = `The minimum number can be selected: ${quantityInput.min}`;
        }
        if (!message) {
          makeNotice(noticeElem, message);
        }
      });
      minusButton.addEventListener('click', function () {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > parseInt(quantityInput.min)) {
          quantityInput.value = currentValue - 1;
        } else {
          makeNotice(noticeElem, `The minimum number can be selected: ${quantityInput.min}`);
        }
      });
      plusButton.addEventListener('click', function () {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue < parseInt(quantityInput.max)) {
          quantityInput.value = currentValue + 1;
        } else {
          makeNotice(noticeElem, `The maximum number can be selected: ${quantityInput.max}`);
        }
      });
    });
    return true;
  }
}

/***/ }),

/***/ "./assets/js/StoreApi.js":
/*!*******************************!*\
  !*** ./assets/js/StoreApi.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StoreApi)
/* harmony export */ });
let nonce = appData.nonce;
class StoreApi {
  static apiUrl = '/wp-json/wc/store/v1';
  static get(method, params, callback) {
    const searchParams = new URLSearchParams(params);
    const data = fetch(`${StoreApi.apiUrl}/${method}?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Telegram-Init-Data': window.Telegram.WebApp.initData,
        'X-Mini-App-Bot-Name': appData.botName
      }
    }).then(response => {
      if (response.headers.get(appData.security.key)) {
        appData.security.value = response.headers.get(appData.security.key);
      }
      return response.json();
    });
    if (callback) {
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
        'X-Mini-App-Bot-Name': appData.botName
      },
      body: JSON.stringify(params)
    }).then(response => {
      if (response.headers.get(appData.security.key)) {
        appData.security.value = response.headers.get(appData.security.key);
      }
      return response.json();
    });
    if (callback) {
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
        'X-Mini-App-Bot-Name': appData.botName
      },
      body: JSON.stringify()
    }).then(response => response.json());
    if (callback) {
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
  static addItem(id, quantity = 1, callback) {
    return StoreApi.post('cart/add-item', {
      id,
      quantity
    }, callback);
  }
  static addVariableItem(id, quantity = 1, variations = [], callback) {
    const params = {
      id,
      quantity,
      variation: variations
    };
    return StoreApi.post('cart/add-item', params, callback);
  }
  static updateItem(key, quantity, callback) {
    return StoreApi.post('cart/update-item', {
      key,
      quantity
    }, callback);
  }
  static removeItem(key, callback) {
    return StoreApi.post('cart/remove-item', {
      key
    }, callback);
  }
  static removeAllCartItems(callback) {
    return StoreApi.delete('cart/items/', callback);
  }
  static getOrder(orderId, key, callback) {
    return StoreApi.get(`order/${orderId}`, {
      key
    }, callback);
  }
  static updateCustomer(data, callback) {
    return StoreApi.post(`cart/update-customer`, data, callback);
  }
  static selectShippingRate(package_id, rate_id, callback) {
    return StoreApi.post(`cart/select-shipping-rate`, {
      package_id,
      rate_id
    }, callback);
  }
}

/***/ }),

/***/ "./assets/js/Thankyou.js":
/*!*******************************!*\
  !*** ./assets/js/Thankyou.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Thankyou)
/* harmony export */ });
/* harmony import */ var _Page_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Page.js */ "./assets/js/Page.js");
/* harmony import */ var _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StoreApi.js */ "./assets/js/StoreApi.js");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./functions */ "./assets/js/functions.js");



const ThankyouItemTemplate = ({
  key,
  name,
  images,
  quantity,
  prices,
  totals
}) => {
  return `<tr>
        <td>${name} х ${quantity}</td>
        <td>${(0,_functions__WEBPACK_IMPORTED_MODULE_2__.wc_price)(totals.line_subtotal, totals)}</td>
    </tr>`;
};
const ThankyouTemplate = ({
  id,
  status,
  items,
  totals,
  shipping_address,
  billing_address
}) => {
  return `
    <h1>Order received</h1>
    <div class="order-details">
        <span>Thank you. Your order has been received.</span>
        <table>
            <tr><td style="width: 100%;">Order number</td><td>${id}</td></tr>
            <tr><td>Status</td><td>${status}</td></tr>
            

            <tr><td>Product</td><td>Total</td></tr>
            ${items.map(ThankyouItemTemplate).join('')}
            <tr><td>Subtotal</td><td>${(0,_functions__WEBPACK_IMPORTED_MODULE_2__.wc_price)(totals.subtotal, totals)}</td></tr>
            <tr><td>Shipping</td><td>${(0,_functions__WEBPACK_IMPORTED_MODULE_2__.wc_price)(totals.total_shipping, totals)}</td></tr>
            <tr><td>Total</td><td>${(0,_functions__WEBPACK_IMPORTED_MODULE_2__.wc_price)(totals.total_price, totals)}</td></tr>
        </table>
        <h2>Billing address</h2>
        <address>${Object.values(billing_address).filter(Boolean).join('<br>')}</address>
        <h2>Shipping address</h2>
        <address>${Object.values(shipping_address).filter(Boolean).join('<br>')}</address>
    </div>
    `;
};
class Thankyou extends _Page_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super(...arguments);
  }
  show(data) {
    _StoreApi_js__WEBPACK_IMPORTED_MODULE_1__["default"].getOrder(data.orderId, data.orderKey, response => {
      document.querySelector('.thankyou').innerHTML = ThankyouTemplate(response);
    });

    // Update cart page and counts after checkout
    this.app.cart.show();
    return true;
  }
}

/***/ }),

/***/ "./assets/js/functions.js":
/*!********************************!*\
  !*** ./assets/js/functions.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   imgAspectRatio: () => (/* binding */ imgAspectRatio),
/* harmony export */   wc_price: () => (/* binding */ wc_price)
/* harmony export */ });
function imgAspectRatio(imgElem) {
  imgElem.onload = () => {
    if (imgElem.height >= imgElem.width) {
      imgElem.style.width = '100%';
    } else {
      imgElem.style.height = '100%';
    }
  };
}
function wc_price(price, args) {
  price = price / Math.pow(10, args.currency_minor_unit);
  price = price.toFixed(2);
  var default_args = {
    decimal_sep: args.currency_decimal_separator,
    currency_position: 'right',
    currency_symbol: args.currency_symbol,
    trim_zeros: args.currency_thousand_separator,
    num_decimals: args.currency_minor_unit,
    html: args.html == undefined ? true : args.html
  };
  if (default_args.num_decimals > 0) {
    var wc_price_length = parseInt(price).toString().length;
    var wc_int_end_sep = wc_price_length + default_args.num_decimals;
    price = price.toString().substr(0, wc_int_end_sep + 1);
  } else {
    price = parseInt(price);
  }
  price = price.toString().replace('.', default_args.decimal_sep);
  var formatted_price = price;
  var formatted_symbol = default_args.html ? '<span class="woocommerce-Price-currencySymbol"> ' + default_args.currency_symbol + '</span>' : default_args.currency_symbol;
  formatted_price = formatted_price + formatted_symbol;
  formatted_price = default_args.html ? '<span class="woocommerce-Price-amount amount">' + formatted_price + '</span>' : formatted_price;
  return formatted_price;
}

/***/ }),

/***/ "./assets/js/templates/cartItem.js":
/*!*****************************************!*\
  !*** ./assets/js/templates/cartItem.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ cartItem)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions */ "./assets/js/functions.js");

function cartItem({
  key,
  id,
  name,
  images,
  quantity,
  prices,
  totals
}) {
  return `<div class="cart-item js-item" data-item-key="${key}" data-item-id="${id}">
        <div class="cart-item-photo">
        <img src="${images[0]?.src ?? appData.placeHolder}" alt="${images[0]?.alt}">
        </div>
        <div class="cart-item-product">
            <span class="cart-item-title">${name}</span>
            <span class="cart-item-price">${prices.regular_price != prices.price ? `<del aria-hidden="true">${(0,_functions__WEBPACK_IMPORTED_MODULE_0__.wc_price)(prices.regular_price, prices)}</del>` : ''} ${(0,_functions__WEBPACK_IMPORTED_MODULE_0__.wc_price)(prices.price, prices)}</span>
            <div class="cart-item-buttons">
                <div class="cart-item-buttons-wrapper">
                    <button class="cart-item-decr-button js-item-decr-btn">
                        <span class="button-item-label">-</span>
                    </button>
                    <span class="cart-item-count js-item-counter">${quantity}</span>
                    <button class="cart-item-incr-button js-item-incr-btn">
                        <span class="button-item-label">+</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="cart-item-end-block">
            <div class="cart-item-total">${(0,_functions__WEBPACK_IMPORTED_MODULE_0__.wc_price)(totals.line_subtotal, totals)}</div>
            <div class="cart-btn-icon-trash js-pr-item-trash-btn">
                <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_238_161)">
                        <path d="M235.434 -0.566442C237.201 -0.571691 238.969 -0.577972 240.737 -0.585226C244.424 -0.595576 248.111 -0.591147 251.798 -0.576452C256.489 -0.559272 261.18 -0.582778 265.871 -0.617942C269.516 -0.640054 273.162 -0.638441 276.807 -0.630176C278.535 -0.629364 280.263 -0.636081 281.991 -0.650947C297.309 -0.762563 309.63 1.87715 321 13C328.854 21.7358 333.129 31.4574 333.047 43.2422C333.04 44.5066 333.033 45.771 333.026 47.0737C333.018 48.0394 333.009 49.005 333 50C333.967 49.9889 334.933 49.9778 335.929 49.9663C345.107 49.8643 354.285 49.7897 363.463 49.7409C368.18 49.715 372.897 49.6799 377.613 49.6228C382.178 49.5678 386.742 49.5384 391.307 49.5256C393.036 49.5164 394.764 49.4986 396.493 49.4713C416.223 49.1724 432.056 53.9249 446.691 67.7382C447.834 68.8578 447.834 68.8578 449 70C449.628 70.5916 450.256 71.1833 450.902 71.7929C461.479 82.6577 466.665 98.1239 467.086 113.051C466.798 118.161 465.86 121.374 462 125C459.182 126.409 456.827 126.112 453.68 126.098C452.423 126.094 451.166 126.091 449.871 126.088C448.552 126.079 447.234 126.071 445.875 126.062C444.535 126.057 443.195 126.053 441.855 126.049C438.57 126.037 435.285 126.02 432 126C432.013 126.76 432.025 127.52 432.038 128.303C432.118 137.046 431.62 145.675 430.919 154.386C430.801 155.9 430.684 157.413 430.567 158.926C430.247 163.049 429.92 167.171 429.592 171.294C429.239 175.753 428.891 180.212 428.543 184.672C427.782 194.401 427.013 204.129 426.243 213.858C425.762 219.933 425.283 226.009 424.804 232.085C423.476 248.917 422.148 265.748 420.812 282.579C420.727 283.654 420.641 284.729 420.554 285.836C420.381 288.015 420.208 290.194 420.035 292.373C419.949 293.455 419.863 294.536 419.775 295.651C419.689 296.734 419.603 297.817 419.514 298.932C418.119 316.513 416.737 334.095 415.359 351.677C413.944 369.739 412.519 387.801 411.084 405.861C410.279 415.998 409.478 426.135 408.688 436.272C408.016 444.895 407.334 453.517 406.642 462.138C406.288 466.537 405.939 470.937 405.602 475.337C405.292 479.363 404.971 483.388 404.641 487.412C404.523 488.87 404.41 490.328 404.301 491.786C404.153 493.765 403.988 495.743 403.822 497.721C403.735 498.821 403.648 499.92 403.559 501.054C402.764 505.246 401.197 507.864 398.115 510.789C395.597 512.231 394.058 512.378 391.167 512.383C390.191 512.392 389.215 512.401 388.209 512.411C387.14 512.405 386.07 512.4 384.967 512.394C383.26 512.403 383.26 512.403 381.517 512.413C377.688 512.429 373.859 512.425 370.03 512.42C367.29 512.426 364.551 512.436 361.811 512.446C355.133 512.467 348.456 512.471 341.778 512.469C336.35 512.468 330.923 512.472 325.495 512.479C323.933 512.481 322.37 512.483 320.807 512.486C320.03 512.487 319.252 512.488 318.451 512.489C303.737 512.508 289.023 512.507 274.309 512.5C260.847 512.494 247.385 512.515 233.923 512.548C220.102 512.582 206.282 512.597 192.462 512.592C184.702 512.59 176.942 512.595 169.182 512.62C162.575 512.641 155.968 512.645 149.362 512.626C145.99 512.617 142.62 512.618 139.249 512.636C135.594 512.654 131.941 512.642 128.287 512.621C127.221 512.634 126.156 512.646 125.058 512.659C124.077 512.647 123.095 512.636 122.084 512.624C121.241 512.624 120.398 512.624 119.53 512.624C115.871 511.721 113.326 509.9 111 507C110.022 503.548 110.022 503.548 109.706 499.64C109.642 498.937 109.577 498.234 109.511 497.509C109.316 495.341 109.158 493.171 109 491C108.885 489.754 108.771 488.507 108.653 487.223C108.303 483.403 107.995 479.58 107.697 475.755C107.58 474.294 107.462 472.833 107.345 471.371C107.027 467.406 106.713 463.441 106.401 459.475C106.061 455.179 105.717 450.883 105.374 446.588C104.704 438.193 104.038 429.799 103.374 421.404C102.833 414.579 102.292 407.754 101.749 400.929C101.633 399.468 101.633 399.468 101.514 397.977C101.357 395.998 101.2 394.019 101.042 392.04C99.57 373.517 98.1022 354.995 96.6359 336.472C95.2955 319.542 93.9497 302.612 92.6012 285.682C91.2144 268.271 89.831 250.859 88.4516 233.447C87.6779 223.682 86.903 213.918 86.1244 204.154C85.462 195.847 84.803 187.539 84.1482 179.232C83.8144 174.997 83.4791 170.763 83.1396 166.529C82.8284 162.647 82.5217 158.765 82.2183 154.882C82.1083 153.484 81.9967 152.086 81.8834 150.688C81.2154 142.438 80.8551 134.277 81 126C79.6522 126.058 79.6522 126.058 78.2771 126.117C74.6436 126.264 71.0104 126.35 67.375 126.437C65.4472 126.525 65.4472 126.525 63.4805 126.615C54.2503 126.783 54.2503 126.783 50.7979 124.622C47.5938 121.143 46.138 117.773 46 113C46.9512 94.4964 55.3763 77.4934 69 65C80.6404 55.837 93.9684 49.8129 108.911 49.8864C110.083 49.8862 110.083 49.8862 111.278 49.886C113.848 49.8867 116.418 49.8945 118.988 49.9023C120.775 49.9042 122.561 49.9056 124.348 49.9066C129.041 49.9104 133.735 49.9202 138.428 49.9313C143.221 49.9415 148.014 49.9461 152.807 49.9511C162.204 49.9619 171.602 49.9789 181 50C180.986 49.1224 180.972 48.2449 180.958 47.3408C180.948 46.1816 180.937 45.0224 180.926 43.8281C180.912 42.6824 180.898 41.5368 180.884 40.3564C181.265 29.3282 187.078 18.5387 195 11C207.341 0.557981 219.963 -0.622859 235.434 -0.566442ZM206.5 30.9375C202.094 37.6084 202 41.6391 202 50C237.64 50 273.28 50 310 50C310 41.3632 309.586 34.8192 303.6 28.3716C295.307 21.2612 286.005 21.2569 275.625 21.3359C274.049 21.3325 272.473 21.3277 270.897 21.3214C267.609 21.3141 264.321 21.3246 261.033 21.3481C256.844 21.3766 252.656 21.3602 248.466 21.3302C245.216 21.3121 241.966 21.318 238.716 21.3309C237.173 21.3342 235.629 21.3302 234.086 21.3185C223.17 21.2536 213.795 21.9913 206.5 30.9375ZM74.5352 90.6523C72.2319 94.1746 70.7093 98.1541 69 102C192.09 102.33 315.18 102.66 442 103C437.187 90.1653 429.9 82.1772 417.723 76.0781C409.964 73.0057 402.884 72.7102 394.622 72.7325C393.387 72.728 392.152 72.7235 390.88 72.7188C387.468 72.7084 384.057 72.7068 380.646 72.7092C376.96 72.7096 373.274 72.6986 369.588 72.6891C362.372 72.6725 355.157 72.667 347.941 72.6659C342.073 72.6649 336.204 72.6608 330.336 72.6544C313.682 72.6368 297.028 72.6276 280.374 72.6291C279.476 72.6292 278.579 72.6293 277.655 72.6294C276.757 72.6294 275.859 72.6295 274.933 72.6296C260.383 72.6304 245.833 72.6113 231.283 72.5831C216.327 72.5543 201.371 72.5405 186.415 72.5423C178.025 72.5429 169.634 72.5375 161.244 72.5159C154.099 72.4977 146.955 72.4934 139.81 72.5069C136.169 72.5134 132.528 72.5137 128.887 72.4962C124.929 72.4775 120.971 72.4901 117.013 72.5055C115.877 72.4952 114.741 72.4849 113.571 72.4743C97.4472 72.6121 85.1836 78.6966 74.5352 90.6523ZM103 125C103.591 136.822 104.197 148.586 105.139 160.375C105.25 161.802 105.362 163.228 105.473 164.655C105.774 168.505 106.079 172.356 106.384 176.206C106.715 180.384 107.042 184.562 107.37 188.741C108.01 196.894 108.653 205.046 109.297 213.199C109.821 219.821 110.343 226.444 110.865 233.066C110.939 234.012 111.014 234.958 111.091 235.932C111.242 237.854 111.393 239.776 111.545 241.698C112.96 259.659 114.378 277.62 115.798 295.581C117.098 312.022 118.393 328.464 119.686 344.906C121.015 361.809 122.347 378.713 123.683 395.616C124.432 405.098 125.18 414.58 125.925 424.063C126.557 432.12 127.193 440.177 127.833 448.233C128.159 452.345 128.484 456.456 128.805 460.568C129.099 464.327 129.396 468.085 129.697 471.843C129.857 473.856 130.013 475.87 130.169 477.884C130.312 479.658 130.312 479.658 130.458 481.469C130.539 482.496 130.62 483.523 130.704 484.582C130.864 487.007 130.864 487.007 132 489C213.84 489 295.68 489 380 489C381.309 486.381 381.336 484.173 381.576 481.248C381.679 480.016 381.782 478.783 381.888 477.514C381.999 476.134 382.11 474.754 382.221 473.374C382.341 471.918 382.462 470.462 382.583 469.005C382.915 464.99 383.242 460.973 383.568 456.957C383.92 452.631 384.277 448.305 384.633 443.979C385.331 435.497 386.024 427.015 386.716 418.533C387.279 411.638 387.843 404.744 388.408 397.849C388.488 396.869 388.569 395.89 388.652 394.88C388.815 392.889 388.978 390.899 389.141 388.908C390.586 371.287 392.027 353.665 393.466 336.043C394.862 318.942 396.261 301.84 397.665 284.739C399.192 266.129 400.717 247.519 402.239 228.909C402.401 226.924 402.563 224.939 402.726 222.954C402.806 221.977 402.885 221 402.968 219.994C403.531 213.11 404.095 206.227 404.66 199.344C405.349 190.951 406.035 182.558 406.718 174.165C407.067 169.882 407.417 165.6 407.77 161.318C408.092 157.396 408.412 153.474 408.73 149.552C408.845 148.134 408.961 146.717 409.079 145.3C409.239 143.369 409.395 141.438 409.55 139.507C409.637 138.436 409.725 137.365 409.815 136.261C410.028 132.513 410 128.754 410 125C308.69 125 207.38 125 103 125Z" fill="var(--tg-theme-text-color)"/>
                        <path d="M164.375 166.562C165.469 166.503 165.469 166.503 166.586 166.441C170.18 167.273 172.656 169.233 175 172C175.752 174.824 176.099 176.937 176.246 179.794C176.309 180.576 176.373 181.359 176.438 182.165C176.575 183.875 176.699 185.586 176.814 187.297C177.003 190.04 177.235 192.775 177.481 195.513C178.04 201.773 178.552 208.036 179.063 214.299C179.26 216.691 179.457 219.083 179.655 221.475C180.186 227.916 180.714 234.358 181.241 240.799C181.571 244.83 181.902 248.86 182.233 252.89C182.316 253.898 182.316 253.898 182.401 254.927C182.513 256.293 182.625 257.659 182.738 259.025C183.786 271.778 184.83 284.531 185.874 297.285C186.827 308.937 187.785 320.589 188.744 332.241C189.733 344.241 190.718 356.241 191.701 368.241C192.251 374.965 192.803 381.688 193.357 388.411C193.878 394.723 194.394 401.036 194.909 407.349C195.098 409.663 195.288 411.976 195.479 414.29C195.741 417.451 195.998 420.613 196.254 423.776C196.331 424.687 196.407 425.597 196.486 426.536C197.693 441.644 197.693 441.644 195.5 445.938C192.176 448.68 189.286 449.688 185 450C181.363 449.404 178.979 448.997 176.367 446.336C174.577 443.277 174.323 440.779 173.941 437.254C173.865 436.56 173.788 435.866 173.708 435.152C172.595 424.768 171.784 414.352 170.937 403.944C170.74 401.554 170.543 399.164 170.345 396.774C169.868 390.995 169.394 385.216 168.922 379.437C168.538 374.737 168.153 370.038 167.767 365.339C167.684 364.331 167.684 364.331 167.599 363.302C167.487 361.936 167.375 360.57 167.262 359.204C166.214 346.443 165.169 333.681 164.126 320.918C163.233 309.986 162.335 299.055 161.435 288.124C160.387 275.394 159.341 262.664 158.299 249.934C158.188 248.576 158.077 247.217 157.966 245.858C157.911 245.19 157.856 244.522 157.8 243.833C157.416 239.141 157.03 234.448 156.643 229.756C156.122 223.438 155.605 217.119 155.091 210.8C154.903 208.486 154.712 206.171 154.521 203.856C154.259 200.691 154.002 197.524 153.746 194.358C153.669 193.449 153.593 192.539 153.514 191.602C152.256 175.787 152.256 175.787 154.25 171C157.128 167.711 160.055 166.691 164.375 166.562Z" fill="var(--tg-theme-text-color)"/>
                        <path d="M352 167C356.098 169.354 357.695 171.522 359 176C359.148 179.107 358.95 182.173 358.745 185.274C358.666 186.658 358.666 186.658 358.585 188.07C357.916 199.262 357.003 210.437 356.082 221.611C355.888 224 355.694 226.389 355.5 228.778C354.979 235.197 354.453 241.615 353.926 248.033C353.596 252.048 353.268 256.063 352.939 260.078C351.852 273.376 350.762 286.674 349.667 299.971C349.609 300.683 349.55 301.396 349.489 302.13C349.431 302.844 349.372 303.557 349.312 304.293C348.356 315.904 347.408 327.517 346.464 339.13C345.491 351.09 344.513 363.05 343.528 375.009C342.977 381.709 342.427 388.41 341.885 395.111C341.375 401.395 340.859 407.679 340.336 413.963C340.145 416.27 339.957 418.577 339.772 420.884C339.52 424.029 339.258 427.172 338.993 430.315C338.922 431.231 338.85 432.148 338.777 433.092C338.293 438.684 337.878 443.122 333.75 447.25C330.61 449.248 328.72 449.924 325 450C320.233 448.475 318.157 446.349 315.784 441.975C314.475 438.679 314.77 435.525 315.13 432.083C315.192 431.31 315.254 430.537 315.318 429.74C315.455 428.05 315.602 426.36 315.757 424.672C316.005 421.946 316.218 419.219 316.422 416.489C316.893 410.213 317.405 403.941 317.918 397.669C318.112 395.274 318.306 392.879 318.5 390.484C319.022 384.034 319.548 377.584 320.074 371.135C320.403 367.101 320.732 363.067 321.061 359.032C321.973 347.836 322.885 336.64 323.802 325.443C323.86 324.731 323.918 324.018 323.978 323.284C324.037 322.569 324.095 321.855 324.155 321.119C324.274 319.672 324.392 318.225 324.51 316.779C324.569 316.061 324.628 315.343 324.688 314.604C325.643 302.938 326.591 291.272 327.536 279.605C328.509 267.593 329.488 255.582 330.472 243.571C331.023 236.84 331.572 230.109 332.115 223.378C332.625 217.059 333.142 210.742 333.664 204.424C333.854 202.107 334.042 199.79 334.228 197.472C334.481 194.309 334.743 191.146 335.007 187.984C335.078 187.067 335.15 186.15 335.223 185.206C336.264 173.052 336.264 173.052 340.062 168.563C344.117 166.406 347.499 166.191 352 167Z" fill="var(--tg-theme-text-color)"/>
                        <path d="M260 166C262.975 167.776 265.428 169.855 267 173C267.097 174.474 267.131 175.953 267.134 177.43C267.139 178.368 267.143 179.305 267.148 180.271C267.148 181.308 267.147 182.344 267.147 183.412C267.151 184.508 267.154 185.604 267.158 186.734C267.169 190.431 267.173 194.128 267.177 197.825C267.183 200.466 267.19 203.107 267.197 205.748C267.217 213.69 267.227 221.633 267.236 229.576C267.24 233.315 267.245 237.054 267.251 240.793C267.268 253.22 267.282 265.647 267.289 278.073C267.291 281.299 267.293 284.525 267.295 287.751C267.296 288.552 267.296 289.354 267.297 290.18C267.305 303.171 267.33 316.161 267.363 329.151C267.396 342.483 267.414 355.815 267.417 369.147C267.419 376.634 267.428 384.122 267.453 391.609C267.475 397.985 267.483 404.361 267.473 410.738C267.469 413.991 267.473 417.244 267.49 420.498C267.508 424.025 267.501 427.552 267.488 431.08C267.499 432.108 267.51 433.135 267.521 434.194C267.467 440.102 266.937 443.497 263 448C260.429 449.532 257.981 449.922 255 450C251.217 448.946 248.9 448.047 246.325 445.052C244.339 440.478 244.58 436.163 244.606 431.227C244.599 430.128 244.593 429.03 244.587 427.898C244.57 424.21 244.575 420.522 244.58 416.834C244.573 414.193 244.564 411.552 244.554 408.911C244.533 402.477 244.529 396.043 244.531 389.61C244.532 384.381 244.528 379.151 244.521 373.922C244.519 372.416 244.516 370.91 244.514 369.404C244.513 368.654 244.512 367.904 244.511 367.132C244.492 352.954 244.493 338.777 244.5 324.599C244.506 311.628 244.485 298.657 244.452 285.687C244.418 272.368 244.403 259.05 244.408 245.731C244.41 238.254 244.405 230.777 244.38 223.299C244.359 216.934 244.355 210.569 244.374 204.204C244.383 200.956 244.381 197.709 244.364 194.462C244.345 190.941 244.358 187.421 244.379 183.9C244.366 182.874 244.353 181.849 244.341 180.792C244.397 176.278 244.488 173.01 247.351 169.381C251.389 165.751 254.685 165.46 260 166Z" fill="var(--tg-theme-text-color)"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_238_161">
                            <rect width="512" height="512" fill="var(--tg-theme-bg-color)"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>
        </div>
    </div>`;
}

/***/ }),

/***/ "./assets/js/templates/categoryItems.js":
/*!**********************************************!*\
  !*** ./assets/js/templates/categoryItems.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   categoryItem: () => (/* binding */ categoryItem),
/* harmony export */   categoryItems: () => (/* binding */ categoryItems)
/* harmony export */ });
function categoryItem({
  id,
  name,
  parent
}, checked = false) {
  return `<label>
        ${name}
        <input class="category-item" name="category" type="radio" value="${id}" data-name="${name}" ${checked ? 'checked' : ''}>
    </label>`;
}
function categoryItems(html) {
  if (!html) {
    return '';
  }
  return `<div class="category-item-wrap">${html}</div>`;
}

/***/ }),

/***/ "./assets/js/templates/customer.js":
/*!*****************************************!*\
  !*** ./assets/js/templates/customer.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   customerTemplate: () => (/* binding */ customerTemplate),
/* harmony export */   stateTemplate: () => (/* binding */ stateTemplate)
/* harmony export */ });
function optionTemplate(obj, select) {
  let out = '';
  for (let key in obj) {
    let value = obj[key];
    out += `<option value="${key}" ${select == key ? 'selected' : ''} >
                ${value}
            </option>`;
  }
  return out;
}
function stateTemplate(country, state, needShipping) {
  let states = appData.states[country] || false;
  return `${states ? `<select class="js-state" name="state">
            ${optionTemplate(states, state)}
        </select>` : `<input class="js-state" name="state" placeholder="State" value="${state}" ${needShipping ? 'required' : ''}>`}`;
}
function customerTemplate(data) {
  if (!data || !data.shipping_address) {
    return '';
  }
  return `
    <input name="first_name" type="text" placeholder="First name" value="${data.shipping_address.first_name}" required>
    <input name="last_name" type="text" placeholder="Last name" value="${data.shipping_address.last_name}" required>
    <!-- <input name="company" placeholder="Company name (optional)"> -->

    <select class="js-country" name="country" ${data.needs_shipping ? 'required' : ''}>
        ${optionTemplate(appData.countries, data.shipping_address.country)}
    </select> 

    <input name="address_1" placeholder="Street address" value="${data.shipping_address.address_1}" ${data.needs_shipping ? 'required' : ''}>
    <!-- <input name="address_2" placeholder="Street address 2"> -->

    <input name="city" placeholder="Town / City" value="${data.shipping_address.city}" ${data.needs_shipping ? 'required' : ''}>

    ${stateTemplate(data.shipping_address.country, data.shipping_address.state, data.needs_shipping)}
    
    <input name="postcode" placeholder="ZIP Code" value="${data.shipping_address.postcode}" ${data.needs_shipping ? 'required' : ''}>
    <input name="phone" placeholder="Phone" value="${data.billing_address.phone}">
    <input name="email" placeholder="Email address" value="${data.billing_address.email}">`;
}

/***/ }),

/***/ "./assets/js/templates/icons/done.js":
/*!*******************************************!*\
  !*** ./assets/js/templates/icons/done.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ doneTemplate)
/* harmony export */ });
function doneTemplate() {
  return `
        <div class="done-elem">
            <svg viewBox="0 0 380 278" xmlns="http://www.w3.org/2000/svg">
                <path d="M334.418 7.68626L128.155 213.938L44.7775 130.578C34.5315 120.344 17.9335 120.338 7.6875 130.584C-2.5625 140.834 -2.5625 157.434 7.6875 167.68L109.613 269.59C114.735 274.706 121.445 277.266 128.155 277.266C134.865 277.266 141.594 274.706 146.714 269.582C146.73 269.56 146.741 269.538 146.767 269.512L371.506 44.7763C381.756 34.5363 381.756 17.9242 371.506 7.68424C361.262 -2.56176 344.652 -2.56174 334.418 7.68626Z"/>
            </svg>
        </div>
    `;
}

/***/ }),

/***/ "./assets/js/templates/icons/loading.js":
/*!**********************************************!*\
  !*** ./assets/js/templates/icons/loading.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ loadingTemplate)
/* harmony export */ });
function loadingTemplate() {
  return `
        <div class="loading-elem">
            <svg viewBox="0 0 700 700" xmlns="http://www.w3.org/2000/svg">
                <path d="M350 0C356.63 0 362.989 2.63392 367.678 7.32233C372.366 12.0107 375 18.3696 375 25V175C375 181.63 372.366 187.989 367.678 192.678C362.989 197.366 356.63 200 350 200C343.37 200 337.011 197.366 332.322 192.678C327.634 187.989 325 181.63 325 175V25C325 18.3696 327.634 12.0107 332.322 7.32233C337.011 2.63392 343.37 0 350 0ZM350 500C356.63 500 362.989 502.634 367.678 507.322C372.366 512.011 375 518.37 375 525V675C375 681.63 372.366 687.989 367.678 692.678C362.989 697.366 356.63 700 350 700C343.37 700 337.011 697.366 332.322 692.678C327.634 687.989 325 681.63 325 675V525C325 518.37 327.634 512.011 332.322 507.322C337.011 502.634 343.37 500 350 500ZM700 350C700 356.63 697.366 362.989 692.678 367.678C687.989 372.366 681.63 375 675 375H525C518.37 375 512.011 372.366 507.322 367.678C502.634 362.989 500 356.63 500 350C500 343.37 502.634 337.011 507.322 332.322C512.011 327.634 518.37 325 525 325H675C681.63 325 687.989 327.634 692.678 332.322C697.366 337.011 700 343.37 700 350ZM200 350C200 356.63 197.366 362.989 192.678 367.678C187.989 372.366 181.63 375 175 375H25C18.3696 375 12.0107 372.366 7.32233 367.678C2.63392 362.989 0 356.63 0 350C0 343.37 2.63392 337.011 7.32233 332.322C12.0107 327.634 18.3696 325 25 325H175C181.63 325 187.989 327.634 192.678 332.322C197.366 337.011 200 343.37 200 350ZM102.5 102.5C107.188 97.8132 113.546 95.1803 120.175 95.1803C126.804 95.1803 133.162 97.8132 137.85 102.5L244 208.6C248.554 213.315 251.074 219.63 251.017 226.185C250.96 232.74 248.331 239.01 243.695 243.645C239.06 248.281 232.79 250.91 226.235 250.967C219.68 251.024 213.365 248.504 208.65 243.95L102.5 137.85C97.8132 133.162 95.1803 126.804 95.1803 120.175C95.1803 113.546 97.8132 107.188 102.5 102.5ZM456.05 456.05C460.738 451.363 467.096 448.73 473.725 448.73C480.354 448.73 486.712 451.363 491.4 456.05L597.5 562.15C602.054 566.865 604.574 573.18 604.517 579.735C604.46 586.29 601.831 592.56 597.195 597.195C592.56 601.831 586.29 604.46 579.735 604.517C573.18 604.574 566.865 602.054 562.15 597.5L456.05 491.4C451.363 486.712 448.73 480.354 448.73 473.725C448.73 467.096 451.363 460.738 456.05 456.05ZM597.5 102.55C602.171 107.236 604.795 113.583 604.795 120.2C604.795 126.817 602.171 133.164 597.5 137.85L491.4 244C486.685 248.554 480.37 251.074 473.815 251.017C467.26 250.96 460.99 248.331 456.355 243.695C451.719 239.06 449.09 232.79 449.033 226.235C448.976 219.68 451.496 213.365 456.05 208.65L562.15 102.55C566.838 97.8632 573.196 95.2303 579.825 95.2303C586.454 95.2303 592.812 97.8632 597.5 102.55ZM243.95 456.05C248.637 460.738 251.27 467.096 251.27 473.725C251.27 480.354 248.637 486.712 243.95 491.4L137.85 597.5C133.135 602.054 126.82 604.574 120.265 604.517C113.71 604.46 107.44 601.831 102.805 597.195C98.1693 592.56 95.5401 586.29 95.4831 579.735C95.4262 573.18 97.946 566.865 102.5 562.15L208.6 456.05C213.288 451.363 219.646 448.73 226.275 448.73C232.904 448.73 239.262 451.363 243.95 456.05Z"/>
            </svg>
        </div>
    `;
}

/***/ }),

/***/ "./assets/js/templates/listItem.js":
/*!*****************************************!*\
  !*** ./assets/js/templates/listItem.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listItem)
/* harmony export */ });
function listItem({
  id,
  name,
  images,
  add_to_cart: addToCart,
  price_html: priceHtml,
  type
}) {
  let listItemButton;
  switch (type) {
    case 'simple':
      listItemButton = `<button class="list-item-incr-button js-item-incr-btn" data-default-text="${addToCart.text}">
                    ${addToCart.text}
                </button>`;
      break;
    case 'external':
      listItemButton = `<a class="external-item-btn"  href="${addToCart.url}" target="_blank" rel="noopener noreferrer">
                    Link
                </a>`;
      break;
    default:
      listItemButton = `<button class="list-item-incr-button js-item-sel-opt" data-default-text="${addToCart.text}">
                    ${addToCart.text}
                </button>`;
      break;
  }
  return `<div class="list-item js-item" data-item-id="${id}" data-item-count="0">
        <div class="list-item-counter js-item-counter">0</div>
        <div class="list-item-photo">
            <img src="${images[0]?.src ?? appData.placeHolder}" alt="${images[0]?.alt}">
        </div>
        <div class="list-item-label">
            <p class="list-item-title">${name}</p>
            ${priceHtml ? `<p class="list-item-price">${priceHtml}</p>` : ''}
        </div>
        <div class="list-item-buttons">
            <!---<button class="list-item-decr-button js-item-decr-btn">
				<span class="button-item-label">remove</span>
			</button>--->
			${listItemButton}
        </div>
    </div>`;
}

/***/ }),

/***/ "./assets/js/templates/productItem.js":
/*!********************************************!*\
  !*** ./assets/js/templates/productItem.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ productItem)
/* harmony export */ });
function productItem({
  id,
  name,
  images,
  description,
  add_to_cart: addToCart,
  price_html: priceHtml,
  type,
  attributes
}) {
  return `
        <div class="product-item js-pr-item" data-item-id="${id}" data-item-count="0" data-item-type="${type}">
            <div class="product-item-photo">
                <img src="${images[0]?.src ?? appData.placeHolder}" alt="${images[0]?.alt}">
            </div>
            <div class="product-item-main">
                <div class="product-item-label">
                    <h1 class="product-item-title">${name}</h1>
                    <span class="product-item-price">${priceHtml}</span>
                </div>
            
                <div class="product-item-descriptions">
                    ${description}
                </div>
                
                ${type === 'variable' ? `<div class="variations-wrapper">
                ${attributes.map(attribute => `
                    <div class="variations">
                    <label for="${attribute.taxonomy}">${attribute.name}</label>
                        <select id="${attribute.taxonomy ? attribute.taxonomy : attribute.name}" data-item-name="${attribute.name}" class="product-item-variations" 
                            name="attribute_${attribute.taxonomy ? attribute.taxonomy : attribute.name}" data-attribute_name="attribute_${attribute.taxonomy ? attribute.taxonomy : attribute.name}" data-show_option_none="yes">
                            <option value="">SELECT ${attribute.name.toUpperCase()}</option>
                            ${attribute.terms.map(term => `
                                <option value="${term.slug}" class="attached enabled">${term.name}</option>
                            `).join('')}
                        </select>
                    </div>`).join('')}
                </div>` : ''}
                <div class="product-item-buttons">
                <div class="product-item-success">"${name}" has been added to your cart.</div>
                <p class="product-item-notice" style="opacity: 0%">N\D</p>
                <div class="product-item-quantity">
                    <button class="btn-product js-pr-item-minus">–</button>
                    <input class="product-item-number" type="number" step="1" min="${addToCart.minimum}" max="${addToCart.maximum}" value="${addToCart.minimum}">
                    <button class="btn-product js-pr-item-plus">+</button>
                </div>
                <button class="button-item-label js-pr-item-incr-btn btn-item-product-active" data-default-text="Add to cart">
                    Add to cart
                </button>
            </div>
            </div>
        </div>`;
}

/***/ }),

/***/ "./assets/js/templates/shipping.js":
/*!*****************************************!*\
  !*** ./assets/js/templates/shipping.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ shipping)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions */ "./assets/js/functions.js");

function shipping(data) {
  if (!data || !data?.shipping_rates[0]?.shipping_rates.length) {
    return `No shipping options available`;
  }
  return data.shipping_rates[0].shipping_rates.map(rate => {
    const {
      rate_id,
      selected,
      name,
      price
    } = rate;
    return `<div class="shipping-option">
        <input type="radio" id="label_for_${rate_id}" name="rate_id" value="${rate_id}" ${selected ? 'checked' : ''} />
        <label for="label_for_${rate_id}">${name} ${(0,_functions__WEBPACK_IMPORTED_MODULE_0__.wc_price)(price, rate)}</label>
    </div>`;
  }).join('');
}

/***/ }),

/***/ "./assets/js/templates/total.js":
/*!**************************************!*\
  !*** ./assets/js/templates/total.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ total)
/* harmony export */ });
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../functions */ "./assets/js/functions.js");

function total(data) {
  if (!data || !data?.totals || !data?.shipping_rates || !data?.shipping_address) {
    return '';
  }
  let {
    totals,
    shipping_rates,
    shipping_address
  } = data;
  const shippingOption = shipping_rates[0]?.shipping_rates.find(rate => rate.selected);
  return `
    <hr>
    <div>
        <h4>
            Subtotal
        </h4>
        <p>
            ${(0,_functions__WEBPACK_IMPORTED_MODULE_0__.wc_price)(totals.total_items, totals)}
        </p>
    </div>
    ${shipping_rates[0]?.shipping_rates.length > 0 ? `
        <p>
            Shipping to ${[shipping_address.postcode, shipping_address.city, shipping_address.state, shipping_address.country].filter(Boolean).join(', ')}
        </p>
    ` : ''}
    ${shipping_rates[0]?.shipping_rates.length > 0 ? `
    <div>
        <h4>
            Shipping
            <br>
            <span>${shippingOption.name}</span>
        </h4>
        <p>
            ${(0,_functions__WEBPACK_IMPORTED_MODULE_0__.wc_price)(shippingOption.price, shippingOption)}
        </p>
        </div>
    ` : ''}
    ${totals.tax_lines.map(({
    name,
    price
  }) => {
    return `
            <div>
                <h4>
                    ${name}
                </h4>
                <p>
                    ${(0,_functions__WEBPACK_IMPORTED_MODULE_0__.wc_price)(price, totals)}
                </p>
            </div>
        `;
  }).join('')}
    <hr>
    <div class="total-details-total">
        <h3>
            Total
        </h3>
        <p>
            ${(0,_functions__WEBPACK_IMPORTED_MODULE_0__.wc_price)(totals.total_price, totals)}
        </p>
    </div>
    `;
}

/***/ }),

/***/ "./assets/js/currencies.json":
/*!***********************************!*\
  !*** ./assets/js/currencies.json ***!
  \***********************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"AED":367,"AFN":6669,"ALL":9055,"AMD":38711,"ARS":97951,"AUD":150,"AZN":170,"BAM":180,"BDT":11969,"BGN":180,"BHD":377,"BND":131,"BOB":695,"BRL":565,"BYN":328,"CAD":138,"CHF":86,"CLP":940,"CNY":712,"COP":424400,"CRC":51526,"CZK":2320,"DKK":686,"DOP":6031,"DZD":13348,"EGP":4857,"ETB":11970,"EUR":92,"GBP":77,"GEL":272,"GHS":1596,"GTQ":774,"HKD":777,"HNL":2510,"HRK":689,"HUF":36773,"IDR":1551500,"ILS":376,"INR":8406,"IQD":1312094,"IRR":4209000,"ISK":137,"JMD":15876,"JOD":709,"JPY":149,"KES":12921,"KGS":8549,"KRW":1363,"KZT":48861,"LBP":8968941,"LKR":29367,"MAD":986,"MDL":1769,"MMK":324796,"MNT":339800,"MOP":801,"MUR":4635,"MVR":1536,"MXN":1969,"MYR":429,"MZN":6391,"NGN":163628,"NIO":3683,"NOK":1084,"NPR":13467,"NZD":165,"PAB":100,"PEN":377,"PHP":5774,"PKR":27770,"PLN":395,"PYG":7845,"QAR":364,"RON":457,"RSD":10753,"RUB":10238,"SAR":375,"SEK":1043,"SGD":131,"SYP":251253,"THB":3331,"TJS":1065,"TRY":3423,"TTD":680,"TWD":3218,"TZS":272533,"UAH":4126,"UGX":3675,"USD":100,"UYU":4162,"UZS":1280500,"VEF":362255253,"VND":25000,"YER":25040,"ZAR":1759}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**************************!*\
  !*** ./assets/js/app.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _List_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./List.js */ "./assets/js/List.js");
/* harmony import */ var _Cart_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Cart.js */ "./assets/js/Cart.js");
/* harmony import */ var _Checkout_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Checkout.js */ "./assets/js/Checkout.js");
/* harmony import */ var _Order_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Order.js */ "./assets/js/Order.js");
/* harmony import */ var _Product_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Product.js */ "./assets/js/Product.js");
/* harmony import */ var _Thankyou_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Thankyou.js */ "./assets/js/Thankyou.js");
/* harmony import */ var _Autocomplete_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Autocomplete.js */ "./assets/js/Autocomplete.js");
/* harmony import */ var _Category_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Category.js */ "./assets/js/Category.js");
/* harmony import */ var _Filters_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Filters.js */ "./assets/js/Filters.js");
/* harmony import */ var _Buttons_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Buttons.js */ "./assets/js/Buttons.js");










class App {
  constructor() {
    this.tg = window.Telegram.WebApp;
    this.list = new _List_js__WEBPACK_IMPORTED_MODULE_0__["default"](this);
    this.cart = new _Cart_js__WEBPACK_IMPORTED_MODULE_1__["default"](this);
    this.checkout = new _Checkout_js__WEBPACK_IMPORTED_MODULE_2__["default"](this);
    this.order = new _Order_js__WEBPACK_IMPORTED_MODULE_3__["default"](this);
    this.product = new _Product_js__WEBPACK_IMPORTED_MODULE_4__["default"](this);
    this.thankyou = new _Thankyou_js__WEBPACK_IMPORTED_MODULE_5__["default"](this);
    this.autocomplete = new _Autocomplete_js__WEBPACK_IMPORTED_MODULE_6__["default"](this);
    this.category = new _Category_js__WEBPACK_IMPORTED_MODULE_7__["default"](this);
    this.filters = new _Filters_js__WEBPACK_IMPORTED_MODULE_8__["default"](this);
    this.buttons = new _Buttons_js__WEBPACK_IMPORTED_MODULE_9__["default"](this);
    this.pages = {
      list: this.list,
      cart: this.cart,
      category: this.category,
      checkout: this.checkout,
      order: this.order,
      product: this.product,
      thankyou: this.thankyou
    };
  }
  start() {
    this.show('list');
    // this.show('product', 570);
  }
  async show(page, params) {
    console.log('show', page, params);
    if (this.pages[page] && (await this.pages[page].show(params))) {
      console.log('show ok ', page);
      this.buttons.switch(page);
      document.querySelector('.pages .open')?.classList.remove('open');
      document.querySelector(`.pages .${page}`)?.classList.add('open');
    }
  }
}
new App().start();
/******/ })()
;
//# sourceMappingURL=app.min.js.map