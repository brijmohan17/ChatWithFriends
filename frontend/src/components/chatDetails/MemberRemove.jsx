import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	IoCheckmarkCircleOutline,
	IoPersonAddOutline,
	IoPersonRemoveOutline,
} from "react-icons/io5";
import { VscError } from "react-icons/vsc";
import { CiCircleInfo } from "react-icons/ci";
import { toast } from "react-toastify";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { setLoading } from "../../redux/slices/conditionSlice";

const MemberRemove = ({ setMemberAddBox }) => {
	const dispatch = useDispatch();
	const authUserId = useSelector((store) => store?.auth?._id);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [removeUserName, setRemoveUserName] = useState("");
	const [removeUserId, setRemoveUserId] = useState("");

	const handleRemoveUser = (userId, userName) => {
		setRemoveUserId(userId);
		setRemoveUserName(userName);
	};

	const handleRemoveUserCall = () => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/groupremove`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				userId: removeUserId,
				chatId: selectedChat?._id,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				toast.success(`${removeUserName} removed successfully`);
				setRemoveUserId("");
				setRemoveUserName("");
				dispatch(addSelectedChat(json?.data));
				dispatch(setLoading(false));
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
				dispatch(setLoading(false));
			});
	};

	return (
		<div className="glass p-4 rounded-2xl shadow-xl border border-cyan-400/30 animate-fade-in relative">
			{selectedChat?.groupAdmin?._id === authUserId && (
				<button
					className="w-full my-2 h-12 glass border border-cyan-400/30 rounded-xl flex justify-start items-center p-2 font-semibold gap-3 hover:bg-cyan-400/10 transition-all cursor-pointer text-cyan-200 shadow-md mb-2 animate-fade-in"
					onClick={() => setMemberAddBox(true)}
				>
					<div className="h-10 min-w-10 rounded-full flex items-center justify-center border border-cyan-400 bg-white">
						<IoPersonAddOutline fontSize={20} className="text-cyan-400" />
					</div>
					<span className="w-full line-clamp-1 capitalize font-bold">Add members</span>
				</button>
			)}
			<div className="min-h-0.5 w-full bg-slate-900/50"></div>
			<div className="flex flex-col items-start w-full justify-center gap-2 mb-3 mt-3">
				{selectedChat?.users?.map((user) => {
					return (
						<div key={user?._id} className="w-full h-14 glass border border-cyan-400/30 rounded-xl flex justify-start items-center p-2 font-semibold gap-3 hover:bg-cyan-400/10 transition-all cursor-pointer text-white shadow-md mb-2 animate-fade-in">
							<img className="h-10 min-w-10 rounded-full border-2 border-cyan-400 object-cover bg-white" src={user?.image} alt="img" />
							<div className="w-full relative">
								<span className="line-clamp-1 capitalize text-cyan-200 font-bold">{user?.firstName} {user?.lastName}</span>
								{user?._id === selectedChat?.groupAdmin?._id && (
									<span className="font-light text-xs text-blue-200 ml-2">Admin</span>
								)}
							</div>
							{user?._id !== selectedChat?.groupAdmin?._id && (
								<>
									{selectedChat?.groupAdmin?._id === authUserId ? (
										<button
											title="Remove User"
											className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-400 to-red-500 text-white font-semibold shadow hover:from-pink-500 hover:to-red-600 transition-all border-none"
											onClick={() => handleRemoveUser(user?._id, user?.firstName)}
										>
											<IoPersonRemoveOutline />
										</button>
									) : (
										<CiCircleInfo
											onClick={() => toast.warn("You're not admin")}
											fontSize={22}
											title="Not Allowed"
											className="cursor-pointer text-cyan-300 ml-2"
										/>
									)}
								</>
							)}
						</div>
					);
				})}
			</div>
			{removeUserName && (
				<div className="fixed inset-0 flex items-end justify-center z-50 bg-black/30 backdrop-blur-sm">
					<div className="glass w-full max-w-md mb-6 p-6 rounded-2xl shadow-2xl border border-pink-400/40 bg-pink-900/80 flex flex-col items-center animate-fade-in">
						<h1 className="font-bold text-lg mb-4 text-center">Confirm removal of '{removeUserName}'?</h1>
						<div className="flex gap-4 justify-center">
							<button
								onClick={() => { setRemoveUserName(""); setRemoveUserId(""); }}
								className="px-6 py-2 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 text-white font-semibold shadow hover:bg-slate-800/80 border border-slate-400/30"
							>
								Cancel
							</button>
							<button
								onClick={() => handleRemoveUserCall()}
								className="px-6 py-2 rounded-full bg-pink-400/80 text-pink-900 font-semibold shadow border border-pink-400 hover:bg-pink-400/90"
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

export default MemberRemove;
