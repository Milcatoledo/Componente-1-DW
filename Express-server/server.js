const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Persona = require('./model');

const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://toledo:123@mongo:27017/CrudUsuarios?authSource=admin';

mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000
})
.then(() => console.log('Conectado a MongoDB - Base de datos'))
.catch(e => console.error('Error conexión MongoDB:', e));

// --- RUTA PARA CREAR PERSONA (CORREGIDA) ---
// --- RUTA PARA CREAR PERSONA (CORREGIDA) ---
app.post('/', async (req, res) => {
    try {
        const persona = new Persona(req.body);
        await persona.save();
        res.status(201).json(persona);
    } catch (error) {
        // Error de DNI duplicado
        if (error.code === 11000) {
            return res.status(400).json({ message: 'El DNI ingresado ya se encuentra registrado.' });
        }
        
        // --- ESTE ES EL CAMBIO CLAVE ---
        // Si es un error de validación, ahora enviamos el objeto de errores completo.
        if (error.name === 'ValidationError') {
            return res.status(400).json({ errors: error.errors });
        }
        
        // Para cualquier otro tipo de error
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});


// Obtener todas las personas (sin cambios)
app.get('/', async (req, res) => {
    try {
        const personas = await Persona.find();
        res.json(personas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener persona por ID (sin cambios)
app.get('/:id', async (req, res) => {
    try {
        const persona = await Persona.findById(req.params.id);
        if (!persona) return res.status(404).json({ message: 'No encontrado' });
        res.json(persona);
    } catch (error) {
        res.status(400).json({ message: 'Id inválido' });
    }
});

// --- RUTA PARA ACTUALIZAR PERSONA (CORREGIDA) ---
app.put('/:id', async (req, res) => {
    try {
        const persona = await Persona.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // runValidators es clave aquí
        );
        if (!persona) return res.status(404).json({ message: 'No encontrado' });
        res.json(persona);
    } catch (error) {
        // --- CAMBIO IMPORTANTE AQUÍ ---
        // Manejo de error de validación
        if (error.name === 'ValidationError') {
            return res.status(400).json({ errors: error.errors });
        }

        // Manejo de error de DNI duplicado al actualizar
        if (error.code === 11000) {
            return res.status(400).json({ message: 'El DNI ingresado ya pertenece a otra persona.' });
        }
        
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// Eliminar persona por ID (sin cambios)
app.delete('/:id', async (req, res) => {
    try {
        const persona = await Persona.findByIdAndDelete(req.params.id);
        if (!persona) return res.status(404).json({ message: 'No encontrado' });
        res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ message: 'Id inválido' });
    }
});

const PORT = 3000;
const HOST = '0.0.0.0'; 

app.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}/`);
});
