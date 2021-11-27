
export class ListItemDto {
  constructor(
    public readonly checked: boolean,
    public readonly text: string | undefined = undefined,
    public readonly link: string | undefined = undefined,
    public readonly imageUrl: string | undefined = undefined) { }
}
