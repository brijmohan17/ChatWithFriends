import React, { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import Overview from "./Overview";
import Member from "./Member";
import { IoSettingsOutline } from "react-icons/io5";
import ChatSetting from "./ChatSetting";
import { useSelector } from "react-redux";

const ChatDetailsBox = () => {
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [detailView, setDetailView] = useState("overview");
	return (
		<>
			<div className="glass w-fit h-[60vh] p-4 flex flex-col gap-3 rounded-2xl shadow-xl border border-cyan-400/30 animate-fade-in">
				<div className="flex flex-col gap-3">
					<button
						className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-md border border-cyan-400/20 focus:outline-none ${detailView === "overview" ? "bg-gradient-to-r from-cyan-400/30 to-blue-900/40 text-cyan-200" : "bg-slate-800/80 text-white hover:bg-cyan-400/10"}`}
						onClick={() => setDetailView("overview")}
						title="Overview"
					>
						<CiCircleInfo fontSize={20} />
						<span className="hidden sm:block">Overview</span>
					</button>
					{selectedChat?.isGroupChat && (
						<button
							className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-md border border-cyan-400/20 focus:outline-none ${detailView === "members" ? "bg-gradient-to-r from-cyan-400/30 to-blue-900/40 text-cyan-200" : "bg-slate-800/80 text-white hover:bg-cyan-400/10"}`}
							onClick={() => setDetailView("members")}
							title="Members"
						>
							<HiOutlineUsers fontSize={20} />
							<span className="hidden sm:block">Members</span>
						</button>
					)}
					<button
						className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all shadow-md border border-cyan-400/20 focus:outline-none ${detailView === "setting" ? "bg-gradient-to-r from-cyan-400/30 to-blue-900/40 text-cyan-200" : "bg-slate-800/80 text-white hover:bg-cyan-400/10"}`}
						onClick={() => setDetailView("setting")}
						title="Setting"
					>
						<IoSettingsOutline fontSize={20} />
						<span className="hidden sm:block">Setting</span>
					</button>
				</div>
				<div className="w-full h-[60vh] mt-2">
					{detailView === "overview" && <Overview />}
					{detailView === "members" && <Member />}
					{detailView === "setting" && <ChatSetting />}
				</div>
			</div>
		</>
	);
};

export default ChatDetailsBox;
