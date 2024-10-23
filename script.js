function showSection(section) {
    const sections = document.querySelectorAll('.content');
    sections.forEach((sec) => {
        sec.style.display = 'none'; // Ocultar todas las secciones
    });
    const activeSection = document.getElementById(section);
    activeSection.style.display = 'block'; // Mostrar la sección seleccionada
    console.log("Seccion: " + section);
    if (section === 'products') {
        displayProducts(); // Cargar productos solo si la sección 'products' está visible
    }    
}

function displayProducts() {
    console.log('Iniciando la carga de productos...'); // 1. Verificar que la función se llama
    const productList = document.querySelector('.product-list');
    productList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos

    fetch('http://localhost:5000/api/productos')  // Petición GET a la API
        .then(response => {
            console.log('Respuesta de la API:', response); // 2. Ver respuesta de la API
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(products => {
            console.log('Productos obtenidos:', products); // 3. Verificar los productos

            if (!products || products.length === 0) {
                productList.innerHTML = '<li>No hay productos disponibles.</li>';
                return; // Si no hay productos, salir de la función
            }

            products.forEach((product, index) => {
                const productItem = document.createElement('li');
                productItem.classList.add('product-item');
                productItem.innerHTML = `
                    <div class="product-summary" onclick="toggleDetails(${index})">
                        <span>${product.name}</span>
                        <span>Precio: $${product.price}</span>
                        <span>Stock: ${product.stock}</span>
                    </div>
                    <div class="product-details" id="details-${index}" style="display: none;">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                `;
                productList.appendChild(productItem);
            });
        })
        .catch(error => console.error('Error al obtener productos:', error));
}



function toggleDetails(index) {
    const details = document.getElementById(`details-${index}`);
    details.style.display = details.style.display === 'none' || !details.style.display ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    showSection('home'); // Muestra la sección de inicio al cargar
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('href').substring(1);
            showSection(section); 
        });
    });
});
