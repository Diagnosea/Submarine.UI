import SubmarineError from "./SubmarineError";

export default class SubmarineValidationError extends SubmarineError {
    public readonly errors: Record<string, string[]>;

    constructor(errors: Record<string, string[]>) {
        super("Validation Has Failed");

        this.errors = errors;
    }

    getForField = (fieldName: string): string|undefined => {
        const errors: string[] = this.errors[fieldName];
        if (!errors) return undefined;
        return errors[errors.length - 1];
    }

}
