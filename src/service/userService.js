import axios from "axios"
const BASE_URL = "http://localhost:8080/users"
export const findAll = async () => {
    try{
        const response = await axios.get("BASE_URL");
        return response;
    }catch(error){
        console.error("Error al obtener los usarios")
    }
    return null;
}
export const save = async({username, email, password}) => {
    try{
        return await axios.post(BASE_URL, {username, email, password})
    }catch(error){
        console.error("Error a la crear usuario: ", error)
    }
    return undefined;
}

export const update = async({username, email, password}) => {
    try{
        return await axios.post(BASE_URL, {username, email, password})
    }catch(error){
        console.error("Error al actualizar usuario: ", error)
    }
    return undefined;
}

export const remove = async({username, email, password}) => {
    try{
        return await axios.post(BASE_URL, {username, email, password})
    }catch(error){
        console.error("Error al eliminar usuario: ", error)
    }
    return undefined;
}