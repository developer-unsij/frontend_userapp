import axios from "axios"
const BASE_URL = 'http://localhost:8080/users'

export const findALl = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response;
    } catch (error) {
        console.error("Error al obtener los usuarios.", error)        
    }
    return null;
}

export const save = async ({username, email, password}) => {
    try {
        return await axios.post(BASE_URL, {username, email, password});        
    } catch (error) {
        console.error("Error al crear el usuario: ", error.response.data?.error || error.messagge);
    }
    return undefined;
}

export const update = async (user) => {
    try {
        console.log("user: ", user)
        const response = await axios.put(`${BASE_URL}/${user.id}`, user);
        console.log("Respuesta: ", response);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar usuario: ", error.response?.data || error.messagge)
  
        return undefined;
    }
}

export const remove = async ({id}) => {
    try{
        return axios.delete(`${BASE_URL}/${id}`);
    } catch (error){
        console.error("Error al eliminar: ", error);
    }
    return undefined;
}