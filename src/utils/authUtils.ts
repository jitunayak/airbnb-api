import { NextFunction, Request, Response } from 'express';
import { BadRequest, Forbidden } from 'http-errors';
import { verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { AccessPayload, IPermission } from '../types/common';
import { env } from './config';
import { handlerError } from './util';

let authPayload: AccessPayload = {
	permissions: [],
	role: 'airbnb-user',
	sub: '',
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// get the bearer token
		const jwt = req.get('Authorization')?.split(' ')[1];
		if (!jwt) {
			throw BadRequest('Missing authorization header');
		}
		const AUTH_SERVER_URL = `${env.KINDE_DOMAIN}.well-known/jwks.json`;
		const jwks = await (await fetch(AUTH_SERVER_URL)).json();
		const client = new JwksClient({
			jwksUri: AUTH_SERVER_URL,
		});
		const kid = jwks.keys[0].kid;
		const key = await client.getSigningKey(kid);
		const result = verify(jwt, key.getPublicKey(), { algorithms: ['RS256'] });
		// req.authPayload = result as AccessPayload;
		await next();
	} catch (error) {
		handlerError(req, res, error as Error);
	}
};

export const hasRole = (permission: IPermission) => {
	// if (authPayload.role !== role) {
	// 	throw createHttpError(403, 'Forbidden');
	// }

	if (!authPayload.permissions.includes(permission)) {
		throw Forbidden('Forbidden');
	}
};
