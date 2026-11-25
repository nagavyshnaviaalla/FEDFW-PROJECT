
const IMAGE_FOLDER = "FreshCart_30_Product_Images/images/";

function getCart() {
    return JSON.parse(localStorage.getItem("freshCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("freshCart", JSON.stringify(cart));
}

function updateQuantity(id, change) {
    let cart = getCart();

    const item = cart.find(p => String(p.id) === String(id));

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter(p => String(p.id) !== String(id));
        }
    }

    saveCart(cart);
    displayCart();
}

function removeItem(id) {
    let cart = getCart();

    cart = cart.filter(p => String(p.id) !== String(id));

    saveCart(cart);
    displayCart();
}

function displayCart() {
    const cart = getCart();
    const container = document.getElementById("cartItems");

    let subtotal = 0;
    let totalItems = 0;
    let hasOnlineItem = false;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything yet.</p>
                <a href="products.html" class="shop-btn">
                    Start Shopping
                </a>
            </div>`;

        document.getElementById("subtotal").textContent = "₹0";
        document.getElementById("delivery").textContent = "₹0";
        document.getElementById("total").textContent = "₹0";
        document.getElementById("cartCount").textContent = "0";
        document.getElementById("checkoutBtn").style.pointerEvents = "none";
        document.getElementById("checkoutBtn").style.opacity = "0.5";
        return;
    }

    document.getElementById("checkoutBtn").style.pointerEvents = "auto";
    document.getElementById("checkoutBtn").style.opacity = "1";

    container.innerHTML = "";

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        totalItems += item.quantity;

        if (item.online) hasOnlineItem = true;

        const image = item.online
            ? item.image
            : IMAGE_FOLDER + item.image;

        const priceLabel = item.online
            ? "$" + Number(item.price).toFixed(2) + " (demo price)"
            : "₹" + item.price;

        const amountLabel = item.online
            ? "$" + (item.price * item.quantity).toFixed(2)
            : "₹" + (item.price * item.quantity).toFixed(2);

        container.innerHTML += `
            <div class="cart-item">
                <img src="${image}" alt="${item.name}"
                     onerror="this.src='https://placehold.co/200x200?text=Product'">

                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${priceLabel}</p>

                    <div class="quantity">
                        <button onclick="updateQuantity('${item.id}', -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>

                    <button class="remove-btn"
                        onclick="removeItem('${item.id}')">
                        Remove
                    </button>
                </div>

                <strong>${amountLabel}</strong>
            </div>`;
    });

    const delivery = subtotal >= 499 ? 0 : 40;
    const total = subtotal + delivery;

    document.getElementById("subtotal").textContent =
        hasOnlineItem ? "Mixed currencies" : "₹" + subtotal.toFixed(2);

    document.getElementById("delivery").textContent =
        hasOnlineItem ? "Calculated at checkout" : "₹" + delivery;

    document.getElementById("total").textContent =
        hasOnlineItem ? "Mixed currencies" : "₹" + total.toFixed(2);

    document.getElementById("cartCount").textContent = totalItems;

    if (hasOnlineItem) {
        document.getElementById("checkoutBtn").style.pointerEvents = "none";
        document.getElementById("checkoutBtn").style.opacity = "0.5";
        document.getElementById("checkoutBtn").textContent =
            "Remove demo-priced items to checkout";
    } else {
        document.getElementById("checkoutBtn").textContent =
            "Proceed to Checkout";
    }
}

displayCart();
