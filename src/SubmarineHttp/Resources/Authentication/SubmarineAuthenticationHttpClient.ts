import SubmarineHttpClient from "../../SubmarineHttpClient";
import SubmarineHttpVersion from "../../SubmarineHttpVersion";
import SubmarineHttpRoute from "../../SubmarineHttpRoute";
import ISubmarineRegisterRequest from "./Register/ISubmarineRegisterRequest";
import ISubmarineRegisteredResponse from "./Register/ISubmarineRegisteredResponse";
import ISubmarineAuthenticateRequest from "./Authenticate/ISubmarineAuthenticateRequest";
import ISubmarineAuthenticatedResponse from "./Authenticate/ISubmarineAuthenticatedResponse";

export default class SubmarineAuthenticationHttpClient extends SubmarineHttpClient {

    private readonly _register: string = "register"
    private readonly _authenticate: string = "authenticate";

    constructor(version: string) {
        super(version, SubmarineHttpRoute.authentication);
    }

    public async register(request: ISubmarineRegisterRequest): Promise<ISubmarineRegisteredResponse> {
        return this.post<ISubmarineRegisterRequest, ISubmarineRegisteredResponse>(this._register, request);
    }

    public async authenticate(request: ISubmarineAuthenticateRequest): Promise<ISubmarineAuthenticatedResponse> {
        return this.post<ISubmarineAuthenticateRequest, ISubmarineAuthenticatedResponse>(this._authenticate, request);
    }

}
