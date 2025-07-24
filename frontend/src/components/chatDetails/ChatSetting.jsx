import React, { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
	setChatDetailsBox,
	setLoading,
} from "../../redux/slices/conditionSlice";
import { addAllMessages } from "../../redux/slices/messageSlice";
import { deleteSelectedChat } from "../../redux/slices/myChatSlice";
import socket from "../../socket/socket";

const ChatSetting = () => {
	const dispatch = useDispatch();
	const authUserId = useSelector((store) => store?.auth?._id);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [isConfirm, setConfirm] = useState("");
	const handleClearChat = () => {
		if (
			authUserId === selectedChat?.groupAdmin?._id ||
			!selectedChat?.isGroupChat
		) {
			setConfirm("clear-chat");
		} else {
			toast.warn("You're not admin");
		}
	};
	const handleDeleteGroup = () => {
		if (authUserId === selectedChat?.groupAdmin?._id) {
			setConfirm("delete-group");
		} else {
			toast.warn("You're not admin");
		}
	};
	const handleDeleteChat = () => {
		if (!selectedChat?.isGroupChat) {
			setConfirm("delete-chat");
		}
	};

	//  handle Clear Chat Call
	const handleClearChatCall = () => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/message/clearChat/${
				selectedChat?._id
			}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((res) => res.json())
			.then((json) => {
				setConfirm("");
				dispatch(setLoading(false));
				if (json?.message === "success") {
					dispatch(addAllMessages([]));
					socket.emit("clear chat", selectedChat._id);
					toast.success("Cleared all messages");
				} else {
					toast.error("Failed to clear chat");
				}
			})
			.catch((err) => {
				console.log(err);
				setConfirm("");
				dispatch(setLoading(false));
				toast.error("Failed to clear chat");
			});
	};
	// handle Delete Chat Call
	const handleDeleteChatCall = () => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/chat/deleteGroup/${
				selectedChat?._id
			}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((res) => res.json())
			.then((json) => {
				dispatch(setLoading(false));
				if (json?.message === "success") {
					let chat = selectedChat;
					dispatch(setChatDetailsBox(false));
					dispatch(addAllMessages([]));
					dispatch(deleteSelectedChat(chat._id));
					socket.emit("delete chat", chat, authUserId);

					toast.success("Chat deleted successfully");
				} else {
					toast.error("Failed to delete chat");
				}
			})
			.catch((err) => {
				console.log(err);
				dispatch(setLoading(false));
				toast.error("Failed to delete chat");
			});
	};

	return (
		<div className="glass flex flex-col p-4 gap-4 text-white relative h-full z-10 overflow-auto scroll-style rounded-2xl shadow-xl border border-cyan-400/30 animate-fade-in">
			<h1 className="font-bold text-xl w-full text-center my-2 text-cyan-200 tracking-tight drop-shadow">Settings</h1>
			<button
				onClick={handleClearChat}
				className="w-full py-3 my-1 rounded-full glass border border-cyan-400/30 text-cyan-200 font-semibold flex justify-between items-center px-4 shadow-md hover:bg-cyan-400/10 hover:text-cyan-300 transition-all"
			>
				<span>Clear Chat</span>
				<CiCircleInfo fontSize={18} title={selectedChat?.isGroupChat ? "Admin access only" : "Clear Chat"} className="cursor-pointer" />
			</button>
			{selectedChat?.isGroupChat ? (
				<button
					onClick={handleDeleteGroup}
					className="w-full py-3 my-1 rounded-full glass border border-pink-400/30 text-pink-300 font-semibold flex justify-between items-center px-4 shadow-md hover:bg-pink-400/10 hover:text-pink-400 transition-all"
				>
					<span>Delete Group</span>
					<CiCircleInfo fontSize={18} title="Admin access only" className="cursor-pointer" />
				</button>
			) : (
				<button
					onClick={handleDeleteChat}
					className="w-full py-3 my-1 rounded-full glass border border-pink-400/30 text-pink-300 font-semibold flex justify-between items-center px-4 shadow-md hover:bg-pink-400/10 hover:text-pink-400 transition-all"
				>
					<span>Delete Chat</span>
					<CiCircleInfo fontSize={18} title="Delete Chat" className="cursor-pointer" />
				</button>
			)}
			{isConfirm && (
				<div className="fixed inset-0 flex items-end justify-center z-50 bg-black/30 backdrop-blur-sm">
					<div className={`glass w-full max-w-md mb-6 p-6 rounded-2xl shadow-2xl border ${isConfirm === "clear-chat" ? "border-cyan-400/40 bg-cyan-900/80" : "border-pink-400/40 bg-pink-900/80"} flex flex-col items-center animate-fade-in`}>
						<h1 className="font-bold text-lg mb-4 text-center">
							{isConfirm === "clear-chat"
								? "Clear chat confirmation?"
								: isConfirm === "delete-group"
								? "Delete group confirmation?"
								: "Delete chat confirmation"}
						</h1>
						<div className="flex gap-4 justify-center">
							<button
								onClick={() => setConfirm("")}
								className="px-6 py-2 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 text-white font-semibold shadow hover:bg-slate-800/80 border border-slate-400/30"
							>
								Cancel
							</button>
							<button
								onClick={isConfirm === "clear-chat" ? handleClearChatCall : handleDeleteChatCall}
								className={`px-6 py-2 rounded-full font-semibold shadow border ${isConfirm === "clear-chat" ? "bg-cyan-400/80 text-cyan-900 border-cyan-400 hover:bg-cyan-400/90" : "bg-pink-400/80 text-pink-900 border-pink-400 hover:bg-pink-400/90"}`}
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatSetting;
