import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDocumentStore = defineStore("document", () => {
  let getDocumentByTeam = ref([]);

  const getAllDocument = async (workspace_id, team_id) => {
    try {
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/documents`,
      );
      const documents = res.data.data;
      getDocumentByTeam.value = documents;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Get document failed");
    }
  };

  const getDocumentById = async (workspace_id, team_id, docId) => {
    try {
      const res = await api.get(
        `/workspace/${workspace_id}/team/${team_id}/document/${docId}`,
      );
      return res.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Get document failed");
    }
  };

  const createDocument = async (workspace_id, team_id, title) => {
    try {
      const res = await api.post(
        `/workspace/${workspace_id}/team/${team_id}/document`,
        { title },
      );
      return res.data;
    } catch (error) {
      throw (
        new Error(error.response?.data?.message) || "Can not create document"
      );
    }
  };

  const deleteDocument = async (workspace_id, team_id, docId) => {
    try {
      const res = await api.delete(
        `/workspace/${workspace_id}/team/${team_id}/document/${docId}`,
      );
      return res.data;
    } catch (error) {
      throw (
        new Error(error.response?.data?.message) || "Can not delete document"
      );
    }
  };

  const updateTitleDocument = async (
    workspace_id,
    team_id,
    document_id,
    title,
  ) => {
    try {
      const res = await api.put(
        `/workspace/${workspace_id}/team/${team_id}/document/${document_id}/title`,
        { title },
      );
      return res.data.message;
    } catch (error) {
      throw (
        new Error(error.response?.data?.message) || "Can not update document"
      );
    }
  };

  const updateContentDocument = async (
    workspace_id,
    team_id,
    document_id,
    content,
  ) => {
    try {
      const res = await api.put(
        `/workspace/${workspace_id}/team/${team_id}/document/${document_id}/content`,
        { content },
      );
      return res.data.data;
    } catch (error) {
      throw (
        new Error(error.response?.data?.message) || "Can not update content"
      );
    }
  };

  const handleDocumentCreated = (data) => {
    getDocumentByTeam.value = [data, ...getDocumentByTeam.value];
  };

  const handleDocumentUpdated = (data) => {
    const index = getDocumentByTeam.value.findIndex(
      (d) => String(d.document_id) === String(data.document_id),
    );
    if (index !== -1) getDocumentByTeam.value[index] = data;
  };

  const handleDocumentDeleted = ({ document_id }) => {
    getDocumentByTeam.value = getDocumentByTeam.value.filter(
      (d) => String(d.document_id) !== String(document_id),
    );
  };

  return {
    getDocumentByTeam,
    getAllDocument,
    getDocumentById,
    createDocument,
    deleteDocument,
    updateTitleDocument,
    updateContentDocument,
    handleDocumentCreated,
    handleDocumentUpdated,
    handleDocumentDeleted,
  };
});
