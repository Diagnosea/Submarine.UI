import ITank from "./ITank";
import AuthenticationIdentity from "../Authentication/AuthenticationIdentity";

export default interface ITankContext {
    tanksLoaded: boolean;
    tanks: ITank[];
    loadTanks: () => Promise<void>;
    setIdentity: (identity: AuthenticationIdentity) => void;
}
