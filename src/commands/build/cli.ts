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
	name: `scratch build`,
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
	description: "Build the Scratch App for Production.",
	hardRejection: false,
	flags: flags,
});

export type ManagerFlags = {
	useNpm: boolean;
};
