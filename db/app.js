const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('./db');
const productosRoutes = require('./routes/productos');
const loginRoutes = require('./routes/login');
const cors = require('cors');
const helmet = require('helmet'); // Importamos helmet para manejar Content Security Policy (REQUERIDO POR Render)

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de seguridad
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'], // URL para fuentes de Google Fonts
                styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"], // URL para estilos de Google Fonts
            },
        },
    })
);

app.use(cors());
app.use(bodyParser.json());

// Configuración para servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '..'))); // Sirve archivos de la carpeta base del proyecto

// Rutas para las APIs
app.use('/api/productos', productosRoutes);
app.use('/api/login', loginRoutes);

// Ruta raíz para servir el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
