import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore ('user', () =>{
    const users = ref([]);
    async function fetchUsers() {
        try {
            const res = await api.get("/api/sahakka-admin/users");
            users.value = res.data.data
        } catch (error) {
            
        }
        
    }
    return{
        fetchUsers,
        users,
    }
});
