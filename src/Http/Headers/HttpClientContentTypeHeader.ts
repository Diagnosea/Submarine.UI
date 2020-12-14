import HttpClientHeader from "./HttpClientHeader";
import IHttpClientHeader from "./IHttpClientHeader";

export default class HttpClientContentTypeHeader extends HttpClientHeader implements IHttpClientHeader {
    constructor(contentType: string) {
        super("Content-Type", contentType);
    }
}
