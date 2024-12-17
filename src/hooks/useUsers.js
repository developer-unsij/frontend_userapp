import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { usersReducer } from "../reducers/usersReducer";
import { findAll, update, save, remove} from "../service/userService";

const initialUsers = [];

const defaultErrors = {
    username: '',
    password: '',
    email: '',
}

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
    const [errors, setErrors] = useState(defaultErrors);

    const navigate = useNavigate();

    const getUsers =  async() =>{
        const result = await findAll();
        dispatch({type:"loadingUsers",payload: result.data})
    }
    const handlerAddUser = async (user) => {
        // console.log(user);)
        let response = null; 
        try{
            if (user.id === 0) {
                response = await save(user);
            } else {
                response = await update(user);
            }
            dispatch({
                type: (user.id === 0) ? 'addUser' : 'updateUser',
                payload: response.data,
            });

            Swal.fire(
                (user.id === 0) ?
                    'Usuario Creado' :
                    'Usuario Actualizado',
                    'El usuario ya existe'
                (user.id === 0) ?
                    'El usuario ha sido creado con exito!' :
                    'El usuario ha sido actualizado con exito!',
                'success'
            );
            handlerCloseForm();
            navigate('/users');
        }
        catch(error){
        // tres iguales === para una comparacion estricta
            if(error.response && error.response.status === 400){
                console.error("Error",error.response)
                setErrors(error.response.data)
                console.log("Error ")
            }else if(error.response && error.response.status === 500 && error.response.data?.message?.includes('constraint')){
                console.error("El nombre agregado ya existe",error.response)
                if(error.response.data?.message?.includes('users.UKr43af9ap4edm43mmtq01oddj6')){
                    setErrors({username: "El nombre de usuario ya existe"})
                }
                if(error.response.data?.message?.includes('users.UK6dotkott2kjsp8vw4d0m25fb7')){
                    setErrors({email: "El email ya existe"})
                }if(error.response.data?.message?.includes('users.UK6dotkott2kjsp8vw4d0m25fb7') || error.response.data?.message?.includes('users.UKr43af9ap4edm43mmtq01oddj6')) {
                    setErrors({email: "El nombre del usuario y el email ya existe"})
                }
                console.log(response.data)
            }  else{
                throw (error);
            }
        };
    }

    const handlerRemoveUser = (id) => {
        // console.log(id);
        Swal.fire({
            title: 'Esta seguro que desea eliminar?',
            text: "Cuidado el usuario sera eliminado!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                remove(id);
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
        setErrors(defaultErrors)
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