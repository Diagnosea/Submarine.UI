export default class AuthenticationIdentityClaims {
    public readonly userId: string;
    public readonly userName: string;
    public readonly roles: string[];
    public readonly products: string[];
    public readonly licenseKey: string;
    public readonly issued: Date;
    public readonly expiration: Date;

    constructor(userId: string, userName: string, roles: string[], products: string[], licenseKey: string, issued: Date, expiration: Date) {
        this.userId = userId;
        this.userName = userName;
        this.roles = roles;
        this.products = products;
        this.licenseKey = licenseKey;
        this.issued = issued;
        this.expiration = expiration;
    }
}
