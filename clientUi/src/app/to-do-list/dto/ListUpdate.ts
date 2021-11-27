import { ListDelta } from "./ListDelta";
import { ListDto } from "./ListDto";


export class ListUpdate {
  private constructor(public readonly version: string,
    public readonly list: ListDto | null = null,
    public readonly delta: ListDelta | null = null) { }

  public static listfactory(version: string,
    list: ListDto): ListUpdate {
    return new ListUpdate(version, list);
  }

  public static deltaFactory(version: string,
    delta: ListDelta): ListUpdate {
    return new ListUpdate(version, null, delta);
  }
}
