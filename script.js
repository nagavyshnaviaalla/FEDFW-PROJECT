let cart = JSON.parse(localStorage.getItem("freshCart")) || [];


/* ================= CART COUNT ================= */

function updateCartCount() {

    const cartCount = document.getElementById("cartCount");

    if (!cartCount) return;

    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
    });

    cartCount.textContent = totalItems;
}
/* ================= SAVE CART ================= */

function saveCart() {

    localStorage.setItem(
        "freshCart",
        JSON.stringify(cart)
    );

    updateCartCount();
}

/* ================= ADD TO CART ================= */

function addToCart(product) {

    const existingProduct = cart.find(
        item => item.id === product.id
    );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1

        });

    }


    saveCart();

    showNotification(
        `${product.name} added to your cart 🛒`
    );
}


/* ================= REMOVE FROM CART ================= */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

    showNotification(
        "Product removed from cart"
    );
}


/* ================= CHANGE QUANTITY ================= */

function changeQuantity(productId, change) {

    const product = cart.find(
        item => item.id === productId
    );


    if (!product) return;


    product.quantity += change;


    if (product.quantity <= 0) {

        removeFromCart(productId);

        return;
    }


    saveCart();
}


/* ================= NOTIFICATION ================= */

function showNotification(message) {

    const oldNotification =
        document.querySelector(".notification");

    if (oldNotification) {
        oldNotification.remove();
    }


    const notification =
        document.createElement("div");

    notification.className = "notification";

    notification.innerHTML = `
        <span>✓</span>
        <p>${message}</p>
    `;


    document.body.appendChild(notification);


    setTimeout(() => {

        notification.classList.add("hide");

        setTimeout(() => {
            notification.remove();
        }, 300);

    }, 2500);
}


/* ================= NOTIFICATION CSS ================= */

const notificationStyle =
document.createElement("style");

notificationStyle.textContent = `

.notification {

    position: fixed;

    top: 95px;
    right: 25px;

    z-index: 9999;

    display: flex;
    align-items: center;
    gap: 10px;

    padding: 13px 18px;

    background: #183c24;
    color: white;

    border-radius: 12px;

    box-shadow: 0 12px 30px rgba(0,0,0,0.18);

    animation: notificationIn 0.4s ease;

    font-size: 13px;
    font-weight: 600;
}

.notification span {

    width: 24px;
    height: 24px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    background: #68b875;
    color: white;

}

.notification p {
    margin: 0;
}

.notification.hide {
    animation: notificationOut 0.3s ease forwards;
}


@keyframes notificationIn {

    from {
        transform: translateX(120%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }

}


@keyframes notificationOut {

    from {
        transform: translateX(0);
        opacity: 1;
    }

    to {
        transform: translateX(120%);
        opacity: 0;
    }

}

`;

document.head.appendChild(notificationStyle);


/* ================= SEARCH HELPER ================= */

function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) return;


    const searchValue =
        searchInput.value.trim();


    if (searchValue === "") {

        showNotification(
            "Please enter a product name 🔎"
        );

        return;
    }


    window.location.href =
        `products.html?search=${encodeURIComponent(searchValue)}`;
}


/* ================= SEARCH ENTER KEY ================= */

const searchInput =
    document.getElementById("searchInput");


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                searchProducts();

            }

        }
    );

}


/* ================= LOGIN STATUS ================= */

function checkLoginStatus() {

    const loggedUser =
        localStorage.getItem("freshCartUser");


    const loginButton =
        document.querySelector(".login-btn");

    const registerButton =
        document.querySelector(".register-btn");


    if (!loggedUser) return;


    if (loginButton) {

        loginButton.textContent = "Profile";

        loginButton.href = "profile.html";

    }


    if (registerButton) {

        registerButton.textContent = "Logout";

        registerButton.href = "#";


        registerButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                localStorage.removeItem(
                    "freshCartUser"
                );

                showNotification(
                    "You have been logged out"
                );


                setTimeout(() => {

                    window.location.reload();

                }, 1000);

            }
        );

    }

}


/* ================= CATEGORY CLICK EFFECT ================= */

const categoryCards =
document.querySelectorAll(".category-card");


categoryCards.forEach(card => {

    card.addEventListener(
        "click",
        function() {

            const category =
                this.querySelector("h3");

            if (category) {

                localStorage.setItem(
                    "selectedCategory",
                    category.textContent
                );

            }

        }
    );

});


/* ================= OFFER CODE ================= */

const offerButton =
document.querySelector(".offer-btn");


if (offerButton) {

    offerButton.addEventListener(
        "click",
        function() {

            localStorage.setItem(
                "discountCode",
                "FRESH25"
            );

        }
    );

}


/* ================= PAGE LOAD ================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        checkLoginStatus();

    }
);