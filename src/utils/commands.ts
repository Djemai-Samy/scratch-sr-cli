import { ChildProcessWithoutNullStreams, spawn, execSync } from "child_process";
import commandExists from "command-exists";
import { ChildProcessTracker } from "./childs_processes.js";
import { Ora } from "ora";
import chalk from "chalk";
export async function checkCommand(command: string) {
	try {
		const result = await commandExists(command);
		return true;
	} catch (error) {
		return false;
	}
}

export function commandExist(command: string): boolean {
	try {
		execSync(`${command} --version`, { stdio: "ignore" });
		return true;
	} catch (e) {
		return false;
	}
}

export const spawnCommandSync = async ({
	commandPath = undefined,
	command,
	callbacks = undefined,
	label = "",
	color = "",
	closer = "",
	spinner = undefined,
	options = undefined,
}: {
	commandPath?: string;
	command?: string;
	callbacks?: ProcessCallbacks;
	label?: string;
	color?: string;
	closer?: string;
	spinner?: Ora;
	options?: { print: boolean };
}) => {
	return new Promise<void>((resolve, reject) => {
		const message = (arr: string[]) =>
			`${chalk.hex(color).bold(label)}: ${arr.join("\n")}`;

		spawnCommand(
			`${commandPath ? checkCommand : process.cwd()}`,
			`${command}`,
			{
				stdout: (arr) => {
					options?.print ? spinner?.succeed(message(arr)) : message(arr);
					spinner?.start(message(arr));
					callbacks?.stdout(arr);
				},
				stderr: (arr) => {
					options?.print ? spinner?.succeed(message(arr)) : message(arr);
					spinner?.start(message(arr));
					callbacks?.stderr(arr);
				},
				exit: (code, arr) => {
					spinner?.clear();
					callbacks?.exit(code, arr);
				},

				close: (code, arr) => {
					closer
						? spinner?.succeed(`${chalk.green(closer)}`)
						: `${chalk.green(closer)}`;

					console.log();

					callbacks?.close(code, arr);
					resolve();
				},
				error: (err) => {
					spinner?.fail(`Error for ${label}: ${err}`);
				},
			},
			false
		);
	});
};

export const spawnCommand = (
	commandPath: string,
	command: string,
	callbacks: ProcessCallbacks,
	exit?: boolean
) => {
	const process = spawn(`${command}`, [], {
		shell: true,
		stdio: "pipe",
		cwd: commandPath,
	});
	const tracker = ChildProcessTracker.getInstance();
	tracker.addChildProcess(process);
	handleChildEvent(process, callbacks, tracker, exit);
};

const handleChildEvent = (
	ls: ChildProcessWithoutNullStreams,
	callbacks: ProcessCallbacks,
	tracker: ChildProcessTracker,
	exit?: boolean
) => {
	ls.stdout?.on("data", (data: any) => {
		let arr = data
			.toString()
			.split("\n")
			.filter((el: string) => el != "");
		callbacks.stdout(arr);
	});

	ls.stderr?.on("data", (data: any) => {
		let arr = data
			.toString()
			.split("\n")
			.filter((el: string) => el != "");
		callbacks.stderr(arr);
	});

	ls.on("error", (error) => {
		let arr = [error.name, error.message, error.stack];
		callbacks.error({ ...error });
	});

	ls.on("close", (code: any) => {
		let arr = ["close"];
		callbacks.close(code, arr);
		tracker.removeChildProcess(ls);
		if (tracker.getChildProcesses().length === 0 && exit === undefined) {
			process.exit();
		}
		return;
	});
	ls.on("exit", (code: any) => {
		let arr = ["exit"];
		callbacks.exit(code, arr);
		return;
	});
};

export type ProcessCallbacks = {
	stdout: (data: string[]) => void;
	stderr: (data: string[]) => void;
	close: (code: number, data: string[]) => void;
	exit: (code: number, data: string[]) => void;
	error: (data: { name: string; message: string; stack?: string | undefined }) => void;
};
