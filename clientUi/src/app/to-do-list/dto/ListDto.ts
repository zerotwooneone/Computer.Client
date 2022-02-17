import { ListItemDto } from "./ListItemDto";


export class ListDto {
  constructor(public readonly id: string,
    public readonly items: ListItemDto[]) { }
}


