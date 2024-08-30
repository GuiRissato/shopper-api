"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBase64 = validateBase64;
exports.getCurrentMonth = getCurrentMonth;
function validateBase64(base64String) {
    const base64Regex = /^data:image\/(jpeg|png|gif|bmp);base64,[A-Za-z0-9+/]+={0,2}$/;
    return base64Regex.test(base64String);
}
function getCurrentMonth(dateString) {
    const date = new Date(dateString);
    return date.getMonth() + 1;
}
