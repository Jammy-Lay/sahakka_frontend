import api from "@/api/https";
import { defineStore } from "pinia";
import { ref } from "vue";
import html2pdf from "html2pdf.js";
import { marked } from "marked";

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
  const downloadDocument = async (workspaceId, teamId, documentId, title) => {
    const res = await api.get(
      `/workspace/${workspaceId}/team/${teamId}/document/${documentId}`,
    );

    const { result, message, data } = res.data;
    if (!result) throw new Error(message || "Failed to get document");

    const bodyHtml = data.content;

    const container = document.createElement("div");
    container.style.padding = "24px";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.color = "#1a1a1a";
    container.innerHTML = `
  <style>
    h1 { font-size: 32px; font-weight: 700; color: #3b82f6; margin: 0 0 16px; }
    blockquote {
      border-left: 4px solid #3b82f6;
      margin: 12px 0;
      padding: 12px 16px;
      background: #dbeafe;
      color: #1e3a5f;
    }
    pre {
      background: #f3f4f6;
      padding: 10px 14px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 12px 0;
      display: inline-block;
    }
    pre code {
      font-family: "Courier New", monospace;
      font-size: 13px;
      color: #db2777;
    }
    p { font-size: 14px; line-height: 1.6; margin: 0 0 12px; }
    strong { font-weight: 700; }
  </style>
  ${data.content}
`;

    const opt = {
      margin: 10,
      filename: `${sanitizeFilename(title)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    await html2pdf().set(opt).from(container).save();
  };

  function sanitizeFilename(name) {
    return name.replace(/[/\\?%*:|"<>]/g, "-").trim() || "document";
  }

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
    downloadDocument,
  };
});
