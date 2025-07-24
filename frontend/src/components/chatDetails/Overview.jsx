import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getChatName, { getChatImage } from "../../utils/getChatName";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import { CiCircleInfo } from "react-icons/ci";
import { toast } from "react-toastify";
import { RxUpdate } from "react-icons/rx";
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
			toast.warn("You're not admin");
		}
	};
	const handleChangeName = () => {
		setChangeNameBox(false);
		if (selectedChat?.chatName === changeName.trim()) {
			toast.warn("Name already taken");
			return;
		} else if (!changeName.trim()) {
			toast.warn("Please enter group name");
			return;
		}
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/rename`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: changeName.trim(),
				chatId: selectedChat?._id,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addSelectedChat(json?.data));
				dispatch(setLoading(false));
				toast.success("Group name changed");
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
				dispatch(setLoading(false));
			});
	};

	return (
		<div className="glass flex flex-col gap-4 text-white p-6 rounded-2xl shadow-xl border border-cyan-400/30 animate-fade-in">
			<div className="flex flex-col items-center justify-center gap-3 mb-3 mt-3">
				<img
					src={getChatImage(selectedChat, authUserId)}
					alt=""
					className="h-20 w-20 rounded-full border-4 border-cyan-400 shadow-lg bg-white"
				/>
				<div className="text-center leading-5 font-bold text-2xl flex items-center gap-2 text-cyan-200">
					<span>{getChatName(selectedChat, authUserId)}</span>
					{selectedChat?.isGroupChat && (
						<CiCircleInfo
							fontSize={20}
							title="Change Name"
							className="cursor-pointer hover:text-cyan-400 transition-all"
							onClick={handleShowNameChange}
						/>
					)}
				</div>
			</div>
			{changeNameBox && (
				<div className="w-full flex flex-col gap-2 items-center mb-2 animate-fade-in">
					<h1 className="text-cyan-100 font-semibold">Rename Group Chat:</h1>
					<div className="flex gap-2 w-full">
						<input
							type="text"
							className="w-full border border-cyan-400/30 bg-white/10 text-white py-2 px-4 font-normal outline-none rounded-full shadow focus:border-cyan-400 focus:bg-white/20 transition-all"
							value={changeName}
							onChange={(e) => setChangeName(e.target.value)}
						/>
						<button
							title="Change Name"
							className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold shadow hover:from-cyan-500 hover:to-blue-600 transition-all border-none"
							onClick={handleChangeName}
						>
							<RxUpdate fontSize={20} />
						</button>
					</div>
				</div>
			)}
			<div className="min-h-0.5 w-full bg-slate-900/50"></div>
			<div className="flex flex-col gap-2 mt-2">
				<div className="glass px-4 py-2 rounded-xl border border-cyan-400/20 shadow text-cyan-100 font-semibold text-sm">
					<span className="block">Created</span>
					<span className="opacity-70">{SimpleDateAndTime(selectedChat?.createdAt)}</span>
				</div>
				<div className="glass px-4 py-2 rounded-xl border border-cyan-400/20 shadow text-cyan-100 font-semibold text-sm">
					<span className="block">Last Updated</span>
					<span className="opacity-70">{SimpleDateAndTime(selectedChat?.updatedAt)}</span>
				</div>
				<div className="glass px-4 py-2 rounded-xl border border-cyan-400/20 shadow text-cyan-100 font-semibold text-sm">
					<span className="block">Last Message</span>
					<span className="opacity-70">{SimpleDateAndTime(selectedChat?.latestMessage?.updatedAt)}</span>
				</div>
			</div>
		</div>
	);
};

export default Overview;
