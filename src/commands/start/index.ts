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
import { fileExist, getDirName, readJsonFile } from "../../utils/filesystem.js";
import { commandExist, spawnCommand } from "../../utils/commands.js";
import ora from "ora";
import chalk from "chalk";
import { log } from "console";
import { join } from "path";
import { ROOT } from "../../index.js";
import { PROJECT_FS } from "../../utils/config.js";

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

	const phpServerConfig = await readJsonFile(
		join(
			process.cwd(),
			PROJECT_FS.CONFIGS_FOLDER,
			PROJECT_FS.PHP.CONFIG_FOLDER,
			PROJECT_FS.PHP.SERVER_CONFIG_FILE_NAME
		)
	);

	const reactConfig = await readJsonFile(
		join(
			process.cwd(),
			PROJECT_FS.CONFIGS_FOLDER,
			PROJECT_FS.REACT.CONFIG_FOLDER,
			PROJECT_FS.REACT.CONFIG_FILE_NAME
		)
	);

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
			label: `[webpack-dev-derver]: http://localhost:${reactConfig.client.dev.port}`,
			color: "#00D8FF",
			status: true,
			process: {
				path: ROOT,
				command: `${packageManager} webpack-dev-server --config ${webpackClientConfig} --mode=development --env APP_DIR=${process.cwd()}`,
			},
		},
		{
			label: `[webpack] watch server.js`,
			color: "#f7df1e",
			status: true,
			process: {
				path: ROOT,
				command: `${packageManager} webpack --config "${webpackServerConfig}" --watch --mode=development --env APP_DIR=${process.cwd()}`,
			},
		},
	];

	if (phpServerConfig.port && commandExist("php")) {
		processes.push({
			label: `[php server]: http://localhost:${phpServerConfig.port}`,
			color: "#8B9DD7",
			status: true,
			process: {
				path: process.cwd(),
				command: `php -S localhost:${phpServerConfig.port} -t ./${phpServerConfig.public}`,
			},
		});
	}

	const processesStatus = () => {
		return processes
			.map(
				({ label, color, status }, index) =>
					`${status ? "✅" : "🛑"} ${chalk.hex(color).bold(`${label}`)}`
			)
			.join("\n");
	};

	processes.forEach(({ label, color, process, status }, index) => {
		spawnCommand(process.path, process.command, {
			stdout: (arr) => {
				spinner.clear();
				logService({
					title: label,
					description: arr,
					bgColor: color,
				});
				// console.log(processesStatus());

				//Show stop command in the spinner
				spinner.text = `'CTRL + C' to ${chalk.red("stop!")}\n${processesStatus()}`;
			},

			stderr: (arr) => {
				spinner.clear();
				logService({
					title: label,
					description: arr,
					bgColor: color,
				});
				// console.log(processesStatus());
				//Show stop command in the spinner
				spinner.text = `'CTRL + C' to ${chalk.red("stop!")}\n${processesStatus()}`;
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
				processes[index] = { ...processes[index], status: false };
			},
			error: (err) => {
				log(err);
			},
		});
	});
};
export default start;
