const mongoose = require('mongoose');

const uri = 'mongodb+srv://rodrigogalante24:MnSYmVeDFFb9crw3@rodrigogdatabase.y2jss.mongodb.net/RapiBidon?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión a MongoDB establecida');
        // Listar bases de datos y colecciones
        return mongoose.connection.db.listCollections().toArray();
    })
    .then(collections => {
        console.log('Colecciones disponibles:', collections);
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB:', err);
    });

module.exports = mongoose;
