import HttpClientHeader from "./HttpClientHeader";
import IHttpClientHeader from "./IHttpClientHeader";

export default class HttpClientAcceptHeader extends HttpClientHeader implements IHttpClientHeader {
    constructor(contentTypes: string[]) {
        super("Accept", contentTypes.join(", "));
    }
}
