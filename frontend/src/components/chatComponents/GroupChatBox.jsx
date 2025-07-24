import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	setChatLoading,
	setGroupChatBox,
	setGroupChatId,
	setLoading,
} from "../../redux/slices/conditionSlice";
import { MdOutlineClose } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import ChatShimmer from "../loading/ChatShimmer";
import { handleScrollEnd } from "../../utils/handleScrollTop";
import { toast } from "react-toastify";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import socket from "../../socket/socket";

const GroupChatBox = () => {
	const groupUser = useRef("");
	const dispatch = useDispatch();
	const isChatLoading = useSelector(
		(store) => store?.condition?.isChatLoading
	);
	const authUserId = useSelector((store) => store?.auth?._id);
	const [isGroupName, setGroupName] = useState(""); // input text
	const [users, setUsers] = useState([]); // all users
	const [inputUserName, setInputUserName] = useState(""); // input text
	const [selectedUsers, setSelectedUsers] = useState([]); // user search results
	const [isGroupUsers, setGroupUsers] = useState([]); // group user results
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

	useEffect(() => {
		handleScrollEnd(groupUser.current);
	}, [isGroupUsers]);

	const addGroupUser = (user) => {
		const existUsers = isGroupUsers.find(
			(currUser) => currUser?._id == user?._id
		);
		if (!existUsers) {
			setGroupUsers([...isGroupUsers, user]);
		} else {
			toast.warn('"' + user?.firstName + '" already Added');
		}
	};

	const handleRemoveGroupUser = (removeUserId) => {
		setGroupUsers(
			isGroupUsers.filter((user) => {
				return user?._id !== removeUserId;
			})
		);
	};

	const handleCreateGroupChat = async () => {
		if (isGroupUsers.length < 2) {
			toast.warn("Please select atleast 2 users");
			return;
		} else if (!isGroupName.trim()) {
			toast.warn("Please enter group name");
			return;
		}
		dispatch(setGroupChatBox());
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/group`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: isGroupName.trim(),
				users: isGroupUsers,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addSelectedChat(json?.data));
				dispatch(setGroupChatId(json?.data?._id));
				dispatch(setLoading(false));
				socket.emit("chat created", json?.data, authUserId);
				toast.success("Created & Selected chat");
				// console.log(json);
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
				dispatch(setLoading(false));
			});
	};
	return (
		<div className="flex -m-2 sm:-m-4 flex-col items-center my-6 text-slate-300 min-h-screen w-full fixed top-0 justify-center z-50 bg-black/40 backdrop-blur-md">
			<div className="glass p-6 pt-6 w-[95%] sm:w-[70%] md:w-[45%] lg:w-[35%] min-w-72 max-w-[600px] border border-cyan-400/30 rounded-2xl shadow-2xl h-fit mt-5 transition-all relative animate-fade-in">
				<h2 className="text-3xl font-extrabold text-cyan-300 w-full text-center mb-4 tracking-tight drop-shadow">Create a Group</h2>
				<div className="w-full py-4 flex flex-wrap items-center gap-4">
					<div className="w-full flex flex-nowrap items-center justify-center gap-2 mb-2">
						<input
							value={inputUserName}
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
					<div
						ref={groupUser}
						className="flex w-full px-4 gap-2 py-2 overflow-x-auto scroll-style-x"
					>
						{isGroupUsers?.length != 0 &&
							isGroupUsers?.map((user) => {
								return (
									<div key={user?._id} className="flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/40 px-3 py-1 rounded-full shadow text-cyan-200 font-semibold mr-2 mb-1 animate-fade-in">
										<img src={user?.image} alt="avatar" className="h-7 w-7 rounded-full border-2 border-cyan-400 object-cover bg-white mr-1" />
										<span>{user?.firstName}</span>
										<button title={`Remove ${user?.firstName}`} onClick={() => handleRemoveGroupUser(user?._id)} className="ml-1 text-cyan-300 hover:text-pink-400 transition-all">
											<MdOutlineClose size={18} />
										</button>
									</div>
								);
							})}
					</div>
					<div className="flex flex-col w-full px-4 gap-2 py-2 overflow-y-auto overflow-hidden scroll-style h-[45vh]">
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
										<div key={user?._id} className="w-full h-16 glass border border-cyan-400/30 rounded-xl flex justify-start items-center p-2 font-semibold gap-3 hover:bg-cyan-400/10 transition-all cursor-pointer text-white shadow-md mb-2 animate-fade-in" onClick={() => { addGroupUser(user); setInputUserName(""); }}>
											<img className="h-12 min-w-12 rounded-full border-2 border-cyan-400 object-cover bg-white" src={user?.image} alt="img" />
											<div className="w-full">
												<span className="line-clamp-1 capitalize text-lg font-bold text-cyan-200">{user?.firstName} {user?.lastName}</span>
												<span className="text-xs font-light text-cyan-100">{SimpleDateAndTime(user?.createdAt)}</span>
											</div>
										</div>
									);
								})}
							</>
						)}
					</div>
				</div>
				<div className="w-full flex flex-nowrap items-center justify-center gap-2 mt-4">
					<input
						type="text"
						placeholder="Group Name"
						className="w-2/3 border border-cyan-400/30 bg-white/10 text-white py-2 px-4 font-normal outline-none rounded-full shadow focus:border-cyan-400 focus:bg-white/20 transition-all"
						onChange={(e) => setGroupName(e.target?.value)}
					/>
					<button
						className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold shadow-lg hover:from-cyan-500 hover:to-blue-600 transition-all border-none"
						onClick={handleCreateGroupChat}
					>
						Create
					</button>
				</div>
				<div
					title="Close"
					onClick={() => dispatch(setGroupChatBox())}
					className="glass border border-cyan-400/30 hover:bg-cyan-400/10 h-9 w-9 rounded-full flex items-center justify-center absolute top-3 right-3 cursor-pointer shadow-md text-cyan-300 hover:text-pink-400 transition-all"
				>
					<MdOutlineClose size={24} />
				</div>
			</div>
		</div>
	);
};

export default GroupChatBox;
