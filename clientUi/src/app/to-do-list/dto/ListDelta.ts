import { DeltaItemDto } from "./DeltaItemDto";


export class ListDelta {
    constructor(public readonly id: string,
        public readonly items: DeltaItemDto[]) { }
}
