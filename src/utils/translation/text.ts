export const text = {
	common: {
		ask: {
			projectName: "common.ask.projectName",
			packageManager: "common.ask.packageManager",
			installDeps: "common.ask.installDeps",
			templateName: "common.ask.templateName",
			options: "common.ask.options",
			useTypescript: "common.ask.useTypescript",
			useDocker: "common.ask.useDocker",
			useDockerCompose: "common.ask.useDockerCompose",
			startServer: "common.ask.startServer",
			proceed: "common.ask.proceed",
		},
		info: {
			projectName: "common.info.projectName",
			folderGeneration: "common.info.folderGeneration",
			projectPath: "common.info.projectPath",
			updating: "common.info.updating",
			updated: "common.info.updated",
			usingYarn: "common.info.usingYarn",
			usingNpm: "common.info.usingNpm",
			installDeps: "common.info.installDeps",
			noInstallDeps: "common.info.noInstallDeps",
			usingTypescript: "common.info.usingTypescript",
			notUsingTypescript: "common.info.notUsingTypescript",
			usingJavascript: "common.info.usingJavascript",
			usingDocker: "common.info.usingDocker",
			notUsingDocker: "common.info.notUsingDocker",
			usingDockerCompose: "common.info.usingDockerCompose",
			notUsingDockerCompose: "common.info.notUsingDockerCompose",
			dependencies: {
				install: "common.info.dependencies.install",
				installed: "common.info.dependencies.installed",
			},
		},
		error: {
			nameInvalid: "common.error.nameInvalid",
			appNameExists: "common.error.appNameExists",
			noApp: "common.error.noApp",
			port: {
				invalid: "common.error.port.invalid",
			},
		},
		server: {
			ready: "common.server.ready",
			error: {
				port: "common.server.error.port",
				portUsed: "common.server.error.portUsed",
			},
		},
	},
	php: {
		ask: {
			appName: "php.ask.appName",
			server: "php.ask.server",
			port: "php.ask.port",
		},
		info: {
			port: "php.info.port",
			updating: "php.info.updating",
			updated: "php.info.updated",
			server: "php.info.server",
		},
		commands: {
			dev: "php.commands.dev",
			build: "php.commands.build",
			start: "php.commands.start",
		},
		composer: {
			ask: {},
			info: {
				installing: "php.composer.info.installing",
				installed: "php.composer.info.installed",
				dumping: "php.composer.info.dumping",
				dumped: "php.composer.info.dumped",
			},
		},
		server: {
			ask: {},
			info: {},
		},
		readme: {
			runServer: "php.readme.runServer",
		},
	},
	webpack: {
		ask: {
			port: "webpack.ask.port",
		},
		info: {
			port: "webpack.info.port",
			updating: "webpack.info.updating",
			updated: "webpack.info.updated",
		},
	},
	node: {
		ask: {},
		info: {
			installing: "node.info.installing",
			installed: "node.info.installed",
		},
	},
	compose: {
		commands: {
			dev: "compose.commands.dev",
			up: "compose.commands.up",
		},
	},
	express: {
		ask: {
			appName: "express.ask.appName",
			port: "express.ask.port",
		},
		info: {},
		commands: {
			dev: "express.commands.dev",
			build: "express.commands.build",
			start: "express.commands.start",
		},
		server: {},
		readme: {
			runServer: "express.readme.runServer",
		},
	},

	react: {
		ask: {
			appName: "react.ask.appName",
			port: "react.ask.port",
		},
		info: {},
		commands: {
			dev: "react.commands.dev",
			build: "react.commands.build",
		},
		server: {},
		readme: {
			runServer: "react.readme.runServer",
		},
	},
	start: {
		common: {
			ask: {
				task: "start.common.ask.task",
				services: "start.common.ask.services",
			},
			error: {
				noService: "start.common.error.noService",
				noPackageFile: "start.common.error.noPackageFile",
				noDockerDevFile: "start.common.error.noDockerDevFile",
				noDockerFile: "start.common.error.noDockerFile",
			},
		},
		react: {
			info: {
				express: "start.react.info.express",
				builded: "start.react.info.builded",
			},
			warning: {
				nginx: "start.react.warning.nginx",
			},
			error: {
				server: "start.react.error.server",
			},
		},
	},
};

// Now you can use the 'translations' object to access your translation strings
