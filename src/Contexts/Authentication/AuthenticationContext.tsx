import React, {Component, createContext, useContext} from "react";

import IAuthenticationContext from "./IAuthenticationContext";
import IAuthenticationContextProviderProps from "./IAuthenticationContextProviderProps";
import IAuthenticationContextProviderState from "./IAuthenticationContextProviderState";
import AuthenticationIdentity from "./AuthenticationIdentity";
import SubmarineHttpVersion from "../../SubmarineHttp/SubmarineHttpVersion";
import SubmarineAuthenticationHttpClient from "../../SubmarineHttp/Resources/Authentication/SubmarineAuthenticationHttpClient";
import ISubmarineRegisterRequest from "../../SubmarineHttp/Resources/Authentication/Register/ISubmarineRegisterRequest";
import ISubmarineAuthenticateRequest from "../../SubmarineHttp/Resources/Authentication/Authenticate/ISubmarineAuthenticateRequest";
import ISubmarineAuthenticatedResponse from "../../SubmarineHttp/Resources/Authentication/Authenticate/ISubmarineAuthenticatedResponse";

const InitialAuthenticationContext = { register: () => {}, authenticate: () => { } } as IAuthenticationContext;
const AuthenticationContext = createContext(InitialAuthenticationContext)

const BEARER_TOKEN_KEY = "sub-ui-bearerToken";
const DEFAULT_BEARER_TOKEN = "";

export class AuthenticationContextProvider extends Component {
    public readonly props!: IAuthenticationContextProviderProps;
    public readonly state: IAuthenticationContextProviderState;
    private readonly _authenticationHttpClient: SubmarineAuthenticationHttpClient;

    constructor(props: IAuthenticationContextProviderProps) {
        super(props);

        this.state = {};

        this._authenticationHttpClient = new SubmarineAuthenticationHttpClient(SubmarineHttpVersion.one);
    }

    componentDidMount() {
        const bearerToken: string|null = localStorage.getItem(BEARER_TOKEN_KEY);
        window.console.log(localStorage.getItem);

        window.console.log("BEARER TOKEN IS " + bearerToken);
        const identity = AuthenticationIdentity.fromBearerToken(bearerToken || DEFAULT_BEARER_TOKEN);

        this.setState({ identity });
    }

    register = async (emailAddress?: string, password?: string, userName?: string, friendlyName?: string): Promise<void> => {
        const request: ISubmarineRegisterRequest = { emailAddress, password, userName, friendlyName };
        await this._authenticationHttpClient.register(request);
    }

    authenticate = async (emailAddress?: string, password?: string): Promise<AuthenticationIdentity> => {
        if (!this.state.identity?.hasExpired())
            return new Promise(r => r(this.state.identity))

        const request: ISubmarineAuthenticateRequest = { emailAddress, password };
        const response: ISubmarineAuthenticatedResponse = await this._authenticationHttpClient.authenticate(request);

        const identity = AuthenticationIdentity.fromBearerToken(response.bearerToken);
        this.setState({ identity });

        return identity;
    }

    render = () => {
        const context: IAuthenticationContext = { register: this.register, authenticate: this.authenticate };

        return (
            <AuthenticationContext.Provider value={context}>
                {this.props.children}
            </AuthenticationContext.Provider>
        )
    }
}

export const useAuthenticationContext = () => useContext(AuthenticationContext);
