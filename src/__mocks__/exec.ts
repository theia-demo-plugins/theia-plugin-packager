"use strict";

export class Exec {

    public static __setCommandOutput(command: string, output: string): void {
        Exec.map.set(command, output);
    }

    public static async run(command: string): Promise<string> {
        const result = Exec.map.get(command);
        if (result) {
            return Promise.resolve(result);
        } else {
            return Promise.resolve("");
        }
    }

    private static readonly map: Map<string, string> = new Map();

}
