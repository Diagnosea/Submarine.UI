import SubmarineHttpClient from "../../SubmarineHttpClient";
import SubmarineHttpRoute from "../../SubmarineHttpRoute";
import ISubmarineAuthenticateRequest from "./Authenticate/ISubmarineAuthenticateRequest";
import ISubmarineAuthenticatedResponse from "./Authenticate/ISubmarineAuthenticatedResponse";

export default class SubmarineAuthenticationHttpClient extends SubmarineHttpClient {

    private readonly _authenticate: string = "authenticate";

    constructor(version: string) {
        super(version, SubmarineHttpRoute.authentication);
    }

    public async authenticate(request: ISubmarineAuthenticateRequest): Promise<ISubmarineAuthenticatedResponse> {
        return this.post<ISubmarineAuthenticateRequest, ISubmarineAuthenticatedResponse>(this._authenticate, request);
    }

}
