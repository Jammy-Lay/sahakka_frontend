import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTaskstore = defineStore ('task', () =>{
    const tasks = ref([]);
    async function fetchTasks() {
        try {
            const res = await api.get("/api/sahakka-admin/tasks");
            tasks.value = res.data.data
            console.log(tasks.value);
        } catch (error) {
            
        }
        
    }
    return{
        fetchTasks,
        tasks,
    }
});
