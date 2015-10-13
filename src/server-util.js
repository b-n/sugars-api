export function enableCORS(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
   
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};

//to implement
export function handleSuccess(result, res) {
    let responseMessage = { status: 'success' };
    if (result !== null) responseMessage.result = result;
    res.status(200).send(responseMessage);
}

export function handleError(err, status, res) {
    let responseMessage = { status: 'error' };
    if (err.message !== null) responseMessage.message = err.message;
    rest.status(status).send(responseMessage);
}
