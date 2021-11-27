
export class DeltaItemDto {
  constructor(
    public readonly index: number,
    public readonly checked: boolean = false,
    public readonly text: string | undefined = undefined,
    public readonly link: string | undefined = undefined,
    public readonly imageUrl: string | undefined = undefined,
    public readonly deleted: boolean = false,) { }
}
