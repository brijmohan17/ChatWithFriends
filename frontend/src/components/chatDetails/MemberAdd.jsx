import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { setChatLoading, setLoading } from "../../redux/slices/conditionSlice";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { ChatShimmerSmall } from "../loading/ChatShimmer";
import { IoCheckmarkCircleOutline, IoPersonAddOutline } from "react-icons/io5";
import { VscError } from "react-icons/vsc";

const MemberAdd = ({ setMemberAddBox }) => {
	const dispatch = useDispatch();
	const isChatLoading = useSelector(
		(store) => store?.condition?.isChatLoading
	);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [inputUserName, setInputUserName] = useState("");
	const [addUserName, setAddUserName] = useState("");
	const [addUserId, setAddUserId] = useState("");
	// All Users Api Call
	useEffect(() => {
		const getAllUsers = () => {
			dispatch(setChatLoading(true));
			const token = localStorage.getItem("token");
			fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((json) => {
					setUsers(json.data || []);
					setSelectedUsers(json.data || []);
					dispatch(setChatLoading(false));
				})
				.catch((err) => {
					console.log(err);
					dispatch(setChatLoading(false));
				});
		};
		getAllUsers();
	}, []);

	useEffect(() => {
		setSelectedUsers(
			users.filter((user) => {
				return (
					user.firstName
						.toLowerCase()
						.includes(inputUserName?.toLowerCase()) ||
					user.lastName
						.toLowerCase()
						.includes(inputUserName?.toLowerCase()) ||
					user.email
						.toLowerCase()
						.includes(inputUserName?.toLowerCase())
				);
			})
		);
	}, [inputUserName]);
	const handleAddUser = (userId, userName) => {
		if (selectedChat?.users?.find((user) => user?._id === userId)) {
			toast.warn(`${userName} is already added`);
			setAddUserId("");
			setAddUserName("");

			return;
		}
		setAddUserId(userId);
		setAddUserName(userName);
	};

	const handleAddUserCall = () => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/groupadd`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				userId: addUserId,
				chatId: selectedChat?._id,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				toast.success(`${addUserName} Added successfully`);
				setAddUserId("");
				setAddUserName("");
				dispatch(addSelectedChat(json?.data));
				dispatch(setLoading(false));
				setMemberAddBox(false);
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
				dispatch(setLoading(false));
			});
	};

	return (
		<div className="glass p-4 rounded-2xl shadow-xl border border-cyan-400/30 animate-fade-in relative">
			<div className="font-bold text-lg w-full text-center mb-2 text-cyan-200 tracking-tight drop-shadow">Total Users ({users?.length || 0})</div>
			<div className="min-h-0.5 w-full bg-slate-900/50 mb-2"></div>
			<button
				onClick={() => setMemberAddBox(false)}
				className="glass border border-cyan-400/30 hover:bg-cyan-400/10 h-9 w-9 rounded-full flex items-center justify-center absolute top-4 left-3 cursor-pointer shadow-md text-cyan-300 hover:text-pink-400 transition-all"
			>
				<FaArrowLeft title="Back" fontSize={18} />
			</button>
			<div className="w-full flex flex-nowrap items-center justify-center gap-2 mb-4">
				<input
					id="search"
					type="text"
					placeholder="Search Users..."
					className="w-2/3 border border-cyan-400/30 bg-white/10 text-white py-2 px-4 font-normal outline-none rounded-full shadow focus:border-cyan-400 focus:bg-white/20 transition-all"
					onChange={(e) => setInputUserName(e.target?.value)}
				/>
				<label htmlFor="search" className="cursor-pointer">
					<FaSearch title="Search Users" className="text-cyan-400" />
				</label>
			</div>
			<div className="flex flex-col items-start w-full justify-center gap-2 mb-3 mt-3">
				{selectedUsers.length == 0 && isChatLoading ? (
					<ChatShimmerSmall />
				) : (
					<>
						{selectedUsers?.length === 0 && (
							<div className="w-full h-full flex justify-center items-center text-white">
								<h1 className="text-base font-semibold">No users registered.</h1>
							</div>
						)}
						{selectedUsers?.map((user) => {
							return (
								<div key={user?._id} className="w-full h-14 glass border border-cyan-400/30 rounded-xl flex justify-start items-center p-2 font-semibold gap-3 hover:bg-cyan-400/10 transition-all cursor-pointer text-white shadow-md mb-2 animate-fade-in">
									<img className="h-10 min-w-10 rounded-full border-2 border-cyan-400 object-cover bg-white" src={user?.image} alt="img" />
									<div className="w-full relative">
										<span className="line-clamp-1 capitalize text-cyan-200 font-bold">{user?.firstName} {user?.lastName}</span>
									</div>
									<button
										title="Add User"
										className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold shadow hover:from-cyan-500 hover:to-blue-600 transition-all border-none"
										onClick={() => handleAddUser(user?._id, user?.firstName)}
									>
										<IoPersonAddOutline />
									</button>
								</div>
							);
						})}
					</>
				)}
			</div>
			{addUserName && (
				<div className="fixed inset-0 flex items-end justify-center z-50 bg-black/30 backdrop-blur-sm">
					<div className="glass w-full max-w-md mb-6 p-6 rounded-2xl shadow-2xl border border-cyan-400/40 bg-cyan-900/80 flex flex-col items-center animate-fade-in">
						<h1 className="font-bold text-lg mb-4 text-center">Confirm addition of '{addUserName}'?</h1>
						<div className="flex gap-4 justify-center">
							<button
								onClick={() => { setAddUserName(""); setAddUserId(""); }}
								className="px-6 py-2 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 text-white font-semibold shadow hover:bg-slate-800/80 border border-slate-400/30"
							>
								Cancel
							</button>
							<button
								onClick={() => handleAddUserCall()}
								className="px-6 py-2 rounded-full bg-cyan-400/80 text-cyan-900 font-semibold shadow border border-cyan-400 hover:bg-cyan-400/90"
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

export default MemberAdd;
