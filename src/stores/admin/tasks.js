import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTaskstore = defineStore ('task', () =>{
    const tasks = ref([]);
    async function fetchTasks() {
        try {
            const res = await api.get("/sahakka-admin/tasks");
            tasks.value = res.data.data
        } catch (error) {
            throw new Error(error.response?.data?.message || "Invalid Tasks");
        }
        
    }
    return{
        fetchTasks,
        tasks,
    }
});
