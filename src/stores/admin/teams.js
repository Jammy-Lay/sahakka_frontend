import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTeamstore = defineStore ('team', () =>{
    const teams = ref([]);
    const currentTeam = ref(null);
    async function fetchTeams() {
        try {
            const res = await api.get("/api/sahakka-admin/teams");
            teams.value = res.data.data
            console.log(teams.value);
        } catch (error) {
            console.error("Failed to fetch teams:", error);
        }
        
    }
    async function teamId(workspace_id, team_id) {
        try {
            const res = await api.get(`/api/sahakka-admin/workspace/${workspace_id}/teams/${team_id}`)
            currentTeam.value = res.data.data[0];
        } catch (error) {
            console.error("Failed to fetch team:", error);
        }
    }
    return{
        fetchTeams,
        teamId,
        teams,
        currentTeam
    }
});
