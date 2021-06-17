import express from "express";
import config from "config";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from "./router/api.router.js";

(async function () {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);

	const app = express();
	const port = process.env.PORT || config.get('server.port');

	app.use(express.json());
	app.use(express.static(path.join(__dirname, '/../public')));
	app.use('/api', apiRouter);


	app.get('*', (_, res) => {
		res.sendFile(path.join(__dirname, '/../public/index.html'));
	});

	app.listen(
		port,
		() => console.log(`Listening on port ${port}`)
	);

})();