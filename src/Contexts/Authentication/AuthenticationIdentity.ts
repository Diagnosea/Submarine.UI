import IHttpWebToken from "../../Http/IHttpWebToken";
import AuthenticationIdentityClaims from "./AuthenticationIdentityClaims";

function tickToDate(tick: number): Date {
    const d = new Date(0);
    d.setUTCSeconds(tick);
    return d;
}

function parseBearerToken(bearerToken: string): IHttpWebToken {
    const payload: string = atob(bearerToken.split('.')[1]);
    return JSON.parse(payload);
}

export default class AuthenticationIdentity {
    public readonly bearerToken: string;
    public readonly claims: AuthenticationIdentityClaims;

    public constructor(bearerToken: string, claims: AuthenticationIdentityClaims) {
        this.bearerToken = bearerToken;
        this.claims = claims;
    }

    public hasExpired(): boolean {
        return this.claims.expiration < new Date();
    }

    public static fromBearerToken(bearerToken: string) {
        const httpWebToken: IHttpWebToken = parseBearerToken(bearerToken);
        const issued = tickToDate(parseInt(httpWebToken.iat, 10))
        const expiration = tickToDate(parseInt(httpWebToken.exp, 10));

        const claims =  new AuthenticationIdentityClaims(
            httpWebToken.sub,
            httpWebToken.name,
            httpWebToken.roles,
            httpWebToken.products,
            httpWebToken.aud,
            issued,
            expiration);

        return new AuthenticationIdentity(bearerToken, claims);
    }
}
