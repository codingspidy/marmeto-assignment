window.app = {};
app.store = {
    products: null,
};

const API = {
    url: "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json",
    fetchData: async () => {
        const result = await fetch(API.url)
        return await result.json()
    }
}

async function loadData() {
    app.store.products = await API.fetchData()
    renderTabs();
    renderProducts();
}

window.addEventListener("DOMContentLoaded", () => {
    loadData()
})

// Tab Navigation
function renderTabs() {
    const tabsContainer = document.getElementById("tabsContainer");

    app.store.products.categories.map((category, i) => {
        const list = document.createElement("li");
        list.innerHTML = `
                        ${category.category_name}
        `;

        if (i == 0) {
            list.classList.add("active")
        }
        list.dataset.tab = "tab" + (i + 1);

        list.addEventListener('click', () => {
            const tabs = tabsContainer.querySelectorAll("li");
            const contentContainers = document.querySelectorAll('#contentContainer > div');
                
            contentContainers.forEach(container => container.classList.remove("active"));
            tabs.forEach(t => t.classList.remove("active"));

            const contentId = `#${list.dataset.tab}-content`;
            const content = document.querySelector(contentId);
            content.classList.add("active");
            list.classList.add('active');

        })
        tabsContainer.appendChild(list);
    })
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

function calculateDiscount(originalPrice, discountedPrice) {
    const discountAmount = originalPrice - discountedPrice;
    const discountPercentage = (discountAmount / originalPrice) * 100;
    return discountPercentage.toFixed(2) + "%";
}