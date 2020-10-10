import AuthenticationIdentity from "./AuthenticationIdentity";

export default interface IAuthenticationContext {
    register(emailAddress?: string, password?: string, userName?: string, friendlyName?: string): Promise<void>;
    authenticate(emailAddress?: string, password?: string): Promise<AuthenticationIdentity>;
}
