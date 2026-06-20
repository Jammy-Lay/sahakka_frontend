import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

let loading = ref(true);
export const useTeamstore = defineStore ('team', () =>{
    const teams = ref([]);
    const currentTeam = ref(null);
    loading = true;
    async function fetchTeams() {
        try {
            const res = await api.get("/sahakka-admin/teams");
            teams.value = res.data.data
        } catch (error) {
            throw new Error(error.response?.data?.message || "Invalid Teams");
        } finally {
            loading = false;
        }
        
    }
    async function teamId(workspace_id, team_id) {
        try {
            const res = await api.get(`/sahakka-admin/workspace/${workspace_id}/teams/${team_id}`)
            currentTeam.value = res.data.data[0];
        } catch (error) {
            throw new Error(error.response?.data?.message || "Invalid Teams");
        } finally {
            loading = false;
        }
    }
    return{
        fetchTeams,
        teamId,
        teams,
        currentTeam,
        loading
    }
});
