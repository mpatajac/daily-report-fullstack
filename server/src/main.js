import express from "express";
import config from "config";
import { apiRouter } from "./router/api.router.js";

(async function () {
	const app = express();
	const port = process.env.PORT || config.get('server.port');

	app.use(express.json());
	app.use('/api', apiRouter);

	app.listen(
		port,
		() => console.log(`Listening on port ${port}`)
	);

})();