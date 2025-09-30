const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
    dni: { 
        type: String, 
        required: [true, 'El DNI es obligatorio.'], 
        unique: true, 
        match: [/^[0-9]{10}$/, 'El DNI debe contener 10 dígitos numéricos.'] 
    },
    nombres: { 
        type: String, 
        required: [true, 'El campo Nombres es obligatorio.'] 
    },
    apellidos: { 
        type: String, 
        required: [true, 'El campo Apellidos es obligatorio.'] 
    },
    fechaNacimiento: { 
        type: Date, 
        required: [true, 'La Fecha de Nacimiento es obligatoria.'] 
    },
    genero: { 
        type: String, 
        required: [true, 'El campo Género es obligatorio.'] 
    },
    ciudad: { 
        type: String, 
        required: [true, 'El campo Ciudad es obligatorio.'] 
    }
});

const Persona = mongoose.model('Persona', personaSchema);
module.exports = Persona;
