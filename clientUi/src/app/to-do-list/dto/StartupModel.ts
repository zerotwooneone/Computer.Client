import { ListModel } from "./ListModel";

export class StartupModel {
    constructor(defaultValue: ListModel) { this.default = defaultValue; }
    public readonly "default": ListModel;
}


