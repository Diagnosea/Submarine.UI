import HttpClientStatusCode from "../Http/HttpClientStatusCode";

export const formedSuccessStatusCodes = [
    HttpClientStatusCode.OK,
    HttpClientStatusCode.Created
];

export const unformedSuccessStatusCodes = [
    HttpClientStatusCode.NoContent
];

export const validationFailureStatusCodes = [
    HttpClientStatusCode.BadRequest
];

export const exceptionalFailureStatusCodes = [
    HttpClientStatusCode.NotFound,
    HttpClientStatusCode.Conflict
];

export const authorizationFailureStatusCodes = [
    HttpClientStatusCode.Unauthorized,
    HttpClientStatusCode.Forbidden
];
