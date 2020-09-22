export default interface IHttpClientHeader {
    readonly name: string;
    readonly value: string;
    toRecord(): Record<string, string>
}
