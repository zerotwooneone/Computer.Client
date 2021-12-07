import { Guid } from "../utils/Guid";

export class BusEvent {
    public readonly eventId: string;
    public readonly correlationId: string;
    constructor(
        public readonly subject: string,
        public readonly value?: any,
        eventId?: string,
        correlationId?: string) {
        this.eventId = eventId
            ? eventId
            : Guid.newGuid();
        this.correlationId = correlationId
            ? correlationId
            : Guid.newGuid();
    }
}
