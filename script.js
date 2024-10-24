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

// Función para llenar los select de productos para modificar y eliminar
function populateProductSelects() {
    const productSelect = document.getElementById('product-select');
    const deleteProductSelect = document.getElementById('delete-product-select');

    // Limpiar los selects
    productSelect.innerHTML = '';
    deleteProductSelect.innerHTML = '';

    // Obtener productos desde la API
    fetch('http://localhost:5000/api/productos')
        .then(response => response.json())
        .then(products => {
            if (!products || products.length === 0) {
                productSelect.innerHTML = '<option>No hay productos disponibles</option>';
                deleteProductSelect.innerHTML = '<option>No hay productos disponibles</option>';
                return;
            }

            // Llenar los selects con los productos
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product._id;
                option.textContent = `${product.name} - Precio: $${product.price}`;

                // Añadir las opciones a ambos selects
                productSelect.appendChild(option);
                deleteProductSelect.appendChild(option.cloneNode(true)); // Clonar la opción para el segundo select
            });
        })
        .catch(error => console.error('Error al obtener productos:', error));
}

// Llamar a la función cuando se cargue la página
window.onload = populateProductSelects;

function updateProduct() {
    const productId = document.getElementById('product-select').value;
    const newPrice = document.getElementById('update-price').value;
    const newStock = document.getElementById('update-stock').value;

    // Petición PUT para actualizar el producto
    fetch(`http://localhost:5000/api/productos/${productId}`, { // La ruta ahora es coherente
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            price: newPrice,
            stock: newStock
        })
    })
    .then(response => response.json())
    .then(updatedProduct => {
        console.log('Producto actualizado:', updatedProduct);
        alert('Producto actualizado con éxito');
        populateProductSelects(); // Actualiza la lista de productos
    })
    .catch(error => console.error('Error al actualizar el producto:', error));
}


function deleteProduct() {
    const productId = document.getElementById('delete-product-select').value;
    console.log("Producto seleccionado para eliminar:", productId); // Verificar el ID del producto

    // Petición DELETE para eliminar el producto
    fetch(`http://localhost:5000/api/productos/${productId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }
        return response.json();
    })
    .then(data => {
        console.log('Producto eliminado:', data);
        alert('Producto eliminado con éxito');
        populateProductSelects(); // Actualiza la lista de productos
    })
    .catch(error => console.error('Error al eliminar el producto:', error));
}

