import { ErrorHandler } from "@angular/core";
const fundebug: any = require("fundebug-javascript");
fundebug.apikey = "94ec73b2e06ba742002313c1e0a2e4b84b22143daab8fb2697a7e564f1569bf5";

export class FundebugErrorHandler implements ErrorHandler {

    constructor(){}

    handleError(error: any){
        fundebug.notifyError(error)
    }
}