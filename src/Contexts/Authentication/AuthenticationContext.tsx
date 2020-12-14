import React, {Component, createContext, useContext} from "react";

import IAuthenticationContext from "./IAuthenticationContext";
import IAuthenticationContextProviderProps from "./IAuthenticationContextProviderProps";
import IAuthenticationContextProviderState from "./IAuthenticationContextProviderState";
import AuthenticationIdentity from "./AuthenticationIdentity";
import SubmarineHttpVersion from "../../SubmarineHttp/SubmarineHttpVersion";
import SubmarineAuthenticationHttpClient from "../../SubmarineHttp/Resources/Authentication/SubmarineAuthenticationHttpClient";
import ISubmarineAuthenticateRequest from "../../SubmarineHttp/Resources/Authentication/Authenticate/ISubmarineAuthenticateRequest";
import ISubmarineAuthenticatedResponse from "../../SubmarineHttp/Resources/Authentication/Authenticate/ISubmarineAuthenticatedResponse";

const InitialAuthenticationContext = { authenticate: () => { } } as IAuthenticationContext;
const AuthenticationContext = createContext(InitialAuthenticationContext)

const BEARER_TOKEN_KEY = "sub-ui-bearerToken";

export class AuthenticationContextProvider extends Component {
    public readonly props!: IAuthenticationContextProviderProps;
    public readonly state: IAuthenticationContextProviderState;
    private readonly _authenticationHttpClient: SubmarineAuthenticationHttpClient;

    get identity(): AuthenticationIdentity|undefined {
        if (this.state.identity) return this.state.identity;

        const bearerToken = localStorage.getItem(BEARER_TOKEN_KEY);
        if (bearerToken) return AuthenticationIdentity.fromBearerToken(bearerToken);

        return undefined;
    }

    constructor(props: IAuthenticationContextProviderProps) {
        super(props);

        this.state = {};

        this._authenticationHttpClient = new SubmarineAuthenticationHttpClient(SubmarineHttpVersion.one);
    }

    componentDidMount() {
        const bearerToken: string|null = localStorage.getItem(BEARER_TOKEN_KEY);

        if (bearerToken) {
            const identity = AuthenticationIdentity.fromBearerToken(bearerToken);
            this.setState({ identity });
        }
    }

    authenticate = async (emailAddress?: string, password?: string): Promise<AuthenticationIdentity> => {
        const request: ISubmarineAuthenticateRequest = { emailAddress, password };
        const response: ISubmarineAuthenticatedResponse = await this._authenticationHttpClient.authenticate(request);

        localStorage.setItem(BEARER_TOKEN_KEY, response.bearerToken);

        const identity = AuthenticationIdentity.fromBearerToken(response.bearerToken);
        this.setState({ identity });

        return identity;
    }

    render = () => {
        const context: IAuthenticationContext = {
            identity: this.identity,
            authenticate: this.authenticate
        };

        return (
            <AuthenticationContext.Provider value={context}>
                {this.props.children}
            </AuthenticationContext.Provider>
        )
    }
}

export const useAuthenticationContext = () => useContext(AuthenticationContext);

export default useAuthenticationContext;
