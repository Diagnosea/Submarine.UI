import SubmarineError from "./SubmarineError";

export default class SubmarineValidationError extends SubmarineError {
    public readonly errors: Record<string, string[]>;

    constructor(errors: Record<string, string[]>) {
        super("Validation Has Failed");

        this.errors = errors;
    }
}
