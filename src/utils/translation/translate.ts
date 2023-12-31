import * as i18next from "i18next";
import * as path from "path";
import Backend from "i18next-fs-backend";
import { fileURLToPath } from "url";
import { ROOT } from "../../index.js";

export const languages = [
	{ name: "Français", value: "fr" },
	{ name: "English", value: "en" },
];

export const lang = (function () {
	var instance: typeof i18next;

	async function createInstance(lng: string) {

		await i18next.use(Backend).init({
			lng: lng,
			fallbackLng: "en",
			debug: false,
			keySeparator: ".",
			backend: {
				loadPath: path.join(ROOT, "..", "locales", lng, "translation.json"),
			},
		});
		return i18next;
	}
	const getInstance = async (lng: string = "en") => {
		if (!instance) {
			instance = await createInstance(lng);
		}
		return instance;
	};

	return {
		getInstance,
	};
})();

export const isValidLanguage = (language: string) => {
	return languages.some((l) => l.value === language);
};
