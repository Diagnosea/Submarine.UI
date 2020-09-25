import {HttpClientAuthorizationHeader} from "./HttpClientAuthorizationHeader";

export default class HttpClientBearerAuthorizationHeader extends HttpClientAuthorizationHeader {
    constructor(bearerToken: string) {
        super(`Bearer ${bearerToken}`);
    }
}
