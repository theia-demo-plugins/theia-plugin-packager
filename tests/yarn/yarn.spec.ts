/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import * as fs from "fs";
import { Exec } from "../../src/exec";
import { Yarn } from "../../src/yarn";

jest.mock("../../src/exec");

describe("Test yarn dependencies", () => {

    let yarn: Yarn;

    beforeEach(() => {
        yarn = new Yarn("/tmp");
    });

    test("invalid output", async () => {
        (Exec as any).__setCommandOutput(Yarn.YARN_GET_DEPENDENCIES, "error");
        try {
            await yarn.getDependencies();
        } catch (e) {
            expect(e.toString()).toMatch(/Not able to find a dependency tree.*$/);
        }
    });

    test("no dependency", async () => {
        const output = fs.readFileSync(__dirname + "/json-list-prod-no-dep.stdout");
        (Exec as any).__setCommandOutput(Yarn.YARN_GET_DEPENDENCIES, output);
        const dependencyList = await yarn.getDependencies();
        expect(dependencyList).toEqual([]);
    });

    test("one dependency", async () => {
        const output = fs.readFileSync(__dirname + "/json-list-prod-one-dep.stdout");
        (Exec as any).__setCommandOutput(Yarn.YARN_GET_DEPENDENCIES, output);
        const dependencyList = await yarn.getDependencies();
        expect(dependencyList).toEqual(["/tmp/node_modules/lodash"]);
    });

    test("one dependency with children", async () => {
        const output = fs.readFileSync(__dirname + "/json-list-prod-one-dep-children.stdout");
        (Exec as any).__setCommandOutput(Yarn.YARN_GET_DEPENDENCIES, output);
        const dependencyList = await yarn.getDependencies();
        expect(dependencyList.length).toBe(47);
    });
});
