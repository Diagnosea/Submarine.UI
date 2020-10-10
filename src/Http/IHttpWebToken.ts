export default interface IHttpWebToken {
    sub: string,
    name: string,
    iss: string,
    iat: string,
    exp: string,
    roles: string[];
    products: string[];
    aud: string;
}
