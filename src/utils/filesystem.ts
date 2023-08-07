import fs, { ObjectEncodingOptions } from "fs";
import fsp from "fs/promises";
import { URL, fileURLToPath } from "url";
import path, { dirname, join } from "path";
import { error, magic, success } from "./log.js";

export const getDirName = (meta: string | URL) => {
	const __filename = fileURLToPath(meta);
	return dirname(__filename);
};

export const fileExist = (folderPath: string, fileName: string) => {
	const filePath = path.join(folderPath, fileName);
	return fs.existsSync(filePath);
};

export const folderExist = (folderPath: string) => {
	return fs.existsSync(folderPath);
};

export const fileExistCWD = (fileName: string) => {
	// Get the current working directory
	const cwd = process.cwd();
	const filePath = path.join(cwd, fileName);
	return fs.existsSync(filePath);
};


export const smartmakeSettingsExist = () => {
	return fileExistCWD("smartmake.json");
};

export const dockerComposeFileExist = () => {
	return fileExistCWD("docker-compose.yaml");
};

export const dockerComposeDevFileExist = () => {
	return fileExistCWD("docker-compose-dev.yaml");
};

export const packageFileExist = () => {
	return fileExistCWD("package.json");
};

export const readdir = async (
	direrctory: fs.PathLike,
	options: ObjectEncodingOptions & {
		withFileTypes: true;
		recursive?: boolean | undefined;
	}
) => {
	return await fsp.readdir(direrctory, options);
};

export const createFile = (filePath: string, content: string) => {
	fs.writeFileSync(filePath, content);
};

export const createFolder = (folderPath: string) => {
	fs.mkdirSync(folderPath);
};

export const renameFile = (oldFilePath: string, newFileName: string) => {
	const newPath = path.join(path.dirname(oldFilePath), newFileName);
	fs.renameSync(oldFilePath, newPath);
};

export const renameFolder = (oldFolderPath: string, newFolderName: string) => {
	const newPath = path.join(path.dirname(oldFolderPath), newFolderName);
	fs.renameSync(oldFolderPath, newPath);
};

export const copyFile = (sourceFilePath: string, destinationFilePath: string) => {
	fs.copyFileSync(sourceFilePath, destinationFilePath);
};

export const copyFolder = async (
	sourceFolderPath: string,
	destinationFolderPath: string
) => {
	await fsp.mkdir(destinationFolderPath, { recursive: true });
	const items = await fsp.readdir(sourceFolderPath);
	for (const item of items) {
		const sourceItemPath = path.join(sourceFolderPath, item);
		const destinationItemPath = path.join(destinationFolderPath, item);

		const itemStat = await fsp.stat(sourceItemPath);
		if (itemStat.isFile()) {
			copyFile(sourceItemPath, destinationItemPath);
		} else if (itemStat.isDirectory()) {
			await copyFolder(sourceItemPath, destinationItemPath);
		}
	}
};

export const deleteFolder = async (folderPath: string) => {
	const items = await fsp.readdir(folderPath);

	for (const item of items) {
		const itemPath = path.join(folderPath, item);
		const itemStat = await fsp.stat(itemPath);

		if (itemStat.isFile()) {
			await fsp.unlink(itemPath);
		} else if (itemStat.isDirectory()) {
			await deleteFolder(itemPath);
		}
	}

	await fsp.rmdir(folderPath);
};

export const readJsonFile = (filePath: string) => {
	try {
		const content = fs.readFileSync(filePath, "utf8");
		return JSON.parse(content);
	} catch (err) {
		error(`${filePath} does not exist!`);
		return null;
	}
};

export const writeJsonFile = (filePath: string, data: any) => {
	const content = JSON.stringify(data, null, 2);
	fs.writeFileSync(filePath, content);
};

export const updateJsonFile = (filePath: string, callback: (jsonData: any) => any) => {
	let jsonData = readJsonFile(filePath);

	if (!jsonData) return;

	writeJsonFile(filePath, callback(jsonData));
};

export default {
	readdir,
	folderExist,
	createFile,
	createFolder,
	renameFile,
	renameFolder,
	deleteFolder,
	copyFile,
	copyFolder,
	readJsonFile,
	writeJsonFile,
	updateJsonFile,
};
