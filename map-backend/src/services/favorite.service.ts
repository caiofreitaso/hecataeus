import { DataTypes } from "sequelize";
import { SavedPoint } from "../models/save-point.model";

export class FavoriteService {
    constructor() {
        this.SavedPoint = SavedPoint.init({
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
            },
            name: { type: DataTypes.TEXT },
            way: {
                type: DataTypes.GEOMETRY("POINT", 3857),
                allowNull: false,
            }
        })
    }
}
