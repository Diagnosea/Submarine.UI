import AuthenticationIdentity from "./AuthenticationIdentity";

export default interface IAuthenticationContext {
    identity: AuthenticationIdentity|undefined;
    authenticate(emailAddress?: string, password?: string): Promise<AuthenticationIdentity>;
}
