const cart = JSON.parse(localStorage.getItem("freshCart")) || [];

const itemsContainer = document.getElementById("checkoutItems");
const form = document.getElementById("checkoutForm");
const message = document.getElementById("checkoutMessage");

let subtotal = 0;

function loadCheckout() {
    if (cart.length === 0) {
        itemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        form.querySelector("button[type='submit']").disabled = true;
        return;
    }

    // Online sample prices are in dollars, so do not charge them as rupees.
    if (cart.some(item => item.online)) {
        itemsContainer.innerHTML =
            "<p>Remove online demo-priced products from your cart before checkout.</p>";
        form.querySelector("button[type='submit']").disabled = true;
        return;
    }

    itemsContainer.innerHTML = "";

    cart.forEach(item => {
        const amount = item.price * item.quantity;
        subtotal += amount;

        itemsContainer.innerHTML += `
            <div class="checkout-item">
                <span>${item.name} × ${item.quantity}</span>
                <strong>₹${amount.toFixed(2)}</strong>
            </div>
        `;
    });

    const delivery = subtotal >= 499 ? 0 : 40;

    document.getElementById("checkoutSubtotal").textContent =
        "₹" + subtotal.toFixed(2);

    document.getElementById("checkoutDelivery").textContent =
        "₹" + delivery.toFixed(2);

    document.getElementById("checkoutTotal").textContent =
        "₹" + (subtotal + delivery).toFixed(2);
}

// Set the minimum delivery date to today.
const dateInput = document.getElementById("deliveryDate");
const today = new Date();
const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

dateInput.min = localDate;

form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0 || cart.some(item => item.online)) {
        alert("Please check your cart before placing an order.");
        return;
    }

    const selectedPayment =
        document.querySelector('input[name="payment"]:checked');

    if (!selectedPayment) {
        alert("Please select a payment method.");
        return;
    }

    const deliveryDate = dateInput.value;

    if (deliveryDate < localDate) {
        alert("Please select today or a future delivery date.");
        return;
    }

    const delivery = subtotal >= 499 ? 0 : 40;

    const order = {
        orderId: "FC" + Date.now(),
        customerName: document.getElementById("customerName").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        pincode: document.getElementById("pincode").value,
        deliveryDate: deliveryDate,
        deliverySlot: document.getElementById("deliverySlot").value,
        payment: selectedPayment.value,
        products: cart,
        subtotal: subtotal,
        delivery: delivery,
        total: subtotal + delivery,
        status: "Order Placed",
        createdAt: new Date().toISOString()
    };

    let orders = JSON.parse(localStorage.getItem("freshOrders")) || [];

    orders.push(order);

    localStorage.setItem("freshOrders", JSON.stringify(orders));
    localStorage.removeItem("freshCart");

    message.style.display = "block";
    message.innerHTML = `
        <h3>Order placed successfully!</h3>
        <p>Your order number is: <strong>${order.orderId}</strong></p>
        <p>Delivery: ${order.deliveryDate}, ${order.deliverySlot}</p>
        <p>Payment: ${order.payment}</p>
        <p>Total: ₹${order.total.toFixed(2)}</p>
        <p>This is a demo order confirmation. No real payment was processed.</p>
        <a href="orders.html">View My Orders</a>
    `;

    form.querySelector("button[type='submit']").disabled = true;
});

loadCheckout();
