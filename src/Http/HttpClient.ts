import IHttpClientHeader from "./Headers/IHttpClientHeader";

export default abstract class HttpClient {
    protected readonly _baseUrl: string;
    protected readonly _headers: IHttpClientHeader[] = [];

    protected constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
    }

    private _generateHeaders(currentHeaders?: HeadersInit): HeadersInit {
        const mappedHeaders: Record<string, string>[] = this._headers.map(header => header.toRecord());
        const appliedHeaders = mappedHeaders.reduce((currentRecord, currentHeader) => ({ ...currentHeader, ...currentHeader }))

        return {
            ...currentHeaders,
            ...appliedHeaders
        }
    }

    protected async _performHttpRequest(url: string, init: RequestInit = {}): Promise<Response> {
        const fullUrl = `${this._baseUrl}/${url}`;
        init.headers = this._generateHeaders(init.headers);

        return await fetch(fullUrl, init);
    }
}
