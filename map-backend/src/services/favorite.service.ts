import { DataTypes, Sequelize } from "sequelize";
import { SavedPoint } from "../models/save-point.model";

export interface Favorite {
    name: string;
    coords: [ number, number ];
}

export class FavoriteService {
    private readonly db: Sequelize;
    private readonly SavedPoint;

    constructor() {
        this.db = new Sequelize({
            host: '192.168.0.123',
            port: 5432,
            username: 'osm',
            password: '123456',
            database: 'gis',
            dialect: 'postgres'
        });
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
        },
        {
            sequelize: this.db,
            tableName: 'saved_point',
            timestamps: false,
        })
    }

    getAll(): Promise<Favorite[]> {
        return this.db.query<SavedPoint>('SELECT name, ST_AsGeoJSON(ST_Transform(way,4326)) as way FROM saved_point')
            .then(points => points.map(p => ({ name: p.name, coords: p.way.coordinates })));
    }
}
