import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cli from "../utils/cli.js";
import init from "../utils/init.js";
import { COMMANDS_FOLDER_PATH } from "../utils/config.js";
import { handle } from "../utils/router.js";

export const start = async () => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);

	const input = cli.input;
	const flags = cli.flags;
	const { clear, debug } = flags;

	init({});

	if (input.length !== 0) {
		const commandsDir = join(__dirname, "../" + COMMANDS_FOLDER_PATH);
		return await handle({
			dir: commandsDir,
			command: input[0],
			data: { input: input.slice(1), flags },
		});
	}
	return cli.showHelp(0); // No comman matched, showing help
};

export default {
	start,
};
