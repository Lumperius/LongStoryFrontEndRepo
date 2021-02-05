import { backendDomain } from "./objects";

export default function buildQuery(url, queryData)  {
    const urlWithDomain = backendDomain + url;
    if(!queryData){
        return urlWithDomain;
    }
    
    let query = '?';
    for(let prop in queryData){
        query += `${prop}=${queryData[prop]}&`
    }
    return urlWithDomain + query.substring(0, query.length - 1);
}