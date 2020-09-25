import SubmarineAuthenticationHttpClient from "./SubmarineAuthenticationHttpClient";
import ISubmarineRegisterRequest from "./Register/ISubmarineRegisterRequest";
import ISubmarineRegisteredResponse from "./Register/ISubmarineRegisteredResponse";
import HttpClientMethod from "../../Http/HttpClientMethod";
import SubmarineValidationError from "../Errors/SubmarineValidationError";
import ISubmarineValidationResponse from "../ISubmarineValidationResponse";
import HttpClientStatusCode from "../../Http/HttpClientStatusCode";
import ISubmarineExceptionResponse from "../ISubmarineExceptionResponse";
import SubmarineExceptionalError from "../Errors/SubmarineExceptionalError";
import ISubmarineAuthenticatedResponse from "./Authenticate/ISubmarineAuthenticatedResponse";
import ISubmarineAuthenticateRequest from "./Authenticate/ISubmarineAuthenticateRequest";
import SubmarineHttpRoute from "../SubmarineHttpRoute";
import SubmarineHttpVersion from "../SubmarineHttpVersion";

function generateResponsePromise<TResponse>(status: number, responseData: TResponse): Promise<any> {
    const json = jest.fn();
    const jsonPromise = new Promise<TResponse>(r => r(responseData));
    json.mockReturnValue(jsonPromise);

    const response = { status, json };
    return new Promise(r => r(response));
}

function generateAnonymousRequestInit<TRequest>(method: string, body: TRequest): RequestInit {
    return {
        method,
        body: JSON.stringify(body),
        headers: {
            "Accept": "application/json"
        }
    }
}

describe("SubmarineAuthenticationHttpClient", () => {
    let submarineAuthenticationHttpClient: SubmarineAuthenticationHttpClient;

    beforeEach(() => {
        submarineAuthenticationHttpClient = new SubmarineAuthenticationHttpClient()
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    describe("register", () => {
        describe(`On Status Code ${HttpClientStatusCode.Created}`, () => {
            it("Returns ISubmarineRegisteredResponse With User ID", async () => {
                // Arrange
                const responseData: ISubmarineRegisteredResponse = { userId: "This is a user id" };
                const responsePromise = generateResponsePromise(201, responseData);
                (fetch as jest.Mock).mockReturnValue(responsePromise);

                // Act
                const result: ISubmarineRegisteredResponse = await submarineAuthenticationHttpClient.register({});

                // Assert
                expect(fetch).toHaveBeenCalledTimes(1);

                const options = generateAnonymousRequestInit<ISubmarineRegisterRequest>(HttpClientMethod.POST, {});
                const url = [SubmarineHttpVersion.one, SubmarineHttpRoute.authentication, "register"].join("/");
                expect(fetch).toHaveBeenCalledWith(url, options);

                expect(result).toHaveProperty("userId");
            })
        })

        describe(`On Status Code ${HttpClientStatusCode.BadRequest}`, () => {
            it("Throws SubmarineValidationError", async () => {
                // Arrange
                const responseData: ISubmarineValidationResponse = { errors: {"emailAddress": ["This is a validation error"] } };
                const responsePromise = generateResponsePromise(400, responseData);
                (fetch as jest.Mock).mockReturnValue(responsePromise);

                // Act & Assert
                try {
                    await submarineAuthenticationHttpClient.register({});
                } catch (error) {
                    expect(error instanceof SubmarineValidationError).toBe(true);
                    expect(error.errors).toHaveProperty("emailAddress");
                    expect(error.errors.emailAddress).toHaveLength(1);
                    expect(error.errors.emailAddress[0]).toBe("This is a validation error")
                }
            })
        })

        describe(`On Status Code ${HttpClientStatusCode.Conflict}`, () => {
            it("Throws SubmarineExceptionalError", async () => {
                // Arrange
                const responseData: ISubmarineExceptionResponse = {
                    exceptionCode: 4,
                    technicalMessage: `User Already Exists For Email 'john.smith@diagnosea.com'`,
                    userMessage: "User:UserExistsWithEmail"
                };

                const responsePromise = generateResponsePromise(409, responseData);
                (fetch as jest.Mock).mockReturnValue(responsePromise);

                // Act & Assert
                try {
                    await submarineAuthenticationHttpClient.register({});
                } catch (error) {
                    expect(error instanceof SubmarineExceptionalError).toBe(true);
                    expect(error.exceptionCode).toBe(responseData.exceptionCode);
                    expect(error.technicalMessage).toBe(responseData.technicalMessage);
                    expect(error.userMessage).toBe(responseData.userMessage);
                }
            })
        })
    })

    describe("authenticate", () => {
        describe(`On Status Code ${HttpClientStatusCode.OK}`, () => {
            it("Returns ISubmarineAuthenticatedResponse With Bearer Token If Given Mandatory Fields", async () => {
                // Arrange
                const responseData: ISubmarineAuthenticatedResponse = { bearerToken: "This is a bearer token" }
                const responsePromise = generateResponsePromise(200, responseData);
                (fetch as jest.Mock).mockReturnValue(responsePromise);

                // Act
                const result: ISubmarineAuthenticatedResponse = await submarineAuthenticationHttpClient.authenticate({});

                // Assert
                expect(fetch).toHaveBeenCalledTimes(1);

                const options = generateAnonymousRequestInit<ISubmarineAuthenticateRequest>(HttpClientMethod.POST, {});
                const url = [SubmarineHttpVersion.one, SubmarineHttpRoute.authentication, "authenticate"].join("/");
                expect(fetch).toHaveBeenCalledWith(url, options);

                expect(result).toHaveProperty("bearerToken");
            })
        });

        describe(`On Status Code ${HttpClientStatusCode.BadRequest}`, () => {
            it("Throws SubmarineValidationError", async () => {
                // Arrange
                const responseData: ISubmarineValidationResponse = { errors: {"emailAddress": ["This is a validation error"] } };
                const responsePromise = generateResponsePromise(400, responseData);
                (fetch as jest.Mock).mockReturnValue(responsePromise);

                // Act & Assert
                try {
                    await submarineAuthenticationHttpClient.authenticate({});
                } catch (error) {
                    expect(error instanceof SubmarineValidationError).toBe(true);
                    expect(error.errors).toHaveProperty("emailAddress");
                    expect(error.errors.emailAddress).toHaveLength(1);
                    expect(error.errors.emailAddress[0]).toBe("This is a validation error")
                }
            })
        })

        describe(`On Status Code ${HttpClientStatusCode.NotFound}`, () => {
            it("Throws SubmarineExceptionalError", async () => {
                // Arrange
                const responseData: ISubmarineExceptionResponse = {
                    exceptionCode: 3,
                    technicalMessage: "This is a technical message",
                    userMessage: "User:UserExistsWithEmail"
                };

                const responsePromise = generateResponsePromise(409, responseData);
                (fetch as jest.Mock).mockReturnValue(responsePromise);

                // Act & Assert
                try {
                    await submarineAuthenticationHttpClient.authenticate({});
                } catch (error) {
                    expect(error instanceof SubmarineExceptionalError).toBe(true);
                    expect(error.exceptionCode).toBe(responseData.exceptionCode);
                    expect(error.technicalMessage).toBe(responseData.technicalMessage);
                    expect(error.userMessage).toBe(responseData.userMessage);
                }
            })
        })
    })
});
