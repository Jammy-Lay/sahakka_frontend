import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useWorkspaceStore = defineStore ('workspace', () =>{
    const workspaces = ref([]);
    async function fetchWorkspaces() {
        try {
            const res = await api.get("/sahakka-admin/workspaces");
            workspaces.value = res.data.data
        } catch (error) {
            throw new Error(error.response?.data?.message || "Invalid Workspaces");
        }
        
    }
    return{
        fetchWorkspaces,
        workspaces,
    }
});
