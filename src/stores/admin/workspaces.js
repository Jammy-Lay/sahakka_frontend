import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useWorkspaceStore = defineStore ('workspace', () =>{
    const workspaces = ref([]);
    async function fetchWorkspaces() {
        try {
            const res = await api.get("/api/sahakka-admin/workspaces");
            workspaces.value = res.data.data
        } catch (error) {
            
        }
        
    }
    return{
        fetchWorkspaces,
        workspaces,
    }
});
