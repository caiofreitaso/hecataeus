import { QueryOptionsWithType, QueryTypes, Sequelize } from "sequelize";

export type LatLngExpression = [number, number];
export interface Address {
    street?: string;
    area?: string;
    city?: string;
    state?: string;
}

export class ReverseGeocodeService {
    constructor(private readonly db: Sequelize) { }

    get(coords: LatLngExpression): Promise<Address> {
        const options: QueryOptionsWithType<QueryTypes.SELECT> = {
            type: QueryTypes.SELECT,
            replacements: [`SRID=4326;POINT(${coords[1]} ${coords[0]})`],
        };

        return Promise.all([
            this.db.query<{ name: string }>(`
SELECT name
FROM (
    SELECT
        COALESCE(name, ref) AS name,
        way
    FROM planet_osm_line
    WHERE
        (name IS NOT NULL OR ref IS NOT NULL)
        AND highway IS NOT NULL
    UNION ALL
    SELECT
        COALESCE(name, ref) AS name,
        way
    FROM planet_osm_roads
    WHERE
        highway IS NOT NULL
        AND ref IS NOT NULL
) all_roads
ORDER BY ST_Distance(way, ST_Transform(?::geometry, 3857)) ASC
LIMIT 1;`, options),
            this.db.query<{ name: string }>(`
SELECT name
FROM planet_osm_polygon
WHERE
    name IS NOT NULL
    AND boundary = 'administrative'
    AND admin_level = '10'
ORDER BY ST_Distance(way, ST_Transform(?::geometry, 3857)) ASC
LIMIT 1`, options),
            this.db.query<{ name: string }>(`
SELECT name
FROM planet_osm_polygon
WHERE
    name IS NOT NULL
    AND boundary = 'administrative'
    AND admin_level = '8'
ORDER BY ST_Distance(way, ST_Transform(?::geometry, 3857)) ASC
LIMIT 1`, options),
            this.db.query<{ name: string }>(`
SELECT
    COALESCE(tags->'short_name', name) AS name
FROM planet_osm_polygon
WHERE
    name IS NOT NULL
    AND boundary = 'administrative'
    AND admin_level = '4'
ORDER BY ST_Distance(way, ST_Transform(?::geometry, 3857)) ASC
LIMIT 1`, options),
        ]).then(([street, area, city, state]) => {
            return ({
                street: street[0].name,
                area: area[0].name,
                city: city[0].name,
                state: state[0].name,
            })
        });
    }
}
