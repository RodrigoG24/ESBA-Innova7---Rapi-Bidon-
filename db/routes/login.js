const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Ruta para el inicio de sesión
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && user.password === password) {
            // Autenticación exitosa
            return res.status(200).json({ message: 'Inicio de sesión exitoso', success: true });
        } else {
            // Credenciales inválidas
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos', success: false });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', success: false });
    }
});

module.exports = router;
