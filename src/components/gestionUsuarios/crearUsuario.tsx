"use client";
import { useState } from 'react';

const CreateUser = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('vendedor');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newUser = { username, password, role };

        fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        })
            .then(response => response.json())
            .then(data => console.log('User created:', data))
            .catch(error => console.error('Error creating user:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de Usuario"
                className="border p-2 mb-2"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="border p-2 mb-2"
            />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 mb-2">
                <option value="admin">Administrador</option>
                <option value="vendedor">Vendedor</option>
            </select>
            <button type="submit" className="bg-blue-500 text-white p-2">Crear Usuario</button>
        </form>
    );
};

export default CreateUser;
