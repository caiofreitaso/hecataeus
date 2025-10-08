import express from 'express';
import { Sequelize } from 'sequelize';
import { FavoriteController } from './controllers/favorite.controller';
import { ReverseGeocodeController } from './controllers/reverse-geocode.controller';
import { FavoriteService } from './services/favorite.service';
import { ReverseGeocodeService } from './services/reverse-geocode.service';

const app = express();
const database = new Sequelize({
    host: '192.168.0.57',
    port: 5432,
    username: 'osm',
    password: '123456',
    database: 'gis',
    dialect: 'postgres'
});
const favService = new FavoriteService(database);
const geoService = new ReverseGeocodeService(database);
const favorites = new FavoriteController(favService);
const reverseGeocode = new ReverseGeocodeController(geoService);

app.use(express.json());

app.get('/favorites', async (req, res) => favorites.get(req, res));
app.options('/favorites', (req, res) => favorites.options(req, res));


app.get('/address', async (req, res) => reverseGeocode.get(req, res));
app.options('/address', (req, res) => reverseGeocode.options(req, res));

export default app;
