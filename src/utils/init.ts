
import chalk from "chalk";
import filesystem from "./filesystem.js";
import { join } from "path";
import { ROOT } from "../index.js";
const dim = chalk.dim;
/**
 * Welcome.
 *
 * @param String heading Heading text.
 * @param String subHeading Sub heading text.
 * @param Object options Configurable options.
 */
export default (options: any) => {
  // Options.
  const defaultOptions = {
		title: `🔥 Scratch CLI 🔥`,
		tagLine: `by Djemai Samy`,
		description: ["A Command Line Interface to manage your Scratch Applications.", ""],
		version: filesystem.readJsonFile(join(ROOT, '..', 'package.json')).version,
		bgColor: "#36BB09",
		color: "#000000",
		bold: true,
	};
  const opts = { ...defaultOptions, ...options };
  const {
    title,
    tagLine,
    description,
    bgColor,
    color,
    bold,
    version
  } = opts;

  // Configure.
  const bg = bold
    ? chalk.hex(bgColor).inverse.bold
    : chalk.hex(bgColor).inverse;
  const clr = bold ? chalk.hex(color).bold : chalk.hex(color);
  console.log();
  // Do it.
  console.log(
    `${clr(`${bg(` ${title} `)}`)} ${version} ${dim(tagLine)}\n\n${
      
        description.length ? description?.join('\n\n'): description
    
    }`
  );
  console.log(`${chalk.bgBlack.hex(bgColor).underline('                                    ')}`)
  console.log();
};