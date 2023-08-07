import meow, { AnyFlags } from "meow";
import meowHelp from "cli-meow-help";


const flags = {

	useNpm: {
		type: `boolean`,
		desc: `Use npm to create the app.`,
    default:false
	},
} as AnyFlags;

const commands = {
	help: { desc: `Print help info` },
};

const helpText = meowHelp({
	name: `scratch create`,
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
	description: "Create a Scratch App.",
	hardRejection: false,
	flags: flags,
});

export type ManagerFlags = {
	useNpm: boolean;
};
