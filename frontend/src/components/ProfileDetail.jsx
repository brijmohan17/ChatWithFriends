import React from "react";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setProfileDetail } from "../redux/slices/conditionSlice";
import { toast } from "react-toastify";

const ProfileDetail = () => {
	const dispatch = useDispatch();
	const user = useSelector((store) => store.auth);
	const handleUpdate = () => {
		toast.warn("Coming soon");
	};
	return (
		<div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/40 backdrop-blur-md">
			<div className="glass p-8 pt-8 w-[95%] sm:w-[70%] md:w-[45%] lg:w-[35%] min-w-72 max-w-[600px] border border-cyan-400/30 rounded-2xl shadow-2xl h-fit mt-5 transition-all relative animate-fade-in">
				<h2 className="text-3xl font-extrabold text-cyan-300 w-full text-center mb-6 tracking-tight drop-shadow">Profile</h2>
				<div className="w-full flex flex-col sm:flex-row items-center justify-center gap-8 mb-6">
					<img
						src={user.image}
						alt="user/image"
						className="w-28 h-28 rounded-full border-4 border-cyan-400 shadow-lg bg-white"
					/>
					<div className="flex flex-col items-center sm:items-start gap-2">
						<h3 className="text-2xl font-bold text-cyan-200">{user.firstName} {user.lastName}</h3>
						<h3 className="text-lg font-medium text-cyan-100">{user.email}</h3>
						<div className="flex gap-3 mt-4">
							<button
								onClick={handleUpdate}
								className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold shadow hover:from-cyan-500 hover:to-blue-600 transition-all border-none"
							>
								Update
							</button>
							<button
								onClick={() => {
									localStorage.removeItem("token");
									window.location.reload();
								}}
								className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-red-500 text-white font-bold shadow hover:from-pink-500 hover:to-red-600 transition-all border-none"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
				<button
					title="Close"
					onClick={() => dispatch(setProfileDetail())}
					className="glass border border-cyan-400/30 hover:bg-cyan-400/10 h-10 w-10 rounded-full flex items-center justify-center absolute top-4 right-4 cursor-pointer shadow-md text-cyan-300 hover:text-pink-400 transition-all"
				>
					<MdOutlineClose size={26} />
				</button>
			</div>
		</div>
	);
};

export default ProfileDetail;
