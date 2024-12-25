import { makeAutoObservable, reaction } from "mobx";
import { serverError } from "../models/serverError";
import { tr } from "date-fns/locale";

export default class CommonStore{
    error:serverError|null=null;
    token:string|null = localStorage.getItem('jwt');
    appLoaded = false;
    constructor() {
        makeAutoObservable(this);
        reaction(
            ()=>this.token,
            token=>{
                if(token) {
                    localStorage.setItem('jwt',token)
                }
                else {
                    localStorage.removeItem('jwt')
                }
            }
        )
    }
    serServerError(error:serverError) {
        this.error=error
    }

    setToken = (token:string|null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded=true
    }
}