import { Request, Response } from "express";
import { LatLngExpression, ReverseGeocodeService } from "../services/reverse-geocode.service";
import { sendOptions } from "./util";

export class ReverseGeocodeController {
    constructor(private readonly service: ReverseGeocodeService) { }

    async get(req: Request, res: Response): Promise<void> {
        const input = req.query['coords'] as [string, string];
        const coords: LatLngExpression = input.map(v => Number.parseFloat(v)) as [number, number];
        const address = await this.service.get(coords);

        res.header('Access-Control-Allow-Origin', '*')
            .json({ address });
    }

    options(req: Request, res: Response): void {
        sendOptions(ReverseGeocodeController, res);
    }
}
