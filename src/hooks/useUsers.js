import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { usersReducer } from "../reducers/usersReducer";
import { findALl, remove, save, update } from "../services/userService";
import { use } from "react";

const initialUsers = [];

const initialUserForm = {
    id: 0,
    username: '',
    password: '',
    email: '',
}

const defaulterrors = {
    username: '',
    password: '',
    email: ''
}

export const useUsers = () => {
    const [users, dispatch] = useReducer(usersReducer, initialUsers);
    const [userSelected, setUserSelected] = useState(initialUserForm);
    const [visibleForm, setVisibleForm] = useState(false);
    const [errors, setErrors] = useState(defaulterrors);
    const navigate = useNavigate();




    const getUsers = async () => {
        const result = await findALl();
        dispatch({ type: "loadingUsers", payload: result.data });
    }

    const handlerAddUser = async (user) => {
        let respuesta = null;

        console.log("Users" + users);

        let usuarioExistente;

        try {
            if (user.id === 0) {

            for (let usuarioExistente of  users ) {
                if (usuarioExistente.username === user.username ) {
                    Swal.fire(
                        "Error de Validación",
                        "El nombre de usuario ya existe.",
                        "error"
                    );
                    return;
                }
                if (usuarioExistente.email === user.email) {
                    Swal.fire(
                        "Error de Validación",
                        "El correo ya existe.",
                        "error"
                    );
                    return;
                }
                
            }
            respuesta = await save(user);
            } else {
               
                const arregloTempo = users.filter(usuario => usuario.id !== user.id );
                
                for (let usuarioExistente of  arregloTempo ) {
                    if (usuarioExistente.username === user.username ) {
                        Swal.fire(
                            "Error de Validación",
                            "El nombre de usuario ya existe.",
                            "error"
                        );
                        return;
                    }
                    if (usuarioExistente.email === user.email) {
                        Swal.fire(
                            "Error de Validación",
                            "El correo ya existe.",
                            "error"
                        );
                        return;
                    }
                }
                respuesta = await update(user);

            }
            dispatch({
                type: (user.id === 0) ? 'addUser' : 'updateUser',
                payload: respuesta.data,
            });

            Swal.fire(
                (user.id === 0) ?
                    'Usuario Creado' :
                    'Usuario Actualizado',
                (user.id === 0) ?
                    'El usuario ha sido creado con exito!' :
                    'El usuario ha sido actualizado con exito!',
                'success'
            );
            handlerCloseForm();
            navigate('/users');
        } catch (error) {
            // console.error("Ocurrio un error: ", error.response);
            if (error.response && error.response.status === 400) {
                // console.log("Ocurrio un error: ", error.response.data);
                setErrors(error.response.data)
                // console.log("Tenemos estos errores: ", errors);
            } else 
                throw (error)
            }
        
    }

    const handlerRemoveUser = async (id) => {
        // console.log(id);

        Swal.fire({
            title: 'Esta seguro que desea eliminar?',
            text: "Cuidado el usuario sera eliminado!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                remove({ id });
                dispatch({
                    type: 'removeUser',
                    payload: id,
                });
                Swal.fire(
                    'Eliminado',
                    'El usuario ha sido eliminado con exito!'
                );
            }
        })
    }

    const handlerUserSelectedForm = (user) => {
        // console.log(user)
        setVisibleForm(true);
        setUserSelected({ ...user });
    }

    const handlerOpenForm = () => {
        setVisibleForm(true);
    }

    const handlerCloseForm = () => {
        setVisibleForm(false);
        setUserSelected(initialUserForm);
    }
    return {
        users,
        userSelected,
        initialUserForm,
        visibleForm,
        errors,
        handlerAddUser,
        handlerRemoveUser,
        handlerUserSelectedForm,
        handlerOpenForm,
        handlerCloseForm,
        getUsers,

    }
}