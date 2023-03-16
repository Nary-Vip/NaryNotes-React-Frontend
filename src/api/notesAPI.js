import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const notesAPI = {
    getUserNotes: async(token, cancel = false)=> {
      const response = await api.request({
        params: { token: token },
        url: `/notes`,
        method: "GET",
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
      })
      return response.data.notes;
    },
    addUserNotes: async (note, cancel=false)=>{
      const response = await api.request({
        data: note,
        url: `/notes`,
        method: "POST",
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
      })
      return response.data.notes;
    },
    updateUserNote: async(note, cancel = false)=>{
      const response = await api.request({
        url: "/notes",
        method: "PATCH",
        data: note,
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
      })
      return response.data.note;
    },
    deleteUserNote: async(body, cancel = false)=>{
      const response = await api.request({
        url: "/notes",
        method: "DELETE",
        data: body,
        signal: cancel? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
      })
      return response;
    }
    
  }

const cancelApiObject = defineCancelApiObject(notesAPI)