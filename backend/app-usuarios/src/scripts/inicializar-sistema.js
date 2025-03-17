/////////////////////////////////////////////////////////////////
//      ejecutar: node src/scripts/inicializar-sistema.js      //
//  crea en la base de atos el usuario admin contraseña admin  //
/////////////////////////////////////////////////////////////////

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/sige');

// Definir esquemas básicos para la inicialización
const DireccionSchema = new mongoose.Schema({
  nombre: String,
  codigo: String,
  descripcion: String,
  activo: Boolean,
  fechaCreacion: Date,
  fechaActualizacion: Date
});

const CargoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  direccionId: mongoose.Schema.Types.ObjectId,
  activo: Boolean,
  fechaCreacion: Date,
  fechaActualizacion: Date
});

const UsuarioSchema = new mongoose.Schema({
  username: String,
  password: String,
  nombre: String,
  apellido: String,
  direccionId: mongoose.Schema.Types.ObjectId,
  cargoId: mongoose.Schema.Types.ObjectId,
  fechaNacimiento: Date,
  role: String,
  activo: Boolean,
  email: String,
  telefono: String,
  fechaCreacion: Date,
  fechaActualizacion: Date,
  ultimoAcceso: Date
});

const Direccion = mongoose.model('Direccion', DireccionSchema);
const Cargo = mongoose.model('Cargo', CargoSchema);
const Usuario = mongoose.model('Usuario', UsuarioSchema);

async function inicializarSistema() {
  try {
    // 1. Crear una dirección
    const direccion = new Direccion({
      nombre: 'Dirección General',
      codigo: 'DG',
      descripcion: 'Dirección principal del sistema',
      activo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });
    
    await direccion.save();
    console.log('Dirección creada:', direccion._id);
    
    // 2. Crear un cargo
    const cargo = new Cargo({
      nombre: 'Administrador',
      descripcion: 'Administrador del sistema',
      direccionId: direccion._id,
      activo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });
    
    await cargo.save();
    console.log('Cargo creado:', cargo._id);
    
    // 3. Crear un usuario administrador
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);
    
    const usuario = new Usuario({
      username: 'admin',
      password: hashedPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      direccionId: direccion._id,
      cargoId: cargo._id,
      fechaNacimiento: new Date('1990-01-01'),
      role: 'admin',
      activo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });
    
    await usuario.save();
    console.log('Usuario administrador creado:', usuario._id);
    
    console.log('Sistema inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar el sistema:', error);
  } finally {
    mongoose.disconnect();
  }
}

inicializarSistema();