import SubmarineHttpClient from "../../SubmarineHttpClient";
import SubmarineHttpRoute from "../../SubmarineHttpRoute";
import ITank from "../../../Contexts/Tank/ITank";

export default class TankHttpClient extends SubmarineHttpClient {
    private readonly _me: string = "me";

    constructor(version: string) {
        super(version, SubmarineHttpRoute.tank);
    }

    public async getByUserId(): Promise<ITank[]> {
        return this.get<ITank[]>(this._me);
    }
}
