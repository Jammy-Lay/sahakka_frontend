import api from "@/api/https";
import { defineStore } from "pinia";

export const useInviteStore = defineStore("invite", () => {
  const inviteByEmail = async (workspace_id, team_id, email) => {
    try {
      const res = await api.post(
        `/workspace/${workspace_id}/team/${team_id}/invite/email`,
        {
          email,
        },
      );
    //   console.log(res.data);
      return res.data;
    } catch (error) {
    //   console.error("Invite failed:", error);
      throw error;
    }
  };
  const generatePasscode = async (workspace_id, team_id) => {
    const res = await api.post(
      `/workspace/${workspace_id}/team/${team_id}/invite`,
    );

    // console.log("API:", res.data);

    return res.data;
  };

  return {
    generatePasscode,
    inviteByEmail,
  };
});
