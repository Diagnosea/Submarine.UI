import React, {useState, useContext, createContext, ReactNode} from "react";
import SubmarineAuthenticationHttpClient from "../../SubmarineHttp/Resources/Authentication/SubmarineAuthenticationHttpClient";
import SubmarineHttpVersion from "../../SubmarineHttp/SubmarineHttpVersion";
import ISubmarineRegisterRequest from "../../SubmarineHttp/Resources/Authentication/Register/ISubmarineRegisterRequest";
import ISubmarineAuthenticateRequest from "../../SubmarineHttp/Resources/Authentication/Authenticate/ISubmarineAuthenticateRequest";
import ISubmarineAuthenticatedResponse from "../../SubmarineHttp/Resources/Authentication/Authenticate/ISubmarineAuthenticatedResponse";
import AuthenticationIdentity from "./AuthenticationIdentity";
import IAuthenticationContextProviderProps from "./IAuthenticationContextProviderProps";
import IAuthenticationContext from "./IAuthenticationContext";

const InitialAuthenticationContext = { register: () => {}, authenticate: () => { } } as IAuthenticationContext;
const AuthenticationContext = createContext(InitialAuthenticationContext)

export const AuthenticationContextProvider = ({ children }: IAuthenticationContextProviderProps) => {
    const client = new SubmarineAuthenticationHttpClient(SubmarineHttpVersion.one);

    const initialIdentity = AuthenticationIdentity.fromNoBearerToken();
    const [identity, setIdentity] = useState(initialIdentity);

    const register = async (emailAddress?: string, password?: string, userName?: string, friendlyName?: string): Promise<void> => {
        const request: ISubmarineRegisterRequest = { emailAddress, password, userName, friendlyName };
        await client.register(request);
    }

    const authenticate = async (emailAddress?: string, password?: string): Promise<AuthenticationIdentity|void> => {
        if (identity.claims.expiration > new Date(Date.now())) {
            return identity;
        }

        const request: ISubmarineAuthenticateRequest = { emailAddress, password };
        const response: ISubmarineAuthenticatedResponse = await client.authenticate(request);

        const updatedIdentity = AuthenticationIdentity.fromBearerToken(response.bearerToken);
        setIdentity(updatedIdentity);

        return updatedIdentity;
    }

    const context = { register, authenticate } as IAuthenticationContext;

    return (
        <AuthenticationContext.Provider value={context}>
            {children}
        </AuthenticationContext.Provider>
    )

}

export const useAuthenticationContext = () => useContext(AuthenticationContext);
