import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore ('user', () =>{
    const users = ref([]);
    async function fetchUsers() {
        try {
            const res = await api.get("/sahakka-api/v2/sahakka-admin/users");
            users.value = res.data.data
        } catch (error) {
            throw new Error(error.response?.data?.message || "Invalid Data");
        }
        
    }
    return{
        fetchUsers,
        users,
    }
});
