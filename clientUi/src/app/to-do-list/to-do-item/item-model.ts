export class ItemModel {
    constructor(
        public readonly id: string,
        public readonly checked: boolean,
        public readonly text?: string,
        public readonly url?: string,
        public readonly imageUrl?: string,
        public readonly readonly?: boolean) { }
}
