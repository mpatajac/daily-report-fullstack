import jwt from 'jsonwebtoken';
import config from 'config';

export function jwtMiddleware(req, res, next) {
	try {
		const token = req.headers.authorization.slice(7);
		jwt.verify(token, config.get('jwt.secret'));
		next();
	} catch (error) {
		res.sendStatus(401);
	}
}
