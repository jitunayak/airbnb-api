export const handlerError = (error: any) => {
	console.log(error);
	return {
		statusCode: error.status || 500,
		body: JSON.stringify({
			error,
		}),
	};
};
