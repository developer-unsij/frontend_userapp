import axios from "axios"

const BASE_URL= "http://localhost:8080/users";
export const findAll = async () => {
    try{
        const response = await axios.get(BASE_URL);
        return response;
    }catch(error){
        console.error("Error al obtener los usuarios ")
    }
    return null;
}

export const save = async({userName, email, password}) =>{
    try {
        return await axios.post(BASE_URL, {userName, email, password})
    } catch (error) {
        console.error("Error al crear el usuario: ", error);
    }
    return null;
}

export const update = async ( user ) => {
    try {
        return await axios.put(`${BASE_URL}/${user.id}`,{user});
    } catch (error) {
        console.error("Error al actualizar el usuario: ", error);
    }
    return null;
};

export const remove = async (id) => {
    try {
        return await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error al eliminar el usuario: ", error);
    }
    return null;
};
