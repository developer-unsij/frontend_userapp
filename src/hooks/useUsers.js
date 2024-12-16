import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { usersReducer } from "../reducers/usersReducer";
import { findAll, remove, save, update } from "../services/userService";

const initialUsers = [];

const defaultErrors = {username:'',password:'',email:''};


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
    const [errors, setErrors] = useState (defaultErrors);

    const navigate = useNavigate();
    

    const getUsers = async() => {
        const result = await findAll();
        dispatch({type:"loadingUsers", payload:result.data})
    }

    const handlerAddUser = async (user) => {
        //console.log(user);
        let user1;
        try {
            if(user.id === 0){
                user1= await save(user)
               }else{
                user1=  await update(user)
               }
           // console.log("USER1 ==",user1)
           dispatch({
               type: (user.id === 0) ? 'addUser' : 'updateUser',
               payload:user1.data,
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
           setErrors([]);
           navigate('/users');
        } catch (error) {
           // console.error("Este es el error", error.response);
           if (error.response && error.response.status === 400) {
           console.error("Este es el error", error.response.data);
            setErrors(error.response.data);
           }else{
            throw error;
           }
            
        }  
     
    }

    const handlerRemoveUser =(id) => {
        // console.log(id);
        Swal.fire({
            title: 'Esta seguro que desea eliminar?',
            text: "Cuidado el usuario sera eliminado!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then((result)  => {
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