// Bloom Valley Nursery – JavaScript for Touchstone Tasks 3.1 & 3.2
// Web Storage: sessionStorage for shopping cart, localStorage for custom orders

document.addEventListener('DOMContentLoaded', function() {

    // ---------- Helper functions ----------
    function showAlert(message) {
        alert(message);
    }

    // ---------- Shopping Cart using sessionStorage ----------
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    function saveCart() {
        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }

    function updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.innerText = totalItems;
        }
        const cartItemsList = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total');
        if (cartItemsList && cartTotalSpan) {
            cartItemsList.innerHTML = '';
            let total = 0;
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                const li = document.createElement('li');
                li.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove';
                removeBtn.onclick = () => removeFromCart(index);
                li.appendChild(removeBtn);
                cartItemsList.appendChild(li);
            });
            cartTotalSpan.innerText = total.toFixed(2);
        }
    }

    function addToCart(name, price) {
        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        saveCart();
        showAlert(`${name} added to cart.`);
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
    }

    function clearCart() {
        cart = [];
        saveCart();
        showAlert('Cart cleared.');
    }

    function processOrder() {
        if (cart.length === 0) {
            showAlert('Your cart is empty.');
        } else {
            cart = [];
            saveCart();
            showAlert('Thank you for your order!');
        }
    }

    // Attach Add to Cart event listeners
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            addToCart(name, price);
        });
    });

    // Clear Cart button (outside modal)
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearCart();
        });
    }

    // Process Order button (outside modal)
    const processOrderBtn = document.getElementById('process-order');
    if (processOrderBtn) {
        processOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            processOrder();
        });
    }

    // Clear Cart button inside modal
    const clearCartModalBtn = document.getElementById('clear-cart-modal');
    if (clearCartModalBtn) {
        clearCartModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearCart();
        });
    }

    // Process Order button inside modal
    const processOrderModalBtn = document.getElementById('process-order-modal');
    if (processOrderModalBtn) {
        processOrderModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            processOrder();
        });
    }

    // ---------- Cart Modal Open/Close ----------
    const cartIcon = document.querySelector('.cart-icon');
    const modal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close');
    if (cartIcon && modal) {
        cartIcon.addEventListener('click', () => {
            updateCartDisplay();
            modal.style.display = 'flex';
        });
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // ---------- Subscribe Buttons ----------
    const subscribeButtons = document.querySelectorAll('#subscribe-footer, #subscribe-btn');
    subscribeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('subscribe-email');
            if (emailInput && emailInput.value) {
                sessionStorage.setItem('subscriberEmail', emailInput.value);
            }
            showAlert('Thank you for subscribing.');
        });
    });

    // ---------- Custom Order Form (localStorage) ----------
    const form = document.getElementById('feedback-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            if (name && email && message) {
                const order = {
                    name: name,
                    email: email,
                    message: message,
                    date: new Date().toLocaleString()
                };
                let orders = JSON.parse(localStorage.getItem('customOrders')) || [];
                orders.push(order);
                localStorage.setItem('customOrders', JSON.stringify(orders));
                showAlert('Thank you for your message! Your custom order has been saved.');
                form.reset();
            } else {
                showAlert('Please fill in all fields.');
            }
        });
    }

    updateCartDisplay();
});