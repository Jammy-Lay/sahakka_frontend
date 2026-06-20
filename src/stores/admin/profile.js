import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useGetProfile = defineStore("profile", () => {
    let loading = ref(true)
    async function changeProfile(avatar) {
        loading.value = true;
        try {
            await api.put("/change-avatar", avatar);
        } catch (error) {
            throw new Error(error.response?.data?.message || "Something is wrong");
        } finally {
            loading.value = false;
        }
    }

    async function changeName(name) {
        loading.value = true;
        try {
            await api.put("/change-name", name);
        } catch (error) {
            throw new Error(error.response?.data?.message || "Something is wrong");
        } finally{
            loading.value = false;
        }
    }
    async function resetAvatar() {
        loading.value = true;
        try {
            await api.delete("/delete-avatar");
        } catch (error) {
            throw new Error(error.response?.data?.message || "Something went wrong");
        } finally{
            loading.value = false;
        }
    }
    return {
        changeProfile,
        resetAvatar,
        changeName,
        loading
    };
});
