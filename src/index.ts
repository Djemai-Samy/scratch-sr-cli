#!/usr/bin/env node

/**
 * scratch
 * A CLI to manage Scratch Apps.
 *
 * @author Djemai Samy <djemai-samy>
 */

import app from "./app/index.js";
import { getDirName } from "./utils/filesystem.js";

export const ROOT = getDirName(import.meta.url);

app.start();

