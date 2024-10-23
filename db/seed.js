// Archivo que se utilizó para subir todos los productos existentes a la base de datos
const mongoose = require('mongoose');
const Product = require('./models/product'); // Asegúrate de tener el modelo correcto del producto
const db = require('./db'); // La conexión a la base de datos

const products = [
    {name: "Detergente Magistral", price: 6500, stock: 25, image: "assets/DetergenteMagistral.png"},
    {name: "Suavizante Vivere", price: 7533, stock: 15, image: "assets/SuavizanteVivere.jpg"},
    {name: "Trapo de piso", price: 900, stock: 16, image: "assets/trapodepiso.jfif"},
    {name: "Balde de limpieza", price: 2500, stock: 12, image: "assets/balde.png"},
    {name: "Escoba", price: 3800, stock: 7, image: "assets/escoba.png"},
    {name: "Lavandina", price: 3500, stock: 22, image: "assets/lavandina.jpg"},
    {name: "Limpiador multiuso", price: 1200, stock: 18, image: "assets/limpiavidrios.png"},
    {name: "Guantes de limpieza", price: 1200, stock: 20, image: "assets/cleaning.jpg"}
];

async function seedProducts() {
    try {
        await Product.insertMany(products);
        console.log('Productos insertados correctamente');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error al insertar productos:', err);
    }
}

seedProducts();
