export default class SubmarineError implements Error {
    public name: string;
    public message: string;

    constructor(message: string) {
        this.name = "Submarine API Error";
        this.message = message;
    }
}
