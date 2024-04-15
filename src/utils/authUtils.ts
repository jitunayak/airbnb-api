import { decode, verify } from 'https://deno.land/x/djwt@v2.4/mod.ts';
import { Context } from 'https://deno.land/x/oak@v12.5.0/context.ts';
import { Middleware, Next } from 'https://deno.land/x/oak@v12.5.0/middleware.ts';

export const authMiddleware: Middleware = async (ctx: Context, next: Next) => {
	const jwt = ctx.request.headers.get('authorization');
	if (!jwt) {
		ctx.response.body = 'Bad Request';
		ctx.response.status = 400;
		return;
	}
	try {
		const jwks = await (await fetch('https://airbnb.kinde.com/.well-known/jwks.json')).json();
		const [header, ,] = decode(jwt);
		const keyId = Object(header).kid;
		const pubJWK = findJWKByKeyId(jwks, String(keyId));
		// parse the JWK to RSA Key
		if (pubJWK) {
			// import the JWK to RSA Key
			const key = await crypto.subtle.importKey('jwk', pubJWK, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, true, ['verify']);
			// verify the signature based on the given public key
			const result = await verify(jwt, key);
			console.log({ result });
			await next();
			return;
		}
	} catch (error) {
		console.log(error);
		ctx.response.body = 'Invalid token';
		ctx.response.status = 401;
	}

	// deno-lint-ignore no-explicit-any
	function findJWKByKeyId(jwks: any, kid: string) {
		return jwks.keys.find(function (x: string) {
			return Object(x).kid == kid;
		});
	}
};
