// deno-lint-ignore-file no-explicit-any
import { createHttpError } from 'https://deno.land/std@0.188.0/http/http_errors.ts';
import { decode, verify } from 'https://deno.land/x/djwt@v2.4/mod.ts';
import { Context } from 'https://deno.land/x/oak@v12.5.0/context.ts';
import { Middleware, Next } from 'https://deno.land/x/oak@v12.5.0/middleware.ts';
import { AccessPayload, IPermission } from '../types/common.ts';
import { env } from './config.ts';
import { handlerError } from './util.ts';

function findJWKByKeyId(jwks: any, kid: string) {
	return jwks.keys.find(function (x: string) {
		return Object(x).kid == kid;
	});
}

let authPayload: AccessPayload = {
	permissions: [],
	role: 'airbnb-user',
	sub: '',
};

export const verifyToken: Middleware = async (ctx: Context, next: Next) => {
	try {
		// get the bearer token
		const jwt = ctx.request.headers.get('Authorization')?.split(' ')[1];
		// console.log({ jwt });
		if (!jwt) {
			throw createHttpError(400, 'Missing authorization header');
		}
		const jwks = await (await fetch(`${env.KINDE_DOMAIN}.well-known/jwks.json`)).json();
		const [header, payload] = decode(jwt);
		authPayload = payload as any;
		const keyId = Object(header).kid;
		const pubJWK = findJWKByKeyId(jwks, String(keyId));
		if (!pubJWK) {
			throw createHttpError(500, 'kid not found');
		}
		const key = await crypto.subtle.importKey('jwk', pubJWK, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, true, ['verify']);
		const result = await verify(jwt, key);
		console.log({ result });
		await next();
	} catch (error) {
		handlerError(ctx, error);
	}
};

export const hasRole = (permission: IPermission) => {
	// if (authPayload.role !== role) {
	// 	throw createHttpError(403, 'Forbidden');
	// }

	if (!authPayload.permissions.includes(permission)) {
		throw createHttpError(403, 'Forbidden');
	}
};
