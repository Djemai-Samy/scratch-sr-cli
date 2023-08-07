import meow, { AnyFlags } from "meow";
import meowHelp from "cli-meow-help";
import chalk from "chalk";


const flags = {

	useNpm: {
		type: `boolean`,
		desc: `Use npm to start the app.`,
    default:false
	},
} as AnyFlags;

const commands = {
	help: { desc: `Print help info` },
};

const helpText = meowHelp({
	name: `scratch start`,
	examples: [
		{
			command: ``,
		},
	],
	flags,
	commands,
});


export default meow(`${helpText}`, {
	inferType: true,
	importMeta: import.meta,
	description: "Start quickly and easily your Scratch App with Hot Reloading.",
	hardRejection: false,
	flags: flags,
});

export type ManagerFlags = {
	useNpm: boolean;
};
