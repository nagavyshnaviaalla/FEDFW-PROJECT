/* FreshCart product catalogue + external product discovery
   Local products are purchasable from the demo catalogue.
   External Open Food Facts matches are discovery-only until a store adds them. */

const products = [
    // FRUITS
    {id:1, name:"Fresh Apples", price:120, category:"Fruits", image:"apple.jpg"},
    {id:2, name:"Bananas", price:50, category:"Fruits", image:"banana.jpg"},
    {id:3, name:"Mangoes", price:100, category:"Fruits", image:"mango.jpg"},
    {id:4, name:"Green Grapes", price:90, category:"Fruits", image:"grapes.jpg"},
    {id:5, name:"Oranges", price:80, category:"Fruits", image:"orange.jpg"},
    {id:6, name:"Watermelon", price:60, category:"Fruits", image:"watermelon.jpg"},
    // VEGETABLES
    {id:7, name:"Tomatoes", price:35, category:"Vegetables", image:"tomato.jpg"},
    {id:8, name:"Potatoes", price:40, category:"Vegetables", image:"potato.jpg"},
    {id:9, name:"Carrots", price:45, category:"Vegetables", image:"carrot.jpg"},
    {id:10, name:"Onions", price:50, category:"Vegetables", image:"onion.jpg"},
    {id:11, name:"Spinach", price:30, category:"Vegetables", image:"spinach.jpg"},
    {id:12, name:"Broccoli", price:70, category:"Vegetables", image:"broccoli.jpg"},
    {id:13, name:"Capsicum", price:55, category:"Vegetables", image:"capsicum.jpg"},
    // DAIRY
    {id:14, name:"Fresh Milk", price:30, category:"Dairy", image:"milk.jpg"},
    {id:15, name:"Curd", price:40, category:"Dairy", image:"curd.jpg"},
    {id:16, name:"Butter", price:55, category:"Dairy", image:"butter.jpg"},
    {id:17, name:"Paneer", price:90, category:"Dairy", image:"paneer.jpg"},
    {id:18, name:"Eggs", price:70, category:"Dairy", image:"eggs.jpg"},
    // GROCERIES
    {id:19, name:"Rice", price:65, category:"Groceries", image:"rice.jpg"},
    {id:20, name:"Wheat Flour", price:55, category:"Groceries", image:"flour.jpg"},
    {id:21, name:"Toor Dal", price:110, category:"Groceries", image:"toor-dal.jpg"},
    {id:22, name:"Cashew Nuts", price:180, category:"Groceries", image:"cashews.jpg"},
    {id:23, name:"Coffee", price:140, category:"Groceries", image:"coffee.jpg"},
    {id:24, name:"Green Tea", price:120, category:"Groceries", image:"green-tea.jpg"},
    // SNACKS
    {id:25, name:"Potato Chips", price:20, category:"Snacks", image:"chips.jpg"},
    {id:26, name:"Chocolate", price:40, category:"Snacks", image:"chocolate.jpg"},
    {id:27, name:"Cookies", price:50, category:"Snacks", image:"cookies.jpg"},
    {id:28, name:"Namkeen", price:35, category:"Snacks", image:"namkeen.jpg"},
    {id:29, name:"Juice", price:45, category:"Snacks", image:"juice.jpg"},
    {id:30, name:"Mango Juice", price:50, category:"Snacks", image:"mango-juice.jpg"}
];

const IMAGE_FOLDER = "FreshCart_30_Product_Images/images/";
const CATEGORY_ALIASES = {
    fruits: "Fruits", fruit: "Fruits",
    vegetables: "Vegetables", vegetable: "Vegetables",
    dairy: "Dairy", groceries: "Groceries", grocery: "Groceries",
    staples: "Groceries", snacks: "Snacks", beverages: "Snacks"
};
const initialCategory = new URLSearchParams(window.location.search).get("category");
let selectedCategory = CATEGORY_ALIASES[(initialCategory || "").toLowerCase()] || "All";
let searchTimer = null;
let searchController = null;
let lastSearchToken = 0;

