import ITank from "./ITank";

export default interface ITankContextProviderState {
    tanksLoaded: boolean;
    tanks: ITank[];
}
