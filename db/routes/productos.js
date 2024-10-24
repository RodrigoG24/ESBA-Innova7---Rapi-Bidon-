const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Modelo del producto
const mongoose = require('mongoose');


// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); //
        console.log('Products obtenidos:', products);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos' });
    }
});

// Crear un nuevo producto
router.post('/products', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        image: req.body.image
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Actualizar un producto
router.put('/:id', async (req, res) => { // Cambio aquí para usar /api/productos/:id
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        product.price = req.body.price || product.price;
        product.stock = req.body.stock || product.stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
    console.log(`Recibiendo petición para eliminar el producto con ID: ${req.params.id}`);
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID de producto no válido' });
    }

    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        console.error('Error en la eliminación del producto:', err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
