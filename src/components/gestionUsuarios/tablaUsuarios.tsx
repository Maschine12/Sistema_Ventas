"use client";
import { useEffect, useState } from 'react';
import { Trash } from "lucide-react"; // Importamos los iconos de Lucide

interface User {
    id: string;
    username: string; // Cambiado de name a username
    role: string;
}

const UserTable = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/usuarios') // Ajusta la URL según tu API
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleDelete = (userId: string) => {
        fetch(`http://localhost:3000/api/usuarios/${userId}`, {
            method: 'DELETE',
        })
            .then(response => {
















                
                if (response.ok) {
                    setUsers(users.filter(user => user.id !== userId));
                } else {
                    console.error('Error deleting user');
                }
            })
            .catch(error => console.error('Error deleting user:', error));
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full bg-white text-sm text-center">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Nombre de Usuario</th>
                        <th className="px-4 py-2">Rol</th>
                        <th className="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="border px-4 py-2">{user.username}</td>
                            <td className="border px-4 py-2">{user.role}</td>
                            <td className="border px-4 py-2">
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
