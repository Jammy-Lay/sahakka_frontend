// utils/notify.js
import { useToast } from "vue-toastification";

export const notify = (router) => {
  const toast = useToast();

  return {
    success(text, location) {
      toast.success(text, {
        position: "bottom-left",
        timeout: 2000,
      });

      if (location) {
        setTimeout(() => {
          router.push(location);
        }, 2000);
      }
    },

    error(text) {
      toast.error(text, {
        position: "bottom-left",
        timeout: 1500,
      });
    },
  };
};
