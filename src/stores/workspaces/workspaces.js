import { defineStore } from "pinia";
import api from "@/api/https";

export const useCrudWorkspaceStore = defineStore("works", () => {

  const createWorkspace = async (name) => {
    try {
      const res = await api.post("/api/create-workspace", {
        name: name.trim(),
      });

      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Create workspace failed"
      );
    }
  };

  const deleteWorkspace = async (id) => {
    try {
      const res = await api.delete(`/api/workspace/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Delete workspace failed"
      );
    }
  };

  const updateWorkspace = async (id, name) => {
    try {
      const res = await api.put(`/api/workspace/${id}`, {
        name: name.trim(),
      });

      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Update workspace failed"
      );
    }
  };

const joinByToken = async (token) => {
  try {
    const res = await api.post("/api/invite/join", {
      token,
    });

    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Join workspace failed"
    );
  }
};

  return {
    createWorkspace,
    deleteWorkspace,
    updateWorkspace,
    joinByToken
  };
});