function getCart() {
    return JSON.parse(localStorage.getItem("freshCart") || "[]");
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    const element = document.getElementById("cartCount");
    if (element) element.textContent = count;
}

function addToCart(product) {
    if (product.external) {
        alert("This item was found in the wider product database, but it is not stocked in the FreshCart demo store yet. Use Request Product so the store can add it.");
        return;
    }
    const cart = getCart();
    const existing = cart.find(item => String(item.id) === String(product.id));
    if (existing) existing.quantity = Number(existing.quantity || 1) + 1;
    else cart.push({...product, quantity: 1});
    localStorage.setItem("freshCart", JSON.stringify(cart));
    updateCartCount();
    alert(product.name + " added to cart!");
}

function requestProduct(product) {
    const requests = JSON.parse(localStorage.getItem("freshCartProductRequests") || "[]");
    const key = (product.name || "").toLowerCase();
    const alreadyRequested = requests.some(item => item.name.toLowerCase() === key);
    if (!alreadyRequested) {
        requests.push({
            name: product.name,
            brand: product.brand || "",
            image: product.image || "",
            source: "Open Food Facts",
            requestedAt: new Date().toISOString(),
            status: "Requested"
        });
        localStorage.setItem("freshCartProductRequests", JSON.stringify(requests));
    }
    alert(alreadyRequested
        ? product.name + " is already in your product requests."
        : product.name + " request saved! The store owner can review this request on this browser.");
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "catalog-card" + (product.external ? " external-card" : "");

    const img = document.createElement("img");
    img.src = product.external
        ? (product.image || "https://placehold.co/400x300/eaf5e9/174d35?text=Product")
        : IMAGE_FOLDER + product.image;
    img.alt = product.name;
    img.loading = "lazy";
    img.onerror = function() {
        this.onerror = null;
        this.src = "https://placehold.co/400x300/eaf5e9/174d35?text=FreshCart";
    };

    const info = document.createElement("div");
    info.className = "catalog-info";
    const category = document.createElement("small");
    category.textContent = product.external
        ? "Found in external product database"
        : product.category;
    const name = document.createElement("h3");
    name.textContent = product.name;
    const priceRow = document.createElement("div");
    priceRow.className = "catalog-price";

    const price = document.createElement("strong");
    if (product.external) {
        price.textContent = product.brand
            ? product.brand + " · Price not listed"
            : "Price not listed";
        price.classList.add("external-price");
    } else {
        price.textContent = "₹" + product.price;
    }

    const button = document.createElement("button");
    button.className = "add-btn";
    if (product.external) {
        button.textContent = "Request Product";
        button.addEventListener("click", () => requestProduct(product));
    } else {
        button.textContent = "Add to Cart";
        button.addEventListener("click", () => addToCart(product));
    }

    priceRow.append(price, button);
    info.append(category, name, priceRow);
    card.append(img, info);
    return card;
}

function sortProducts(list) {
    const sort = document.getElementById("sortProducts")?.value || "default";
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    else if (sort === "high") list.sort((a, b) => b.price - a.price);
    else if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
}

function displayProducts(list, externalList = []) {
    const container = document.getElementById("productList");
    if (!container) return;
    container.innerHTML = "";

    if (!list.length && !externalList.length) {
        container.innerHTML = '<p class="no-results">No matching products found. Try another spelling or search term.</p>';
        return;
    }

    sortProducts(list);
    list.forEach(product => container.appendChild(createProductCard(product)));

    if (externalList.length) {
        const heading = document.createElement("h2");
        heading.className = "external-results-heading";
        heading.textContent = "Not in our store? Found elsewhere";
        container.appendChild(heading);
        externalList.forEach(product => container.appendChild(createProductCard(product)));
    }
}

function showSearchMessage(message) {
    const old = document.getElementById("externalSearchStatus");
    if (old) old.textContent = message;
}

