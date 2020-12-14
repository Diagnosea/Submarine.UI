import React, { Component, createContext, useContext } from "react";
import ITankContext from "./ITankContext";
import ITankContextProviderProps from "./ITankContextProviderProps";
import ITankContextProviderState from "./ITankContextProviderState";
import TankHttpClient from "../../SubmarineHttp/Resources/Tank/TankHttpClient";
import SubmarineHttpVersion from "../../SubmarineHttp/SubmarineHttpVersion";
import ITank from "./ITank";
import AuthenticationIdentity from "../Authentication/AuthenticationIdentity";
import SubmarineExceptionalError from "../../SubmarineHttp/Errors/SubmarineExceptionalError";
import ExceptionCode from "../../Generics/ExceptionCode";

const InitialTankContext = {
    tanks: [],
    tanksLoaded: false,
    setIdentity: () => undefined,
    loadTanks: () => new Promise<void>(r => r(undefined))
} as ITankContext;
const TankContext = createContext(InitialTankContext);

export class TankContextProvider extends Component {
    public readonly props!: ITankContextProviderProps;
    public readonly state: ITankContextProviderState;
    private readonly _tankClient: TankHttpClient;

    constructor(props: ITankContextProviderProps) {
        super(props);

        this.state = {
            tanksLoaded: false,
            tanks: [],
        }

        this._tankClient = new TankHttpClient(SubmarineHttpVersion.one);
    }

    setIdentity = (identity: AuthenticationIdentity) => {
        this._tankClient.setBearerToken(identity.bearerToken);
    }

    loadTanks = async (): Promise<void> => {
        try {
            const tanks: ITank[] = await this._tankClient.getByUserId();
            this.setState({ tanksLoaded: true, tanks });
        } catch (error: any) {
            if (error instanceof SubmarineExceptionalError) {
                const exceptionalError = error as SubmarineExceptionalError;
                if (exceptionalError.exceptionCode === ExceptionCode.EntityNotFound) {
                    this.setState({ tanksLoaded: true, tanks: [] });
                }
            }
        }
    }

    render = () => {
        const context: ITankContext = {
            tanks: this.state.tanks,
            tanksLoaded: this.state.tanksLoaded,
            setIdentity: this.setIdentity,
            loadTanks: this.loadTanks
        };

        return (
            <TankContext.Provider value={context}>
                {this.props.children}
            </TankContext.Provider>
        )
    }
}

export const useTankContext = () => useContext(TankContext);

export default useTankContext;
