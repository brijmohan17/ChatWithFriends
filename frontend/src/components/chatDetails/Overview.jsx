import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getChatName, { getChatImage } from "../../utils/getChatName";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import { CiCircleInfo } from "react-icons/ci";
import { RxUpdate } from "react-icons/rx";
import { toast } from "react-toastify";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { setLoading } from "../../redux/slices/conditionSlice";

const Overview = () => {
	const dispatch = useDispatch();
	const authUserId = useSelector((store) => store?.auth?._id);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [changeNameBox, setChangeNameBox] = useState(false);
	const [changeName, setChangeName] = useState(selectedChat?.chatName);

	const handleShowNameChange = () => {
		if (authUserId === selectedChat?.groupAdmin?._id) {
			setChangeNameBox(!changeNameBox);
			setChangeName(selectedChat?.chatName);
		} else {
			toast.warn("You're not the group admin");
		}
	};

	const handleChangeName = () => {
		const newName = changeName.trim();
		if (!newName) return toast.warn("Please enter a valid group name");
		if (newName === selectedChat?.chatName) return toast.warn("Name is already set");

		setChangeNameBox(false);
		dispatch(setLoading(true));

		const token = localStorage.getItem("token");

		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/rename`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: newName,
				chatId: selectedChat?._id,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addSelectedChat(json?.data));
				toast.success("Group name changed successfully");
			})
			.catch((err) => {
				console.error(err);
				toast.error("Something went wrong");
			})
			.finally(() => dispatch(setLoading(false)));
	};

	return (
		<div className="text-white p-4 flex flex-col gap-4 h-full overflow-auto scroll-style">
			{/* Profile & Name */}
			<div className="flex flex-col items-center gap-3">
				<img
					src={getChatImage(selectedChat, authUserId)}
					alt="chat avatar"
					className="w-20 h-20 rounded-full object-cover shadow"
				/>
				<div className="text-lg font-semibold flex items-center gap-1">
					<h1>{getChatName(selectedChat, authUserId)}</h1>
					{selectedChat?.isGroupChat && (
						<CiCircleInfo
							title="Rename group"
							className="cursor-pointer hover:text-blue-400 transition"
							size={18}
							onClick={handleShowNameChange}
						/>
					)}
				</div>
			</div>

			{/* Rename Input Box */}
			{changeNameBox && (
				<div className="flex flex-col gap-2">
					<label className="text-sm text-gray-300">Rename Group Chat:</label>
					<div className="flex items-center gap-2">
						<input
							type="text"
							className="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
							value={changeName}
							onChange={(e) => setChangeName(e.target.value)}
						/>
						<button
							onClick={handleChangeName}
							className="p-2 rounded-md border border-slate-600 hover:bg-slate-700 transition"
							title="Update Name"
						>
							<RxUpdate size={18} />
						</button>
					</div>
				</div>
			)}

			{/* Divider */}
			<hr className="border-slate-700" />

			{/* Timestamps */}
			<div className="text-sm space-y-2">
				<div>
					<p className="font-semibold text-gray-300">Created</p>
					<p className="text-gray-400">{SimpleDateAndTime(selectedChat?.createdAt)}</p>
				</div>
				<div>
					<p className="font-semibold text-gray-300">Last Updated</p>
					<p className="text-gray-400">{SimpleDateAndTime(selectedChat?.updatedAt)}</p>
				</div>
				<div>
					<p className="font-semibold text-gray-300">Last Message</p>
					<p className="text-gray-400">{SimpleDateAndTime(selectedChat?.latestMessage?.updatedAt)}</p>
				</div>
			</div>
		</div>
	);
};

export default Overview;
