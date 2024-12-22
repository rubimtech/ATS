document.addEventListener('DOMContentLoaded', function () {
    const settingsForm = document.querySelector('.tgshop_settings');
    const botTokenInput = document.getElementById('telegram_bot_token');
    const telegramTokenSpinner = settingsForm.querySelector('.telegram-token-spinner');
    const paymentTokenSpinner = settingsForm.querySelector('.payment-token-spinner');
    const initialTokenValue = botTokenInput?.value;
    const newPaymentTokenRow = settingsForm.querySelector('.new-payment-token')?.cloneNode(true);
    var paymentTokensIndex = settingsForm.querySelector('.payment-tokens tbody')?.childElementCount - 2;

    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const xhr = new XMLHttpRequest();

        const formData = new FormData(settingsForm);

        const btnName = e.submitter.name;
        if (btnName === 'save-token') {
            telegramTokenSpinner.classList.add('is-active');
            formData.append('action', 'telegram_shop_save_token');
            xhr.onload = () => {
                const response = JSON.parse(xhr.response);
                if (response.success) {
                    settingsForm.querySelector('.activate-shop-button').style.display = '';
                    document.getElementById('telegram_token_result').classList.remove('error');
                    document.getElementById('telegram_token_result').classList.add('updated');
                } else {
                    settingsForm.querySelector('.activate-shop-button').style.display = 'none';
                    document.getElementById('telegram_token_result').classList.remove('updated');
                    document.getElementById('telegram_token_result').classList.add('error');
                }
                settingsForm.querySelector('.shop-actions-row').style.display = 'none';
                document.getElementById('telegram_token_result').innerHTML = response.data.message;

                telegramTokenSpinner.classList.remove('is-active');
            }
        } else if (btnName === 'activate-shop') {
            telegramTokenSpinner.classList.add('is-active');
            formData.append('action', 'telegram_shop_activate_shop');
            xhr.onload = () => {
                const response = JSON.parse(xhr.response);
                if (response.success) {
                    settingsForm.querySelector('.activate-shop-button').style.display = 'none';
                    settingsForm.querySelector('.shop-actions-row').style.display = '';
                    document.getElementById('open_shop_btn').dataset.url = response.data.shopUrl;
                    document.getElementById('copy_shop_url_btn').dataset.url = response.data.shopUrl;
                    document.getElementById('telegram_token_result').classList.remove('error');
                    document.getElementById('telegram_token_result').classList.add('updated');
                } else {
                    document.getElementById('telegram_token_result').classList.remove('updated');
                    document.getElementById('telegram_token_result').classList.add('error');
                }
                document.getElementById('telegram_token_result').innerHTML = response.data.message;

                telegramTokenSpinner.classList.remove('is-active');
            }
        } else if (btnName === 'deactivate-shop') {
            telegramTokenSpinner.classList.add('is-active');
            formData.append('action', 'telegram_shop_deactivate_shop');
            xhr.onload = () => {
                const response = JSON.parse(xhr.response);
                if (response.success) {
                    settingsForm.querySelector('.activate-shop-button').style.display = '';
                    settingsForm.querySelector('.shop-actions-row').style.display = 'none';
                    document.getElementById('telegram_token_result').classList.remove('error');
                    document.getElementById('telegram_token_result').classList.add('updated');
                } else {
                    document.getElementById('telegram_token_result').classList.remove('updated');
                    document.getElementById('telegram_token_result').classList.add('error');
                }
                document.getElementById('telegram_token_result').innerHTML = response.data.message;

                telegramTokenSpinner.classList.remove('is-active');
            }
        } else if (btnName === 'save-payment-tokens') {
            paymentTokenSpinner.classList.add('is-active');
            formData.append('action', 'telegram_shop_save_payment_tokens');
            xhr.onload = () => {
                const response = JSON.parse(xhr.response);
                if (response.success) {
                    document.getElementById('payment_token_result').classList.remove('error');
                    document.getElementById('payment_token_result').classList.add('updated');
                } else {
                    document.getElementById('payment_token_result').classList.remove('updated');
                    document.getElementById('payment_token_result').classList.add('error');
                }
                document.getElementById('payment_token_result').innerHTML = response.data.message;
                document.getElementById('payment_tokens_container').innerHTML = response.data.paymentTokensHtml;
                addDeletePaymentTokenHandlers();

                paymentTokenSpinner.classList.remove('is-active');
            }
        }

        xhr.open('POST', ajaxurl);
        xhr.send(formData);
    });

    document.getElementById('telegram_bot_token')?.addEventListener('input', (e) => {
        if (e.target.value !== initialTokenValue) {
            settingsForm.querySelector('.activate-shop-button').style.display = 'none';
        } else {
            settingsForm.querySelector('.activate-shop-button').style.display = '';
        }
    });

    document.getElementById('open_shop_btn')?.addEventListener('click', (e) => {
        const url = e.target.dataset.url;
        window.open(url, '_blank');
    });

    document.getElementById('copy_shop_url_btn')?.addEventListener('click', async (e) => {
        const url = e.target.dataset.url;
        await navigator.clipboard.writeText(url);
    });

    const deletePaymentTokenHandler = (e) => {
        const paymentTokenRow = e.target.closest('tr');
        paymentTokenRow.remove();
        paymentTokensIndex--;
        if (paymentTokensIndex === 0) {
            settingsForm.querySelector('.payment-tokens').classList.toggle('empty-payment-tokens');
            document.getElementById('empty_payment_tokens_message').style.display = '';
        }
    }

    const addDeletePaymentTokenHandlers = () => {
        const deletePaymentTokenButtons = settingsForm.querySelectorAll('.delete-payment-token');
        deletePaymentTokenButtons.forEach((button) => {
            button.addEventListener('click', deletePaymentTokenHandler);
        })
    }

    document.getElementById('add_payment_token')?.addEventListener('click', () => {
        const paymentTokensTable = settingsForm.querySelector('.payment-tokens');
        if (paymentTokensTable.classList.contains('empty-payment-tokens')) {
            paymentTokensTable.classList.toggle('empty-payment-tokens');
            document.getElementById('empty_payment_tokens_message').style.display = 'none';
        }
        const newPaymentTokenRowClone = newPaymentTokenRow.cloneNode(true);
        newPaymentTokenRowClone.querySelector('.payment-token-name').name = `payment_tokens[${paymentTokensIndex}][name]`;
        newPaymentTokenRowClone.querySelector('.payment-token').name = `payment_tokens[${paymentTokensIndex}][token]`;
        newPaymentTokenRowClone.style.display = '';
        newPaymentTokenRowClone.querySelector('.delete-payment-token').addEventListener('click', deletePaymentTokenHandler);
        paymentTokensTable.appendChild(newPaymentTokenRowClone);
        paymentTokensIndex++;
    });

    addDeletePaymentTokenHandlers();
});