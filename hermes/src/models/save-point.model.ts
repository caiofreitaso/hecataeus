import { InferAttributes, InferCreationAttributes, Model } from "sequelize";

export class SavedPoint extends Model<InferAttributes<SavedPoint>, InferCreationAttributes<SavedPoint>> {
    declare id: number;
    declare name: string;
    declare way: {
        type: 'Point';
        coordinates: [number, number];
    }
}
