import SubmarineError from "./SubmarineError";

export default class SubmarineExceptionalError extends SubmarineError {
    public exceptionCode: number;
    public technicalMessage: string;
    public userMessage: string;

    constructor(exceptionCode: number, technicalMessage: string, userMessage: string) {
        super(technicalMessage);

        this.exceptionCode = exceptionCode;
        this.technicalMessage = technicalMessage;
        this.userMessage = userMessage;
    }
}
