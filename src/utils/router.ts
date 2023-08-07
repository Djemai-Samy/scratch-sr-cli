import { PathLike } from "fs";
import { COMMAND_FILE_NAME } from "./config.js";
import filesystem from "./filesystem.js";
import path from "path";

export const getRoute = async ({ dir, command }: { dir: string; command: string }) => {
	// Read the list of subdirectories in the commands directory

	const commandFolders = await filesystem.readdir(dir, { withFileTypes: true });

	// Create an array of the commands found
	const availableCommands = commandFolders
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	// Find the appropriate command based on user input
	const selectedCommand = availableCommands.find((file) => file == command);

	// If a command id found
	if (selectedCommand) {
		const modulePath = path.resolve(dir, selectedCommand, COMMAND_FILE_NAME);
		return await import(`file://${modulePath}`);
	}
	return null;
};

export const handleRoute = async ({
	route,
	data,
}: {
	route: any;
	data: { input: string[]; flags: any };
}) => {
	await route.default(data);
	return true;
};

export const handle = async ({
	dir,
	command,
	data,
}: {
	dir: string;
	command: string;
	data: { input: string[]; flags: any };
}) => {
	const route = await getRoute({ dir, command });
	return route ? await handleRoute({ route, data }) : false;
};

export default {
	getRoute,
	handleRoute,
	handle,
};
