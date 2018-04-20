/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

export class Logger {

    /* tslint:disable:no-console */
    public static debug(...args: any[]): void {
        console.log.apply(console, args);
    }

    public static info(...args: any[]): void {
        console.info.apply(console, args);
    }

    public static error(...args: any[]): void {
        console.error.apply(console, args);
    }
}
