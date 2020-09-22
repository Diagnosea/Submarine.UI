export default class HttpClientHeader {
    public readonly name: string;
    public readonly value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }

    toRecord(): Record<string, string> {
        return {
            [this.name]: this.value
        }
    }
}
