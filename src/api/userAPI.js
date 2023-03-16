import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const userAPI = {
    getUser: async(token, cancel = false) =>{
      const response = await api.request({
        params: { token: token },
        url: `/users`,
        method: "GET",
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
      })
      return response.data.user
    },
    updateProfile: async(body, cancel = false)=>{
      const response = await api.request({
        url: '/users',
        method: 'PATCH',
        data: body,
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
      })
      return response.data.user 
    }
  }

const cancelApiObject = defineCancelApiObject(userAPI)