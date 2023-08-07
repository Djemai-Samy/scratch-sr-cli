import inquirer from "inquirer";

export const ask = async ({
	type = "input",
	name,
	message,
	condition,
	error,
	defaultValue = "",
}: {
	type?: string;
	name: string;
	message: string;
	condition?: (input: string) => boolean;
	error?: string;
	defaultValue?: string|boolean;
}) => {
  console.log()
	let resp = await inquirer.prompt([
		{
			type,
			name,
			message,
			default: defaultValue,
		},
	]);

	while (condition && !condition(resp[name])) {
		error && error;
		resp[name] = await ask({ name, message, condition, defaultValue });
	}
	return resp[name];
};
export const confirm = async ({
	name = "confirm",
	message,
	condition,
	error,
	defaultValue = true,
}: {
	name?: string;
	message: string;
	condition?: (input: string) => boolean;
	error?: string;
	defaultValue?: boolean;
}) => {
	return await ask({ type: "confirm", name, message, condition, error, defaultValue });
};

export default (() => {
	return {
		ask,
		confirm,
	};
})();
