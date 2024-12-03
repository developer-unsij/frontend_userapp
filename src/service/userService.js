import axios from "axios"

export const findAll = async () => {
    try{
        const response = await axios.get("http://localhost:8080/users");
        return response;
    }catch(error){
        console.error("Error al obtener los usarios")
    }
    return null;
}
    