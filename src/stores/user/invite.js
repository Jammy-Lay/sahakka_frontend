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
    } catch (err) {
      throw new Error(err.response?.data?.message);
    }
  };

  const generatePasscode = async (workspace_id, team_id) => {
    try {
      const res = await api.post(
        `/workspace/${workspace_id}/team/${team_id}/invite`,
      );

      // console.log("API:", res.data);

      return res.data;
    } catch (error) {
      throw new Error(err.response?.data?.message || "generate team failed");
    }
  };

  const joinInvite = async (token) => {
    try {
      const res = await api.post("/invite/join", {
        token,
      });

      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "join invite failed");
    }
  };

  return {
    generatePasscode,
    inviteByEmail,
    joinInvite,
  };
});
