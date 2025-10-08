import { Request, Response } from "express";
import { FavoriteService } from "../services/favorite.service";
import { sendOptions } from "./util";

export class FavoriteController {
    constructor(private readonly service: FavoriteService) { }

    async get(req: Request, res: Response): Promise<void> {
        const favorites = await this.service.getAll();

        res.header('Access-Control-Allow-Origin', '*')
            .json({ favorites });
    }

    options(req: Request, res: Response): void {
        sendOptions(FavoriteController, res);
    }
}
