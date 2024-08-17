export const fileFormat = (url = "") => {
	const fileExtension = url.split(".").pop();

	if (
		fileExtension === "mp4" ||
		fileExtension === "ogg" ||
		fileExtension === "webm"
	)
		return "video";

	if (fileExtension === "mp3" || fileExtension === "wav") return "audio";

	if (
		fileExtension === "png" ||
		fileExtension === "jpg" ||
		fileExtension === "jpeg" ||
		fileExtension === "gif"
	)
		return "image";

	return "file";
};

export const transformImage = (url = "", width = 100) => {
	if (url.includes("cloudinary")) {
		const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
		return newUrl;
	}
	return url;
};

export const getOrSaveFromStorage = ({
	key,
	value,
	get,
}: {
	key: string;
	value?: {
		chatId: string;
		count: number;
	}[];
	get: boolean;
}) => {
	if (get) {
		return localStorage.getItem(key)
			? JSON.parse(localStorage.getItem(key)!)
			: null;
	} else {
		localStorage.setItem(key, JSON.stringify(value));
	}
};

export function calculateAge(dob: Date) {
	const today = new Date();
	const birthDate = new Date(dob);
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDifference = today.getMonth() - birthDate.getMonth();

	// Adjust age if the birth date hasn't occurred yet this year
	if (
		monthDifference < 0 ||
		(monthDifference === 0 && today.getDate() < birthDate.getDate())
	) {
		age--;
	}

	return age;
}
