
const IMAGE_FOLDER = "FreshCart_30_Product_Images/images/";

function displayOrders() {
    const orders = JSON.parse(localStorage.getItem("freshOrders")) || [];
    const container = document.getElementById("ordersList");

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <h2>No orders yet</h2>
                <p>Your grocery orders will appear here after checkout.</p>
                <a href="products.html" class="shop-btn">
                    Start Shopping
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    [...orders].reverse().forEach(order => {
        let productsHTML = "";

        order.products.forEach(product => {
            const image = product.online
                ? product.image
                : IMAGE_FOLDER + product.image;

            productsHTML += `
                <div class="order-product">
                    <img src="${image}"
                         alt="${product.name}"
                         onerror="this.src='https://placehold.co/100x100?text=Product'">

                    <div>
                        <h4>${product.name}</h4>
                        <p>Quantity: ${product.quantity}</p>
                    </div>
                </div>
            `;
        });

        container.innerHTML += `
            <div class="order-card">

                <div class="order-header">
                    <div>
                        <h3>Order #${order.orderId}</h3>
                        <p>Placed on ${new Date(order.createdAt).toLocaleString()}</p>
                        <p>Delivery: ${order.deliveryDate} | ${order.deliverySlot}</p>
                    </div>

                    <span class="order-status">${order.status}</span>
                </div>

                <div class="order-products">
                    ${productsHTML}
                </div>

                <div class="order-footer">
                    <span>Payment: ${order.payment}</span>
                    <strong>Total: ₹${Number(order.total).toFixed(2)}</strong>
                </div>

            </div>
        `;
    });
}

displayOrders();
