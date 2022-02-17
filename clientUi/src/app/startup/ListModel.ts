import { ItemModelDto } from "./ItemModelDto";


export class ListModel {
    constructor(public readonly id: string,
        public readonly items: readonly ItemModelDto[]) { }
}
