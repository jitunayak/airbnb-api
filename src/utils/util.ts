export const handlerError = (error: any) => {
	console.log(error);
	return {
		statusCode: 400,
		body: JSON.stringify({
			error,
		}),
	};
};
