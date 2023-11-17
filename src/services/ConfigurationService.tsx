/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpApiService from "./HttpApiService";

 const configAPI = "http://localhost:8080"
 const configAPIs = "http://localhost:3000/getTenantByName"
export class Configuration extends HttpApiService {
  constructor() {
    super(`${configAPI}`);
  }
  
  getConfiguration = ()=>{
    return this.get(`${configAPI}/config.json`)
  }
  getTenantDetails = (data:any)=>{
    return this.get(`${configAPIs}/?name=${data}`)
  }
  getLangHindi = ()=>{
    return this.get(`${configAPI}/hi.json`)
  }
  getLangEnglish = ()=>{
    return this.get(`${configAPI}/en.json`)
  }
 
}
export const ConfigurationService = new Configuration();