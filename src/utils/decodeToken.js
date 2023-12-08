const jwt = require('jsonwebtoken');
async function decodeToken(token, secretKey){
	if(!token){
		return
	}
	try {
		return await jwt.verify(token, secretKey, {
			ignoreExpiration: true,
		});
	} catch (error) {
		console.log(`Error in decode access token: ${error}`);
		return null;
	}
}
module.export = decodeToken();