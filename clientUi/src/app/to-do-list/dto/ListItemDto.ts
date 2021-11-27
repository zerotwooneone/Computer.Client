
export class ListItemDto {
  constructor(
    public readonly checked: boolean,
    public readonly text: string | null = null,
    public readonly link: string | null = null,
    public readonly imageUrl: string | null = null) { }
}
