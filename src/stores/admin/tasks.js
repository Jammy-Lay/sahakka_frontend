import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

let loading = ref(true); 
export const useTaskstore = defineStore ('tasks', () =>{
    const tasks = ref([]);
    loading.value = true;
    async function fetchTasks() {
        try {
            const res = await api.get("/sahakka-admin/tasks");
            tasks.value = res.data.data
        } catch (error) {
            throw new Error(error.response?.data?.message || "Invalid Tasks");
        } finally{
            loading.value = false;
        }
        
    }
    return{
        fetchTasks,
        tasks,
        loading
    }
});
