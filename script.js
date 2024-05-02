window.app = {};
const Store = {
    products: null,
}
app.store = Store;

const API = {
    url: "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json",
    fetchData: async () => {
        const result = await fetch(API.url)
        return await result.json()
    }
}

async function loadData() {
    app.store.products = await API.fetchData()
    renderProducts()
}

window.addEventListener("DOMContentLoaded", () => {
    loadData()
})

// Tab Navigation
const tabs = document.querySelectorAll('#tabsContainer li');
const contentContainers = document.querySelectorAll('#contentContainer > div');

function showContent(tab) {
    contentContainers.forEach(container => container.classList.remove("active"));
    tabs.forEach(t => t.classList.remove("active"));

    const contentId = `#${tab.dataset.tab}-content`;
    const content = document.querySelector(contentId);
    content.classList.add("active");
    tab.classList.add('active');
}
tabs.forEach(tab => tab.addEventListener('click', () => showContent(tab)));

function calculateDiscount(originalPrice, discountedPrice) {
    const discountAmount = originalPrice - discountedPrice;
    const discountPercentage = (discountAmount / originalPrice) * 100;
    return discountPercentage.toFixed(2) + "%";
}

function renderProducts() {
    const tab1Content = document.getElementById("tab1-content");
    const tab2Content = document.getElementById("tab2-content");
    const tab3Content = document.getElementById("tab3-content");

    app.store.products.categories.map((category) => {
        console.log(category)
        const products = category.category_products;
        console.log(products)
        products.map((product) => {
            const discount = calculateDiscount(product.compare_at_price, product.price);

            const item = document.createElement("div");
            item.classList.add("card");
            item.innerHTML = `
                    <div class="img-container">
                            <span class="badge ${product.badge_text ? "" : "hidden"}">${product.badge_text}</span>
                            <img src=${product.image} />
                        </div>
                        <div>
                            <div class="details">
                                <h3 class="font-600 text-base">${product.title}</h3>
                                <img class="fa-circle" src="/assets/circle-solid.svg" />
                                <h4 class="font-400 text-xs">${product.vendor}</h4>
                            </div>
                            <div class="price">
                                <span class="text-xs">Rs ${product.price}.00</span>
                                <span class="stroke text-grey text-xs">${product.compare_at_price}.00</span>
                                <span class="text-xs text-red">${discount} Off</span>
                            </div>
                            <button class="cart-btn">Add to Cart</button>
                        </div>
                    `


            if (category.category_name == "Men") {
                tab1Content.appendChild(item)
            }
            else if (category.category_name == "Women") {
                tab2Content.appendChild(item)
            }
            else if (category.category_name == "Kids") {
                tab3Content.appendChild(item)
            }

        })
    })
}
