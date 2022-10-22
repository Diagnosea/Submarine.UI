import SubmarineAuthenticationHttpClient from "./SubmarineAuthenticationHttpClient";
import HttpClientMethod from "../../../Http/HttpClientMethod";
import SubmarineValidationError from "../../Errors/SubmarineValidationError";
import ISubmarineValidationResponse from "../../ISubmarineValidationResponse";
import HttpClientStatusCode from "../../../Http/HttpClientStatusCode";
import ISubmarineExceptionResponse from "../../ISubmarineExceptionResponse";
import SubmarineExceptionalError from "../../Errors/SubmarineExceptionalError";
import ISubmarineAuthenticatedResponse from "./Authenticate/ISubmarineAuthenticatedResponse";
import ISubmarineAuthenticateRequest from "./Authenticate/ISubmarineAuthenticateRequest";
import SubmarineHttpRoute from "../../SubmarineHttpRoute";
import SubmarineHttpVersion from "../../SubmarineHttpVersion";

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
            "Content-Type": "application/json"
        }
    }
}

describe("SubmarineAuthenticationHttpClient", () => {
    let submarineAuthenticationHttpClient: SubmarineAuthenticationHttpClient;

    beforeEach(() => {
        submarineAuthenticationHttpClient = new SubmarineAuthenticationHttpClient(SubmarineHttpVersion.one)
    })

    afterEach(() => {
        jest.clearAllMocks();
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
            it("Throws SubmarineValidationError",  async () => {
                // Arrange
                const errorInformation: any = { errors: {"emailAddress": ["This is a validation error"] } }

                const responseData: ISubmarineValidationResponse = errorInformation
                const responsePromise = generateResponsePromise(400, responseData);
                (fetch as jest.Mock).mockReturnValue(responsePromise);

                // Act
                const act = () => submarineAuthenticationHttpClient.authenticate({});

                // Assert
                await expect(act()).rejects.toMatchObject(errorInformation);
            })
        })

        describe(`On Status Code ${HttpClientStatusCode.NotFound}`, () => {
            it("Throws SubmarineExceptionalError",  async () => {
                // Arrange
                const errorInformation: any = {
                    exceptionCode: 3,
                    technicalMessage: "This is a technical message",
                    userMessage: "User:UserExistsWithEmail"
                };

                const responseData: ISubmarineExceptionResponse = errorInformation;

                const responsePromise = generateResponsePromise(409, responseData);
                (fetch as jest.Mock).mockReturnValue(responsePromise);

                // Act
                const act = () => submarineAuthenticationHttpClient.authenticate({});

                // Await
                await expect(act()).rejects.toMatchObject(errorInformation);
            })
        })
    })
});
