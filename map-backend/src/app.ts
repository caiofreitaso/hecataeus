import express from 'express';
import { FavoriteService } from './services/favorite.service';

const app = express();
const service = new FavoriteService();

app.use(express.json());
app.get('/favorites', async (req, res) => {
	const favorites = await service.getAll();
	res.json({ favorites });
})

export default app;
