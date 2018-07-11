/*********************************************************************
* Copyright (c) 2018 Red Hat, Inc.
*
* This program and the accompanying materials are made
* available under the terms of the Eclipse Public License 2.0
* which is available at https://www.eclipse.org/legal/epl-2.0/
*
* SPDX-License-Identifier: EPL-2.0
**********************************************************************/

import * as path from "path";
import { Exec } from "./exec";

/**
 * Handle the parsing of node packages with Yarn.
 * @author Florent Benoit
 */
export class Yarn {

    public static readonly YARN_GET_DEPENDENCIES = "yarn list --json --prod";

    constructor(readonly rootFolder: string) { }

    /**
     * Get package.json dependency paths (not including dev dependencies)
     */
    public async getDependencies(): Promise<string[]> {

        // grab output of the command
        const stdout = await Exec.run(Yarn.YARN_GET_DEPENDENCIES);

        // Check that we've tree array
        const match = /^{"type":"tree","data":{"type":"list","trees":(.*)}}$/gm.exec(stdout);
        if (!match || match.length !== 2) {
            throw new Error("Not able to find a dependency tree when executing "
                + Yarn.YARN_GET_DEPENDENCIES + ". Found " + stdout);
        }

        // parse array into JSON
        const inputTrees = JSON.parse(match[1]);

        // add each yarn node (and loop through children of children)
        const nodePackages: INodePackage[] = [];
        inputTrees.forEach((yarnNode: IYarnNode) => this.addNodePackage(yarnNode, nodePackages));

        // return uniq entries
        return Promise.resolve(nodePackages.map((e) => e.path).filter((value, index, array) => {
            return index === array.indexOf(value);
        }));
    }

    /**
     * Add a node package (entry of yarn list) to the given array.
     * Also loop on all children and call ourself back
     * @param yarnNode the node entry to add
     * @param packages the array representing all node dependencies
     */
    protected addNodePackage(yarnNode: IYarnNode, packages: INodePackage[]): void {

        // add each child to the array again
        if (yarnNode.children) {
            yarnNode.children.forEach((child) => {
                this.addNodePackage(child, packages);
            });
        }

        // extract the node module name
        const npmModuleName = yarnNode.name.substring(0, yarnNode.name.lastIndexOf("@"));

        // build package
        const nodePackage = { name: npmModuleName, path: path.resolve(this.rootFolder, "node_modules", npmModuleName) };

        // add to the array
        packages.push(nodePackage);
    }

}

export interface INodePackage {
    name: string;
    path: string;
}

export interface IYarnNode {
    name: string;
    children: IYarnNode[];
}
