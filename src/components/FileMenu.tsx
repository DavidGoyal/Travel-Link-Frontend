import AudioFileIcon from "@mui/icons-material/AudioFile";
import ImageIcon from "@mui/icons-material/Image";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React, { useRef } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useSendAttachmentMutation } from "../redux/api/api";
import {
	setFileMenu,
	setIsUploadingLoader,
} from "../redux/reducers/miscReducer";
import { RootState } from "../redux/store";

const FileMenu = ({
	anchorEl,
	chatId,
}: {
	anchorEl: Element;
	chatId: string;
}) => {
	const { isFileMenu } = useSelector((state: RootState) => state.misc);
	const dispatch = useDispatch();

	const imageRef = useRef(null);
	const audioRef = useRef(null);
	const videoRef = useRef(null);
	const fileRef = useRef(null);

	const [sendAttachments] = useSendAttachmentMutation();

	const selectRef = (ref: React.RefObject<HTMLInputElement>) => {
		ref.current?.click();
	};

	const fileChangeHandler = async (
		e: React.ChangeEvent<HTMLInputElement>,
		keys: string
	) => {
		const files = Array.from(e.target.files!);

		if (files.length <= 0) return;

		if (files.length > 5)
			return toast.error(`You can only upload maximum 5 ${keys} at a time`);

		dispatch(setIsUploadingLoader(true));

		const toastId = toast.loading(`Uploading ${keys}`);

		dispatch(setFileMenu(false));

		try {
			const formData = new FormData();
			formData.append("chatId", chatId);

			for (let i = 0; i < files.length; i++) {
				formData.append("files", files[i]);
			}

			const res = await sendAttachments(formData);

			if (res.data) {
				toast.success(`${keys} sent successfuly`, { id: toastId });
			} else {
				toast.error(`Failed to send ${keys}`, { id: toastId });
			}
		} catch (error) {
			toast.error("Something went wrong", { id: toastId });
		} finally {
			dispatch(setIsUploadingLoader(false));
		}
	};

	return (
		<Menu
			open={isFileMenu}
			anchorEl={anchorEl}
			onClose={() => dispatch(setFileMenu(false))}
		>
			<div style={{ width: "10rem" }}>
				<MenuList>
					<MenuItem onClick={() => selectRef(imageRef)}>
						<Tooltip title="Image">
							<ImageIcon />
						</Tooltip>
						<ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
						<input
							type="file"
							multiple
							accept="image/png,image/jpeg,image/gif"
							style={{ display: "none" }}
							onChange={(e) => fileChangeHandler(e, "Images")}
							ref={imageRef}
						/>
					</MenuItem>

					<MenuItem onClick={() => selectRef(audioRef)}>
						<Tooltip title="Audio">
							<AudioFileIcon />
						</Tooltip>
						<ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
						<input
							type="file"
							multiple
							accept="audio/mpeg, audio/wav, audio/ogg"
							style={{ display: "none" }}
							onChange={(e) => fileChangeHandler(e, "Audios")}
							ref={audioRef}
						/>
					</MenuItem>

					<MenuItem onClick={() => selectRef(videoRef)}>
						<Tooltip title="Video">
							<VideoFileIcon />
						</Tooltip>
						<ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
						<input
							type="file"
							multiple
							accept="video/mp4, video/webm, video/ogg"
							style={{ display: "none" }}
							onChange={(e) => fileChangeHandler(e, "Videos")}
							ref={videoRef}
						/>
					</MenuItem>

					<MenuItem onClick={() => selectRef(fileRef)}>
						<Tooltip title="File">
							<UploadFileIcon />
						</Tooltip>
						<ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
						<input
							type="file"
							multiple
							accept="*"
							style={{ display: "none" }}
							onChange={(e) => fileChangeHandler(e, "Files")}
							ref={fileRef}
						/>
					</MenuItem>
				</MenuList>
			</div>
		</Menu>
	);
};

export default FileMenu;
