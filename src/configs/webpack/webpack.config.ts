import path, { dirname, join } from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";
import { getDirName, readJsonFile } from "../../utils/filesystem.js";
import { APP_FS } from "../../utils/config.js";

const ROOT_PATH = join(getDirName(import.meta.url), "../../");

export default async (env: { APP_DIR: string }, argv: { mode: string }) => {

	const config = await readJsonFile(
		join(env.APP_DIR, APP_FS.CONFIGS_FOLDER, APP_FS.REACT_CONFIG_FOLDER, APP_FS.REACT_CONFIG_FILE_NAME)
	);

  const entry = join(env.APP_DIR, config.folder, config.client.entry);

	const outputDirecitory = join(env.APP_DIR, config.client.output.folder);

	const outputFileName = config.client.output.name;

	const outputStylesFileName = config.client.output.styles;

	const port = config.client.dev.port;

	const isDev = argv.mode == "development";

	return {
		devtool: isDev ? "eval-source-map" : false,

		entry: {
			[outputFileName]: entry,
		},

		output: {
			filename: outputFileName,
			path: outputDirecitory,
			publicPath: "auto",
			assetModuleFilename: "images/[hash][ext][query]",
		},

		resolve: {
			extensions: [".tsx", ".js", ".ts", ".jsx"],
		},

		devServer: {
			port,
			allowedHosts: "all",
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
				"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
			},
			compress: true,
			historyApiFallback: true,
      hot: isDev
		},

		plugins: [
			new webpack.NoEmitOnErrorsPlugin(),
			new MiniCssExtractPlugin({
				filename: outputStylesFileName,
			}),
		],

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
					use: [MiniCssExtractPlugin.loader, "css-loader"],
				},
				{
					test: /\.png|svg|jpg|jpeg|gif|ico$/,
					type: "asset/resource",
				},
			],
		},
	};
};
