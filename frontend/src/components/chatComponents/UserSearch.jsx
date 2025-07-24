import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
	setChatLoading,
	setLoading,
	setUserSearchBox,
} from "../../redux/slices/conditionSlice";
import { toast } from "react-toastify";
import ChatShimmer from "../loading/ChatShimmer";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import socket from "../../socket/socket";

const UserSearch = () => {
	const dispatch = useDispatch();
	const isChatLoading = useSelector(
		(store) => store?.condition?.isChatLoading
	);
	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [inputUserName, setInputUserName] = useState("");
	const authUserId = useSelector((store) => store?.auth?._id);

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
	const handleCreateChat = async (userId) => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				userId: userId,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addSelectedChat(json?.data));
				dispatch(setLoading(false));
				socket.emit("chat created", json?.data, authUserId);
				toast.success("Created & Selected chat");
				dispatch(setUserSearchBox());
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
				dispatch(setLoading(false));
			});
	};
	return (
		<>
			<div className="p-6 w-full h-[7vh] font-semibold flex justify-between items-center bg-slate-800 text-white border-slate-500 border-r">
				<h1 className="mr-2 whitespace-nowrap text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent drop-shadow">New Chat</h1>
				<div className="w-2/3 flex flex-nowrap items-center gap-2">
					<input
						id="search"
						type="text"
						placeholder="Search Users..."
						className="w-full border border-cyan-400/30 bg-white/10 text-white py-2 px-4 font-normal outline-none rounded-full shadow focus:border-cyan-400 focus:bg-white/20 transition-all"
						onChange={(e) => setInputUserName(e.target?.value)}
					/>
					<label htmlFor="search" className="cursor-pointer">
						<FaSearch title="Search Users" className="text-cyan-400" />
					</label>
				</div>
			</div>
			<div className="flex flex-col w-full px-2 sm:px-4 gap-2 py-3 overflow-y-auto overflow-hidden scroll-style h-[73vh] bg-gradient-to-br from-slate-900/60 to-blue-900/40 rounded-2xl shadow-inner">
				{selectedUsers.length == 0 && isChatLoading ? (
					<ChatShimmer />
				) : (
					<>
						{selectedUsers?.length === 0 && (
							<div className="w-full h-full flex justify-center items-center text-white">
								<h1 className="text-base font-semibold">No users registered.</h1>
							</div>
						)}
						{selectedUsers?.map((user) => {
							return (
								<div key={user?._id} className="w-full h-16 glass border border-cyan-400/30 rounded-xl flex justify-start items-center p-2 font-semibold gap-3 hover:bg-cyan-400/10 transition-all cursor-pointer text-white shadow-md mb-2 animate-fade-in" onClick={() => handleCreateChat(user._id)}>
									<img className="h-12 min-w-12 rounded-full border-2 border-cyan-400 object-cover bg-white" src={user?.image} alt="img" />
									<div className="w-full">
										<span className="line-clamp-1 capitalize text-lg font-bold text-cyan-200">{user?.firstName} {user?.lastName}</span>
										<div>
											<span className="text-xs font-light text-cyan-100">{SimpleDateAndTime(user?.createdAt)}</span>
										</div>
									</div>
								</div>
							);
						})}
					</>
				)}
			</div>
		</>
	);
};

export default UserSearch;
