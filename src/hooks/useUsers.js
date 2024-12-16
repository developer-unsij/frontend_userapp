
import { useReducer, useState } from "react";
import { Await, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { usersReducer } from "../reducers/usersReducer";
import { deleteUser, findAll, save, update } from "../services/userService";

const defaultErriors = {
    username: '',
    password: '',
    email: '',
}

const initialUsers = [
];

const initialUserForm = {
    id: 0,
    username: '',
    password: '',
    email: '',
}

export const useUsers = () => {
    const [users, dispatch] = useReducer(usersReducer, initialUsers);
    const [userSelected, setUserSelected] = useState(initialUserForm);
    const [visibleForm, setVisibleForm] = useState(false);
    const [errors, setErrors] = useState (defaultErriors);

    const navigate = useNavigate();

    const getUsers = async() => {
        const result = await findAll();
        console.log(result);
        dispatch({type:"loadingUsers",payload: result.data});
    }

    const handlerAddUser = async (user) => {
        let response;

        try{
            //console.log("ANTES DEL IF"+user);
            if(user.id === 0 ){
                response = await save(user);
                setErrors('');
            }else{
                response = await update(user);
                setErrors('');
            }
            console.log("DESPUES DEL IF"+response);

            // console.log(user);
            dispatch({
                type: (user.id === 0) ? 'addUser' : 'updateUser',
                payload:response.data,
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

        }catch(error){
            if(error.response && error.response.status === 400){
                console.error("Error",error.response.data);
                setErrors(error.response.data);
            }else{
                throw errors;
            }
        }
    }

    const handlerRemoveUser = (id) => {
        Swal.fire({
            title: 'Esta seguro que desea eliminar?',
            text: "Cuidado el usuario sera eliminado!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then ((result)  =>   {
            if (result.isConfirmed)  {
                deleteUser(id);

                dispatch({
                    type: 'removeUser',
                    payload: id,
                });
                Swal.fire(
                    'Usuario Eliminado!',
                    'El usuario ha sido eliminado con exito!',
                    'success'
                )
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

