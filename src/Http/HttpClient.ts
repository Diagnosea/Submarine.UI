import IHttpClientHeader from "./Headers/IHttpClientHeader";
import {HttpClientAcceptHeader} from "./Headers/HttpClientAcceptHeader";

export default abstract class HttpClient {
    protected readonly _headers: IHttpClientHeader[] = [];

    protected _setAcceptHeader(...contentTypes: string[]) {
        const header = new HttpClientAcceptHeader(contentTypes)
    }

    private _generateHeaders(currentHeaders?: HeadersInit): HeadersInit {
        const mappedHeaders: Record<string, string>[] = this._headers.map(header => header.toRecord());
        const appliedHeaders = mappedHeaders.reduce((currentRecord, currentHeader) => ({ ...currentHeader, ...currentHeader }))

        return {
            ...currentHeaders,
            ...appliedHeaders
        }
    }

    protected async _performHttpRequest(method: string, url: string, options: RequestInit = {}): Promise<Response> {
        const fullHeaders = this._generateHeaders(options.headers);

        options.method = method;
        options.headers = fullHeaders;

        return await fetch(url, options);
    }
}
