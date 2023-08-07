import ora from "ora";
import { lang } from "../../utils/translation/translate.js";
import { ManagerFlags } from "./cli.js";
import prompt from "../../utils/prompt.js";
import filesystem, {
	copyFolder,
	getDirName,
	updateJsonFile,
} from "../../utils/filesystem.js";
import { testAppName, testPort } from "../../utils/validation.js";
import { text } from "../../utils/translation/text.js";
import { error } from "../../utils/log.js";
import { PROJECT_FS, TEMPLATE_FOLDER_PATH } from "../../utils/config.js";
import { join } from "path";
import { spawnCommandSync } from "../../utils/commands.js";
import { ROOT } from "../../index.js";

const ROOT_PATH = join(getDirName(import.meta.url), "../../");

export default async ({ input, flags }: { input: string[]; flags: ManagerFlags }) => {
	const { t } = await lang.getInstance();

	// Determine the package manager to be used based on flags
	const packageManager = flags.useNpm ? "npm" : "yarn";

	// Initialize a spinner for visual feedback in the terminal
	const spinner = ora();

	// Default project name and port
	let appName = "app";
	let webpackPort = "";
	let usePHPServer = true;
	let phpPort = "";

	// Function to ask and set the project name
	const projectName = async () => {
		appName = await prompt.ask({
			name: "projectName",
			message: t(text.common.ask.projectName),
			defaultValue: "app",
			condition: (input) => {
				const folderExist = filesystem.folderExist(input);
				const nameCorrect = testAppName(input);
				folderExist && error(t(text.common.error.appNameExists));
				!nameCorrect && error(t(text.common.error.nameInvalid));
				return !folderExist && nameCorrect;
			},
		});
		// appName = await askProjectName();
		spinner.succeed(`${t(text.common.info.projectName)} ${appName}`);
		return appName;
	};

	// Function to create the folder structure for the project
	const createStructure = async () => {
		spinner.start(t(text.common.info.folderGeneration));
		await copyFolder(join(ROOT_PATH, TEMPLATE_FOLDER_PATH), appName);
		spinner.succeed(`${t(text.common.info.projectPath)} ./${appName}`).clear();
	};

	// Function to update package.json and composer.json with the project name
	const updatePackagesName = async () => {
		// Get version of scratch-sr-cli
		const cliVersion = filesystem.readJsonFile(join(ROOT, "..", "package.json")).version;
		// Update package.json
		spinner.start(`${t(text.common.info.updating)} package.json ...`);
		await updateJsonFile(`./${appName}/package.json`, (jsonData) => ({
			...jsonData,
			name: appName,
			devDependencies: {
				...jsonData.devDependencies,
				"scratch-sr-cli": cliVersion,
			},
		}));
		spinner.succeed(`${t(text.common.info.updated)} package.json !`).stop();

		// Update composer.json
		spinner.clear().start(`${t(text.common.info.updating)} composer.json ...`);
		await updateJsonFile(`./${appName}/composer.json`, (jsonData) => ({
			...jsonData,
			name: appName + "/" + appName,
		}));
		spinner.succeed(`${t(text.common.info.updated)} composer.json !`).stop();
	};

	// Function to ask and set the webpack dev serber port
	const getWebpackPort = async () => {
		webpackPort = await prompt.ask({
			name: "webpackPort",
			message: t(text.webpack.ask.port),
			defaultValue: "3000",
			condition: (input) => testPort(input),
			error: t(text.common.error.port.invalid),
		});
		spinner.succeed(`${t(text.webpack.info.port)}: ${webpackPort}`);
		console.log();

		return webpackPort;
	};

	// Function to update react.json with the dev server URL
	const updateConfigURLDevServer = async () => {
		spinner.start(t(text.webpack.info.updating));
		await updateJsonFile(
			join(
				".",
				appName,
				PROJECT_FS.CONFIGS_FOLDER,
				PROJECT_FS.REACT.CONFIG_FOLDER,
				PROJECT_FS.REACT.CONFIG_FILE_NAME
			),
			(jsonData: any) => ({
				...jsonData,
				client: {
					...jsonData.client,
					dev: {
						...jsonData.client.dev,
						url: `http://localhost:${webpackPort}`,
						port: webpackPort,
					},
				},
			})
		);
		spinner.succeed(`${t(text.webpack.info.updated)}: ${webpackPort}`).clear();
	};

	// Function to ask and set the php port
	const askPHPServer = async () => {
		usePHPServer = await prompt.confirm({
			name: "phpServer",
			message: t(text.php.ask.server),
			defaultValue: usePHPServer,
		});
		spinner.succeed(`${t(text.php.info.server)}`);
		console.log();

		return usePHPServer;
	};
	// Function to ask and set the php port
	const getPHPPort = async () => {
		phpPort = await prompt.ask({
			name: "phpPort",
			message: t(text.php.ask.port),
			defaultValue: "8080",
			condition: (input) => testPort(input),
			error: t(text.common.error.port.invalid),
		});
		spinner.succeed(`${t(text.php.info.port)}: ${phpPort}`);
		console.log();

		return phpPort;
	};

	// Function to update react.json with the dev server URL
	const updateConfigPHPServer = async (port: string | null) => {
		spinner.start(t(text.php.info.updating));
		await updateJsonFile(
			join(
				".",
				appName,
				PROJECT_FS.CONFIGS_FOLDER,
				PROJECT_FS.PHP.CONFIG_FOLDER,
				PROJECT_FS.PHP.SERVER_CONFIG_FILE_NAME
			),
			(jsonData: any) => ({
				...jsonData,
				port,
			})
		);
		spinner.succeed(`${t(text.php.info.updated)}: ${phpPort}`).clear();
	};

	// Function to ask user if they want to install dependencies
	const askInstallDependencies = async () => {
		return await prompt.confirm({
			message: t(text.common.ask.installDeps),
			defaultValue: false,
		});
	};

	// Function to install Node dependencies
	const installNodeDependencies = async () => {
		spinner.start(t(text.node.info.installing));
		await spawnCommandSync({
			command: `cd ./${appName} && ${packageManager} install`,
			label: `[${appName}]: NodeJS`,
			color: "#00D8FF",
			spinner,
			closer: `[${appName}]: ${t(text.node.info.installed)}`,
		});
		spinner.clear();
		console.log();
	};

	// Function to install Composer dependencies
	const installComposerDependencies = async () => {
		spinner.start(t(text.php.composer.info.installing));
		await spawnCommandSync({
			command: `cd ./${appName} && composer require`,
			color: "#8B9DD7",
			label: `[${appName}]: Composer`,
			spinner,
			closer: `[${appName}]: ${t(text.php.composer.info.installed)}`,
		});
		spinner.clear();
		console.log();
	};

	// Function to dump PHP auto loader
	const dumpLoader = async () => {
		spinner.start(t(text.php.composer.info.dumping));
		await spawnCommandSync({
			command: `cd ./${appName} && composer dump-autoload`,
			color: "#8B9DD7",
			label: `[${appName}]: Composer`,
			spinner,
			closer: `[${appName}]: ${t(text.php.composer.info.dumped)}`,
		});
		spinner.clear();
		console.log();
	};

	// Function to install all project dependencies
	const installDependencies = async () => {
		await installNodeDependencies();
		await installComposerDependencies();
		await dumpLoader();
	};

	// Return an object with various initialization functions and values
	return {
		packageManager,
		spinner,
		appName,
		projectName,
		createStructure,
		updatePackagesName,
		askInstallDependencies,
		installDependencies,
		getWebpackPort,
		askPHPServer,
		getPHPPort,
		updateConfigURLDevServer,
		updateConfigPHPServer,
	};
};
