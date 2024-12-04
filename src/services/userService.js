import axios from "axios"

const BASE_URL = "http://localhost:8080/users";

export const findAll = async () => {
    try{
        const response = await axios.get(BASE_URL);
        return response;
    }catch(error){
        console.error("Error al obtener los usuarios ", error)
    }
    return null;
}

export const save = async ({username, email, password}) => {
    try{
        return await axios.post(BASE_URL, {username,email,password});
    }catch(error){
        console.error("Error al crear el usuario ", error);
    }
    return null;
}