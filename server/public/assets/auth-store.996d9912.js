import{d as n}from"./index.10d3f647.js";import{a as s}from"./axios.cbf05cdc.js";import{a as r}from"./AuthService.db15acf2.js";const i=n("auth",{state:()=>({user:null,status:"pending"}),getters:{isAuthenticated(e){return e.user!==null},isAdmin(e){var t;return(t=e.user)==null?void 0:t.admin}},actions:{async check(){const e=await r.me();return this.user=e==null?void 0:e.user,e!==null},async register(e){return await r.register(e)},async login(e){const t=await r.login(e);return s.setToken(t),t},async logout(){s.removeToken()}}});export{i as u};