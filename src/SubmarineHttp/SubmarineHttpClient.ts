import HttpClient from "../Http/HttpClient";
import * as StatusCodeMap from "./SubmarineStatusCodeMap";
import SubmarineError from "./Errors/SubmarineError";
import SubmarineExceptionalError from "./Errors/SubmarineExceptionalError";
import ISubmarineExceptionResponse from "./ISubmarineExceptionResponse";
import ISubmarineValidationResponse from "./ISubmarineValidationResponse";
import SubmarineValidationError from "./Errors/SubmarineValidationError";
import HttpClientMethod from "../Http/HttpClientMethod";

export default class SubmarineHttpClient extends HttpClient {
    private readonly _version: string;

    constructor(version: string) {
        super();

        this._version = version;
    }

    public get<TResponse>(url: string, options?: RequestInit): Promise<TResponse> {
        return this._performSubmarineHttpRequest<void, TResponse>(HttpClientMethod.GET, url, undefined, options);
    }

    public post<TRequest, TResponse>(url: string, body: TRequest, options?: RequestInit) {
        return this._performSubmarineHttpRequest<TRequest, TResponse>(HttpClientMethod.POST, url, body, options)
    }

    public put<TRequest, TResponse>(url: string, body: TRequest, options?: RequestInit) {
        return this._performSubmarineHttpRequest<TRequest, TResponse>(HttpClientMethod.PUT, url, body, options);
    }

    public delete(url: string, options?: RequestInit) {
        return this._performSubmarineHttpRequest<void, void>(HttpClientMethod.DELETE, url, undefined, options);
    }

    protected _generateUrl(url: string) {
        return `${this._version}/${url}`;
    }

    protected async _performSubmarineHttpRequest<TRequest, TResponse>(method: string, url: string, body?: TRequest, options: RequestInit = {}): Promise<TResponse>  {
        const fullUrl = this._generateUrl(url);
        options.body = JSON.stringify(body);

        const response: Response = await super._performHttpRequest(method, fullUrl, options);

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
