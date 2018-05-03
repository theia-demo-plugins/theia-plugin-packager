#!/usr/bin/env node
/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
import * as path from "path";
import * as yargs from "yargs";
import { Assembly } from "./assembly";
import { CliError } from "./cli-error";
import { Logger } from "./logger";

import * as readPkg from "read-pkg";

const commandArgs = yargs
    .usage("$0 <cmd> [args]")
    .command({
        command: "pack",
        describe: "Generate assembly of plugin",
        handler: async () => {
            try {
                const pluginRootFolder = path.resolve(process.cwd());
                const moduleName = (await readPkg()).name;
                const zipPath = path.resolve(pluginRootFolder + path.sep + moduleName + ".zip");
                const assembly = new Assembly(pluginRootFolder, zipPath);
                const result = await assembly.create();
                Logger.info(result);
            } catch (err) {
                handleError(err);
            }
        },
    }).help()
    .strict()
    .demandCommand()
    .argv;

if (!commandArgs) {
    yargs.showHelp();
}

function handleError(error: any): void {
    if (error instanceof CliError) {
        Logger.error("=> 🚒 " + error.message);
    } else {
        Logger.error(error);
    }
    process.exit(1);
}
