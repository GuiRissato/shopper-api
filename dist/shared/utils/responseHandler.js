"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
const responseHandler = (res, statusCode, errorCode = null, errorDescription = null, data = {}) => {
    if (errorCode && errorDescription) {
        return res.status(statusCode).json({
            error_code: errorCode,
            error_description: errorDescription,
        });
    }
    return res.status(statusCode).json(data);
};
exports.responseHandler = responseHandler;