async function searchExternalProducts(query, token) {
    if (searchController) searchController.abort();
    searchController = new AbortController();
    showSearchMessage("Searching a wider product database…");

    try {
        // Open Food Facts is a public food-product database. It does not provide
        // FreshCart store stock or reliable local selling prices.
        const url = "https://world.openfoodfacts.org/cgi/search.pl?search_terms=" +
            encodeURIComponent(query) +
            "&search_simple=1&action=process&json=1&page_size=12&fields=product_name,brands,image_front_url,categories";
        const response = await fetch(url, {
            signal: searchController.signal,
            headers: {"Accept": "application/json"}
        });
        if (!response.ok) throw new Error("External search unavailable");
        const data = await response.json();
        if (token !== lastSearchToken) return;

        const localNames = new Set(products.map(p => p.name.toLowerCase()));
        const seen = new Set();
        const external = (data.products || [])
            .filter(item => item.product_name && item.product_name.trim())
            .map((item, index) => ({
                id: "external-" + (item.code || index),
                name: item.product_name.trim(),
                brand: item.brands || "",
                image: item.image_front_url || "",
                category: item.categories || "",
                external: true
            }))
            .filter(item => {
                const key = item.name.toLowerCase();
                if (localNames.has(key) || seen.has(key)) return false;
                seen.add(key);
                return true;
            });

        const categoryFilteredExternal = selectedCategory === "All"
            ? external
            : external.filter(item => {
                const categoryText = (item.category || "").toLowerCase();
                const nameText = item.name.toLowerCase();
                const categoryTerms = {
                    Fruits: /fruit|apple|banana|mango|orange|grape/,
                    Vegetables: /vegetable|tomato|potato|carrot|onion|spinach|broccoli/,
                    Dairy: /dairy|milk|cheese|yogurt|curd|butter/,
                    Groceries: /grocery|rice|flour|dal|cereal|grain/,
                    Snacks: /snack|chips|cookie|chocolate|biscuit/ 
                };
                return (categoryTerms[selectedCategory] || /$^/).test(categoryText + " " + nameText);
            });

        displayProducts(getFilteredLocalProducts(query), categoryFilteredExternal);
        showSearchMessage(external.length
            ? "Showing matches from the wider food database. These are not confirmed as available in your local FreshCart store."
            : "No extra matches were returned by the wider database.");
    } catch (error) {
        if (error.name === "AbortError") return;
        if (token !== lastSearchToken) return;
        showSearchMessage("Wider product search is temporarily unavailable. Showing FreshCart catalogue matches only.");
        displayProducts(getFilteredLocalProducts(query));
    }
}

function getFilteredLocalProducts(search) {
    const term = search.trim().toLowerCase();
    return products.filter(product => {
        const matchesName = !term || product.name.toLowerCase().includes(term);
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        return matchesName && matchesCategory;
    });
}

async function renderProducts() {
    const input = document.getElementById("searchInput");
    const search = input ? input.value.trim() : "";
    const sort = document.getElementById("sortProducts")?.value || "default";
    const token = ++lastSearchToken;

    const localResults = sortProducts(getFilteredLocalProducts(search));

    displayProducts(localResults);
    showSearchMessage("");

    if (search.length >= 2) {
        await searchExternalProducts(search, token);
    } else {
        if (searchController) searchController.abort();
        showSearchMessage("Search the FreshCart catalogue and a wider food-product database.");
    }
}

function scheduleProductSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderProducts, 350);
}

function filterCategory(category, button) {
    selectedCategory = category;
    document.querySelectorAll(".category-filters button")
        .forEach(btn => btn.classList.remove("active"));
    if (button) button.classList.add("active");
    renderProducts();
}

document.getElementById("searchInput")?.addEventListener("input", scheduleProductSearch);
document.getElementById("searchInput")?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        clearTimeout(searchTimer);
        renderProducts();
    }
});

const params = new URLSearchParams(window.location.search);
const initialSearch = params.get("search");
if (initialSearch) document.getElementById("searchInput").value = initialSearch;
renderProducts();
updateCartCount();
