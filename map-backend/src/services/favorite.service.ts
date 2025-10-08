import { DataTypes, QueryTypes, Sequelize } from "sequelize";
import { SavedPoint } from "../models/save-point.model";

export interface Favorite {
    name: string;
    coords: [number, number];
}

export class FavoriteService {
    private readonly SavedPoint;

    constructor(private readonly db: Sequelize) {
        this.SavedPoint = SavedPoint.init(
            {
                id: {
                    type: DataTypes.BIGINT,
                    primaryKey: true,
                },
                name: { type: DataTypes.TEXT },
                way: {
                    type: DataTypes.GEOMETRY("POINT", 3857),
                    allowNull: false,
                }
            },
            {
                sequelize: this.db,
                tableName: 'saved_point',
                timestamps: false,
            }
        );
    }

    getAll(): Promise<Favorite[]> {
        return this.db.query<SavedPoint>(
            'SELECT name, ST_SwapOrdinates(ST_Transform(way,4326),\'xy\') as way FROM saved_point',
            { type: QueryTypes.SELECT }
        ).then(points => points.map(p => ({ name: p.name, coords: p.way.coordinates })));
    }
}
