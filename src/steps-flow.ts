/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { Step } from "./step";

export class StepsFlow {
    private steps: Step[] = [];

    constructor(readonly title: string) {

    }

    public addStep(step: Step): void {
        this.steps.push(step);
    }

    public async start(): Promise<void> {
        process.stdout.write(this.title + "\n");
        // start first step
        let index: number = 0;
        while (index < this.steps.length) {
            const step = this.steps[index];
            await step.start();
            index++;
        }

        return Promise.resolve();
    }

}
