import Metric from "../../Generics/Metric";
import LivestockSex from "../../Generics/Livestock/LivestockSex";
import TankLivestockHappiness from "../../Generics/Tank/TankLivestockHappiness";
import TankSupplyComponent from "../../Generics/Tank/TankSupplyComponent";
import WaterCycleStage from "../../Generics/Water/WaterCycleStage";

export default interface ITank {
    id: string;
    name: string;
    water: ITankWater;
    livestock: ITankLivestock[];
    supplies: ITankSupply[];
}

export interface ITankWater {
    waterId: string;
    stage: WaterCycleStage,
    levels: ITankWaterLevel[];
}

export interface ITankWaterLevel {
    metric: Metric;
    quantity: number;
}

export interface ITankLivestock {
    livestockId: string;
    name: string;
    sex: LivestockSex;
    happiness: TankLivestockHappiness;
    healthy: boolean;
    lastFed: Date,
    untilNextFeed: string;
}

export interface ITankSupply {
    supplyId: string;
    name: string;
    component: TankSupplyComponent;
    metric: Metric;
    quantity: number;
}
