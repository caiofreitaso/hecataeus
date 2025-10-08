import { Response } from "express";

const HttpVerbs = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS',
];

export function getVerbs(controller: any): string[] {
    return HttpVerbs.filter(verb => controller.prototype[verb.toLowerCase()] !== undefined);
}

export function sendOptions(controller: any, res: Response) {
    res.header('Access-Control-Allow-Origin', '*')
        .header('Access-Control-Allow-Credentials', 'true')
        .header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Origin')
        .header('Access-Control-Allow-Methods', getVerbs(controller).join(', '))
        .status(204)
        .send();
}
