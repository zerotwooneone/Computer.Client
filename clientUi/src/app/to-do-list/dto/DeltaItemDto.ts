
export class DeltaItemDto {
  constructor(
    public readonly checked: boolean = false,
    public readonly text: string | null = null,
    public readonly link: string | null = null,
    public readonly imageUrl: string | null = null) { }
}
