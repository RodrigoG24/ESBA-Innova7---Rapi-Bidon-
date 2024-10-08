let products = [
    {name: "Detergente", price: 6500, stock: 25, image: "assets/detergent.png"},
    {name: "Suavizante", price: 6000, stock: 15, image: "assets/suavizante.jfif"},
    {name: "Trapo de piso", price: 900, stock: 16, image: "assets/trapodepiso.jfif"},
    {name: "Balde de limpieza", price: 2500, stock: 12, image: "assets/balde.png"},
    {name: "Escoba", price: 3800, stock: 7, image: "assets/escoba.png"},
    {name: "Lavandina", price: 3500, stock: 22, image: "assets/lavandina.jpg"},
    {name: "Limpiador multiuso", price: 1200, stock: 18, image: "assets/limpiavidrios.png"},
    {name: "Guantes de limpieza", price: 1200, stock: 20, image: "assets/cleaning.jpg"},
];

function showSection(section) {
    const sections = document.querySelectorAll('.content');
    sections.forEach((sec) => {
        sec.style.display = 'none';
    });
    document.getElementById(section).style.display = 'block';
}

function displayProducts() {
    const productList = document.querySelector('.product-grid');
    productList.innerHTML = '';
    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
        `;
        productList.appendChild(productDiv);
    });
}

function addProduct() {
    const name = document.getElementById('new-product-name').value;
    const price = document.getElementById('new-product-price').value;
    const stock = document.getElementById('new-product-stock').value;
    const image = document.getElementById('new-product-image').value;

    if(name && price && stock && image) {
        products.push({name, price: Number(price), stock: Number(stock), image});
        document.getElementById('new-product-name').value = '';
        document.getElementById('new-product-price').value = '';
        document.getElementById('new-product-stock').value = '';
        document.getElementById('new-product-image').value = '';
        displayProducts();
        updateProductSelect();
        updateDeleteProductSelect();
    }
}

function updateProductSelect() {
    const select = document.getElementById('product-select');
    select.innerHTML = '';
    products.forEach((product, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = product.name;
        select.appendChild(option);
    });
}

function updateDeleteProductSelect() {
    const select = document.getElementById('delete-product-select');
    select.innerHTML = '';
    products.forEach((product, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = product.name;
        select.appendChild(option);
    });
}

function updateProduct() {
    const index = document.getElementById('product-select').value;
    const price = document.getElementById('update-price').value;
    const stock = document.getElementById('update-stock').value;

    if (index !== "" && (price || stock)) {
        if(price) {
            products[index].price = Number(price);
        }
        if(stock) {
            products[index].stock = Number(stock);
        }
        displayProducts();
    }
}

function deleteProduct() {
    const index = document.getElementById('delete-product-select').value;
    if (index !== "") {
        products.splice(index, 1);
        displayProducts();
        updateProductSelect();
        updateDeleteProductSelect();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateProductSelect();
    updateDeleteProductSelect();
    showSection('home');
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('href').substring(1);
            showSection(section);
        });
    });
});
