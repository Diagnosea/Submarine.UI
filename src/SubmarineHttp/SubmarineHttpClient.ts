import * as StatusCodeMap from "./SubmarineStatusCodeMap";
import SubmarineError from "./Errors/SubmarineError";
import SubmarineExceptionalError from "./Errors/SubmarineExceptionalError";
import ISubmarineExceptionResponse from "./ISubmarineExceptionResponse";
import ISubmarineValidationResponse from "./ISubmarineValidationResponse";
import SubmarineValidationError from "./Errors/SubmarineValidationError";
import HttpClientMethod from "../Http/HttpClientMethod";
import HttpClient from "../Http/HttpClient";
import HttpClientAcceptHeader from "../Http/Headers/HttpClientAcceptHeader";
import HttpClientBearerAuthorizationHeader from "../Http/Headers/HttpClientBearerAuthorizationHeader";

export default abstract class SubmarineHttpClient extends HttpClient {

    protected constructor(version: string, route: string) {
        super(`${version}/${route}`);

        this._setAcceptHeader("application/json")
    }

    public setBearerToken(bearerToken: string) {
        const header = new HttpClientBearerAuthorizationHeader(bearerToken);
        this._headers.push(header);
    }

    public get<TResponse>(url: string, init: RequestInit = {}): Promise<TResponse> {
        init.method = HttpClientMethod.GET;

        return this._performSubmarineHttpRequest<TResponse>(url, init);
    }

    public post<TRequest, TResponse>(url: string, body: TRequest, init: RequestInit = {}) {
        init.method = HttpClientMethod.POST;
        init.body = JSON.stringify(body);

        return this._performSubmarineHttpRequest<TResponse>(url, init)
    }

    public put<TRequest, TResponse>(url: string, body: TRequest, init: RequestInit = {}) {
        init.method = HttpClientMethod.PUT;
        init.body = JSON.stringify(body);

        return this._performSubmarineHttpRequest<TResponse>(url, init);
    }

    public delete(url: string, init: RequestInit = {}) {
        init.method = HttpClientMethod.DELETE;

        return this._performSubmarineHttpRequest<void>(url, init);
    }

    private _setAcceptHeader(...contentTypes: string[]) {
        const acceptHeader = new HttpClientAcceptHeader(contentTypes);
        this._headers.push(acceptHeader);
    }

    protected async _performSubmarineHttpRequest<TResponse>(url: string, options: RequestInit): Promise<TResponse>  {
        const response = await super._performHttpRequest(url, options);

        await SubmarineHttpClient._validateAuthorizationFailureStatusCodes(response);
        await SubmarineHttpClient._validateExceptionalFailureStatusCodes(response);
        await SubmarineHttpClient._validateValidationFailureStatusCodes(response);

        if (StatusCodeMap.formedSuccessStatusCodes.includes(response.status)) {
            return await response.json();
        }

        if (StatusCodeMap.unformedSuccessStatusCodes.includes(response.status)) {
            return {} as TResponse;
        }

        throw new SubmarineError("Unable to Resolve Request");
    }

    private static async _validateAuthorizationFailureStatusCodes(response: Response) {
        if (StatusCodeMap.authorizationFailureStatusCodes.includes(response.status)) {
            throw new SubmarineError("Configured Authorization is Invalid");
        }
    }

    private static async _validateValidationFailureStatusCodes(response: Response) {
        if (StatusCodeMap.validationFailureStatusCodes.includes(response.status)) {
            const validationResponse: ISubmarineValidationResponse = await response.json();
            throw new SubmarineValidationError(validationResponse.errors);
        }
    }

    private static async _validateExceptionalFailureStatusCodes(response: Response) {
        if (StatusCodeMap.exceptionalFailureStatusCodes.includes(response.status)) {
            const exceptionResponse: ISubmarineExceptionResponse = await response.json();
            throw new SubmarineExceptionalError(
                exceptionResponse.exceptionCode,
                exceptionResponse.technicalMessage,
                exceptionResponse.userMessage)
        }
    }
}
