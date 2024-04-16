import { isHttpError } from 'https://deno.land/std@0.188.0/http/http_errors.ts';
import { Context } from 'https://deno.land/x/oak@v12.5.0/context.ts';

export const handlerError = (ctx: Context, error: any) => {
	console.log(error);
	if (isHttpError(error)) {
		ctx.response.status = error.status;
		ctx.response.body = error.message;
	}
};
