
export class AppConnection {
    public constructor(
        public readonly instanceId: string | undefined,
        private readonly closeConnection: () => Promise<void>) { }

    public async Dispose(): Promise<void> {
        await this.closeConnection();
    }
}
