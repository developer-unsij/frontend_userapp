import axios from "axios"

const BASE_URL= "http://localhost:8080/users"

export const findAll = async () => {

    try {
        const response = await axios.get(BASE_URL);
        return response;
    
    } catch (error) {
        console.error("Error al obtener los usuarios");

    }
    return null;
}

export const save = async ({username, email, password}) => {
    try {
       
        const response = await axios.post(BASE_URL, {username, email, password});
        return response.data;

    } catch (error) {
        console.error("Eroor al crear el usuario: ", error);
    }
    return undefined;
}

export const update = async (id,  username, email) => {
    try {
        
        const response = await axios.put(`${BASE_URL}/${id}`, { username, email });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el usuario: ", error);
    }
    return undefined;
}

/*export const update = async (user) => {
    try {
        return await axios.put(`${BASE_URL}/${user.id}`, { user.userName, email });
    } catch (error) {
        console.error("Error al actualizar el usuario: ", error);
    }
    return undefined;
}*/

export const remove = async (id) => {
    try {
        return await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error al eliminar el usuario: ", error);
    }
    return undefined;
}
