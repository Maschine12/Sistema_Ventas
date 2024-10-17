import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const conn: { isConnected: boolean } = {
    isConnected: false,
};

export async function connectDB() {
    if (conn.isConnected) return; // Si ya está conectado, salir

    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/sale-systems');
        conn.isConnected = mongoose.connection.readyState === 1; // Establecer estado de conexión
        console.log('Conectado a la base de datos MongoDB:', mongoose.connection.name);
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1); // Finaliza el proceso si hay un error en la conexión
    }
}

// Event listeners para conexión
mongoose.connection.on('connected', () => {
    console.log('Mongoose está conectado');
});

mongoose.connection.on('error', (err) => {
    console.error('Error de conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose se ha desconectado');
});
