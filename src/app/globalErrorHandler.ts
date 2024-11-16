import { ErrorHandler } from "@angular/core";

export class GlobalErrorHandler implements ErrorHandler {

    constructor(){}

    handleError(error: any){
        const debugLogs = localStorage.getItem("debugLog") ? JSON.parse(localStorage.getItem("debugLog")) : []
        debugLogs.push(error.stack)
        localStorage.setItem("debugLog",JSON.stringify(debugLogs))
    }
}