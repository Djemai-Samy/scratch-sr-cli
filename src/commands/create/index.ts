#!/usr/bin/env node

/**
 * scratch-cli: Create Command
 * Start quickly and easily by setting up your services in one process.
 * This command initializes the project creation process.
 *
 * Author: Djemai Samy <djemai-samy>
 */

// Import necessary modules and utilities
import cli, { ManagerFlags } from "./cli.js";
import { magic } from "../../utils/log.js";
import { getDirName } from "../../utils/filesystem.js";
import { commandExist, spawnCommandSync } from "../../utils/commands.js";
import { join } from "path";
import creator from "./creator.js";

// Define the root path of the scratch-cli package
const ROOT_PATH = join(getDirName(import.meta.url), "../../");

// The main entry point of the "create" command
export default async function start({
	input,
	flags,
}: {
	input: string[];
	flags: ManagerFlags;
}) {
	// Check if any input argument provided, show help if "help" is included
	if (input.length !== 0) {
		input.includes(`help`) && cli.showHelp(0);
	}

	// Initialize the app creator object
	const appCreator = await creator({ input, flags });

	// Execute the project creation process
	const appName = await appCreator.projectName();
	await appCreator.createStructure();
	await appCreator.updatePackagesName();
	await appCreator.getWebpackPort();
	await appCreator.updateConfigURLDevServer();

	if (commandExist("php") && (await appCreator.askPHPServer())) {
		const phpPort = await appCreator.getPHPPort();
		await appCreator.updateConfigPHPServer(phpPort);
	} else {
		await appCreator.updateConfigPHPServer(null);
	}

	// If user chooses not to install dependencies, provide manual instructions
	if (!(await appCreator.askInstallDependencies())) {
		magic("1. Change directory", "cd ./" + appName);
		magic(`2. Install Node dependencies`, `${appCreator.packageManager} install`);
		magic("3. Install Composer dependencies", "composer require");
		magic("4. Dump Auto Loader", "composer auto-dump");
		magic(`5. Start the project`, `${appCreator.packageManager} start`);
		return;
	}

	// Install dependencies automatically
	await appCreator.installDependencies();

	// Provide instructions for starting the project
	magic("Change directory", "cd ./" + appName);
	magic("Start the project", `${appCreator.packageManager} start`);
}
