// URL de la API - Agregamos dos url personalizadas, una para produccion y otra para hacer pruebas en testing locales
const API_URL = 'https://innova7-rapi-bidon.onrender.com/api/productos'; // URL de producción
// const API_URL = 'http://localhost:5000/api/productos'; // URL de desarrollo
const API_URL_LOGIN = 'https://innova7-rapi-bidon.onrender.com/api/login';
// const API_URL_LOGIN = 'http://localhost:5000/api/login';


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

    fetch(API_URL)  // Petición GET a la API
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
    fetch(API_URL)
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


// Función para añadir productos
async function addProduct() {
    // Obtener los valores de los campos de entrada
    const name = document.getElementById('new-product-name').value;
    const price = document.getElementById('new-product-price').value;
    const stock = document.getElementById('new-product-stock').value;
    const image = document.getElementById('new-product-image').value;

    // Crear un objeto con los datos del nuevo producto
    const productData = {
        name: name,
        price: parseFloat(price),
        stock: parseInt(stock),
        image: image
    };

    try {
        // Enviar la solicitud POST al servidor para agregar el nuevo producto
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error('Error al agregar el producto');
        }

        // Convertir la respuesta en JSON
        const newProduct = await response.json();
        console.log('Producto agregado:', newProduct);

        // Mostrar un mensaje de éxito y limpiar los campos de entrada
        alert('Producto agregado exitosamente');
        document.getElementById('new-product-name').value = '';
        document.getElementById('new-product-price').value = '';
        document.getElementById('new-product-stock').value = '';
        document.getElementById('new-product-image').value = '';

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al agregar el producto');
    }
}





// Funcion para actualizar los productos.
function updateProduct() {
    const productId = document.getElementById('product-select').value;
    const newPrice = document.getElementById('update-price').value;
    const newStock = document.getElementById('update-stock').value;

    // Petición PUT para actualizar el producto
    fetch(`${API_URL}/${productId}`, {
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


// Funcion para eliminar productos.
function deleteProduct() {
    const productId = document.getElementById('delete-product-select').value;
    console.log("Producto seleccionado para eliminar:", productId); // Verificar el ID del producto

    // Petición DELETE para eliminar el producto
    fetch(`${API_URL}/${productId}`, {
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



// Login
// Estado de inicio de sesión
let isLoggedIn = false;

// Evento de envío del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Realiza una petición POST al backend para autenticar al usuario
    const response = await fetch(API_URL_LOGIN, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    
    if (result.success) {
        console.log("Inicio de sesion exitoso!", response);
        isLoggedIn = true; // Actualiza el estado a "iniciado"
        
        // Oculta el formulario de inicio de sesión y muestra el panel de administración
        document.getElementById('adminOptions').style.display = 'block'; // Muestra el panel de administración
        document.getElementById('loginFormContainer').style.display = 'none'; // Oculta el formulario de inicio de sesión
    } else {
        alert(result.message); // Muestra un mensaje de error
    }
});

// Evento del botón "Administrador" en el navbar
document.querySelector('a[href="#admin"]').addEventListener('click', function() {
    if (!isLoggedIn) {
        // Si no está autenticado, muestra el formulario de inicio de sesión
        document.getElementById('loginFormContainer').style.display = 'flex';
        document.getElementById('adminOptions').style.display = 'none'; // Asegúrate de ocultar el panel de administración
    } else {
        // Si está autenticado, solo muestra el panel de administración
        document.getElementById('adminOptions').style.display = 'block';
        document.getElementById('loginFormContainer').style.display = 'none';
    }
});