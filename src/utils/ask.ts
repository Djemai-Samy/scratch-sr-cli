import inquirer from "inquirer";
import { lang, languages } from "./translation/translate.js";
import { error } from "./log.js";
import filesystem from "./filesystem.js";
import { testAppName, testPort } from "./validation.js";

// INQUIRER
export const confirm = async (message: string, defaultValue: boolean) => {
  console.log();
	let resp = await inquirer.prompt([
		{
			type: "confirm",
			name: "confirm",
			message: message,
			default: defaultValue,
		},
	]);
	console.log();
	return resp.confirm;
};

export const proceed = async (defaultValue: boolean) => {
  console.log();
	const text = await lang.getInstance();
	return await confirm(text.t("common.ask.proceed"), defaultValue);
};

export const checkbox = async (
	message: string,
	listchoices: Array<{ name: string; value: string; checked: boolean }>,
	selected: Array<string>
) => {
  console.log();
	const resp = await inquirer.prompt([
		{
			type: "checkbox",
			name: "list",
			choices: listchoices,
			message: message,
			default: selected,
		},
	]);
	return resp.list;
};

export const ask = async (name: string, message: string, defaultValue: string) => {
	console.log();
	const resp = await inquirer.prompt([
		{
			type: "input",
			name: name,
			message: message,
			default: defaultValue,
		},
	]);
	return resp[name];
};

export const list = async (
	message: string,
	choices: Array<{ name: string; value: string }>
) => {
  console.log();
	const resp = await inquirer.prompt([
		{
			type: "list",
			name: "choices",
			choices,
			message,
		},
	]);

	return resp.choices;
};

// COMMON QUESTIONS
export const askProjectName = async () => {
  console.log();
	const text = await lang.getInstance();
	let projectName = await ask("projectName", text.t("common.ask.projectName"), "app");

	while (filesystem.folderExist(projectName) || !testAppName(projectName)) {
		filesystem.folderExist(projectName)
			? error(text.t("common.error.appNameExists"))
			: null;

		!testAppName(projectName) ? error(text.t("common.error.nameInvalid")) : null;

		projectName = await ask("projectName", text.t("common.ask.projectName"), "app");
	}

	return projectName;
};

export const askPort = async () => {
  console.log();
	const lg = await lang.getInstance();
	let port = await ask("port", lg.t("react.ask.port"), "3000");
	while (!testPort(port)) {
		error(lg.t("common.server.error.port"));
		port = await ask("port", lg.t("react.ask.port"), "3000");
	}
	return port;
};
export const askPHPPort = async () => {
  console.log();
	const lg = await lang.getInstance();
	let port = await ask("port", lg.t("php.ask.port"), "8888");
	while (!testPort(port)) {
		error(lg.t("common.server.error.port"));
		port = await ask("port", lg.t("php.ask.port"), "8888");
	}
	return port;
};

export const askLanguage = async () => {
  console.log();
	return await list("Choose your language...", languages);
};

export const askTask = async () => {
  console.log();
	const text = await lang.getInstance();
	return await list(text.t("start.common.ask.task"), [
		{ name: "Development", value: "dev" },
		{ name: "Build", value: "build" },
		{ name: "Production", value: "prod" },
	]);
};

export const askDocker = async () => {
	const text = await lang.getInstance();
	return confirm(text.t("common.ask.useDocker"), true);
};

export const askApps = async (
	listchoices: Array<{ name: string; value: string; checked: boolean }>
) => {
	const text = await lang.getInstance();
	let chosenServices = [];

	while (chosenServices.length === 0) {
		chosenServices = await checkbox(text.t("start.common.ask.services"), listchoices, []);
		if (chosenServices.length === 0) error(text.t("start.common.error.noService"));
	}

	return chosenServices;
};
