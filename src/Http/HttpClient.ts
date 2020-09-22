export default abstract class HttpClient {
    private readonly _version: string;
    private _headers: IHttpClientHeader[];

    protected constructor(version: string) {
        this._version = version;
        this._headers = [];
    }

    public setBearerToken(bearerToken: string) {
        const header = new HttpClientAuthorizationHeader(bearerToken);
        this._headers.push(header);
    }

    private _generateUrl(route: string) {
        return `${this._version}/${route}`;
    }

    private _generateHeaders(currentHeaders?: HeadersInit): HeadersInit {
        const mappedHeaders: Record<string, string>[] = this._headers.map(header => header.toRecord());
        const appliedHeaders = mappedHeaders.reduce((currentRecord, currentHeader) => ({ ...currentHeader, ...currentHeader }))

        return {
            ...currentHeaders,
            ...appliedHeaders
        }
    }

    private async _performRequest(method: string, url: string, options: RequestInit = {}): Promise<Response> {
        const fullUrl = this._generateUrl(url);
        const fullHeaders = this._generateHeaders(options.headers);

        options.method = method;
        options.headers = fullHeaders;

        return await fetch(fullUrl, options);
    }
}

class HttpClientVersion {
    public static one: string = "v1";
}

class HttpClientMethod {
    public static GET: string = "GET";
    public static POST: string = "POST";
    public static PUT: string = "PUT";
    public static DELETE: string = "DELETE";
}

class HttpClientHeader {
    public readonly name: string;
    public readonly value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }

    toRecord(): Record<string, string> {
        return {
            [this.name]: this.value
        }
    }
}

interface IHttpClientHeader {
    readonly name: string;
    readonly value: string;

    toRecord(): Record<string, string>
}

class HttpClientAuthorizationHeader extends HttpClientHeader implements IHttpClientHeader {
    constructor(bearerToken: string) {
        super("Authorization", `Bearer ${bearerToken}`);
    }
}

enum HttpClientResponseStatusCode {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409
}




