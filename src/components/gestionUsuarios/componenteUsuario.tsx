
import UserTable from './tablaUsuarios';
import CreateUser from './crearUsuario';

const UserManagement = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Gestión de Usuarios</h1>
            <div className="mb-6">
                <h2 className="text-xl mb-2">Crear Nuevo Usuario</h2>
                <CreateUser />
            </div>
            <div>
                <h2 className="text-xl mb-2">Lista de Usuarios</h2>
                <UserTable />
            </div>
        </div>
    );
};

export default UserManagement;
