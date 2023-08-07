import path, { dirname, join } from "path";
import { getDirName, readJsonFile } from "../../utils/filesystem.js";
import { APP_FS } from "../../utils/config.js";

export default async (env: { APP_DIR: string }, argv: { mode: string }) => {

	const config = await readJsonFile(
		join(env.APP_DIR, APP_FS.CONFIGS_FOLDER, APP_FS.REACT_CONFIG_FOLDER, APP_FS.REACT_CONFIG_FILE_NAME)
	);

  const entry = join(env.APP_DIR, config.folder, config.server.entry);
  
  const outputDirectory = join(env.APP_DIR, config.server.output.folder);

	const outputFileName = config.server.output.name;

  const clientDevURL = config.client.dev.url+'/'; 

	const isDev = argv.mode == "development";

	return {
		devtool: isDev ? "eval-source-map" : false,
		entry: {
			[outputFileName]: entry,
		},
		resolve: {
			extensions: [".tsx", ".js", ".ts", ".jsx"],
		},
		output: {
			filename: outputFileName,
			path: outputDirectory,
			publicPath: isDev ? clientDevURL : "/",
			clean: true,
			assetModuleFilename: "images/[hash][ext][query]",
		},
		plugins: [],
		module: {
			rules: [
				{
					test: /\.(js|ts)x?$/,
					exclude: /node_modules/,
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							["@babel/preset-react", { runtime: "automatic" }],
						],
					},
				},
				{
					test: /\.css$/,
					use: ["css-loader"],
				},
				{
					test: /\.png|svg|jpg|jpeg|gif|ico$/,
					type: "asset/resource",
					generator: {
						emit: false,
					},
				},
			],
		},
	};
};
