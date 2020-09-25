import HttpClientHeader from "./HttpClientHeader";
import IHttpClientHeader from "./IHttpClientHeader";

export class HttpClientAuthorizationHeader extends HttpClientHeader implements IHttpClientHeader {
    constructor(authorization: string) {
        super("Authorization", authorization);
    }
}
