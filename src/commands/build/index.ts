#!/usr/bin/env node

/**
 * smartmaje start
 * Start quickly et easily your services in one process.
 *
 * @author Djemai Samy <djemai-samy>
 */
import cli, { ManagerFlags } from "./cli.js";
import { logService } from "../../utils/log.js";
import { ChildProcessTracker } from "../../utils/childs_processes.js";
import { fileExist, getDirName } from "../../utils/filesystem.js";
import { spawnCommand } from "../../utils/commands.js";
import ora from "ora";
import chalk from "chalk";
import { log } from "console";
import { join } from "path";
import { ROOT } from "../../index.js";

// Absolu

const inputs = cli.input.slice(1);
const flags = cli.flags as ManagerFlags;

export const start = async () => {
	inputs.includes(`help`) && cli.showHelp(0);

	const tracker = ChildProcessTracker.getInstance();
	process.on("SIGINT", (a) => {
		tracker.killAllChilds(0);
	});
	const spinner = ora("");
	spinner.start();

	const packageManager = flags.useNpm ? "npm" : "yarn";

	let webpackServerConfig = "webpack.server.config.js";
	let webpackClientConfig = "webpack.config.js";

	if (!fileExist(process.cwd(), webpackServerConfig)) {
		webpackServerConfig = join(ROOT, "configs", "webpack", webpackServerConfig);
	}
	if (!fileExist(process.cwd(), webpackClientConfig)) {
		webpackClientConfig = join(ROOT, "configs", "webpack", webpackClientConfig);
	}

	const processes = [
		{
			label: `[webpack] Client Entry`,
			color: "#00D8FF",
			status: true,
			process: {
				path: ROOT,
				command: `${packageManager} webpack --config ${webpackClientConfig} --mode=production --env APP_DIR=${process.cwd()}`,
			},
		},
		{
			label: `[webpack] Server Entry`,
			color: "#f7df1e",
			status: true,
			process: {
				path: ROOT,
				command: `${packageManager} webpack --config "${webpackServerConfig}" --mode=production --env APP_DIR=${process.cwd()}`,
			},
		},
	];

	processes.forEach(({ label, color, process, status }, index) => {
		spawnCommand(process.path, process.command, {
			stdout: (arr) => {
				spinner.clear();
				logService({
					title: label,
					description: arr,
					bgColor: color,
				});
				spinner.text = `Building the app...`;
			},

			stderr: (arr) => {
				spinner.clear();
				logService({
					title: label,
					description: arr,
					bgColor: color,
				});
				spinner.text = `Building the app...`;
			},
			exit: (code, arr) => {
				spinner.clear();
				logService({
					title: label,
					description: [`Stopping...`],
					bgColor: color,
				});
			},
			close: (code, arr) => {
				spinner.clear();
				logService({
					title: label,
					description: [`Stopped.`],
					bgColor: color,
				});
			},
			error: (err) => {
				log(err);
			},
		});
	});
};
export default start;
