import meow from "meow";
import meowHelp from "cli-meow-help";

type AnyFlags = Record<string, any>;

const flags = {
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`,
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`,
	},
} as AnyFlags;

const commands = {
	help: { desc: `Print help info` },
	create: { desc: `Create a Scratch Project.` },
	start: { desc: `Start de Scratch App with Hot Reloading.` },
	build: { desc: `Build the Scratch project to production.` },
};

const helpText = meowHelp({
	name: `scratch`,
	flags,
	commands,
});

const options = {
	inferType: true,
	importMeta: import.meta,
	description: false,
	hardRejection: false,
	flags,
};

export default meow(helpText, {
	inferType: true,
	importMeta: import.meta,
	description: "You can create apps and choose your options",
	hardRejection: false,
	flags: flags,
});

