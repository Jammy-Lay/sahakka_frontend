import api from "@/api/https";
import { defineStore } from "pinia";

export const useGetProfile = defineStore("profile", () => {
    async function changeProfile(avatar) {
        try {
            await api.put("/change-avatar", avatar);
        } catch (error) {
            throw new Error(error.response?.data?.message || "Something is wrong");
        }
    }

    async function changeName(name) {
        try {
            await api.put("/change-name", name);
        } catch (error) {
            throw new Error(error.response?.data?.message || "Something is wrong");
        }
    }
    async function resetAvatar() {
        try {
            await api.delete("/delete-avatar");
        } catch (error) {
            throw new Error(error.response?.data?.message || "Something went wrong");
        }
    }
    return {
        changeProfile,
        resetAvatar,
        changeName,
    };
});
