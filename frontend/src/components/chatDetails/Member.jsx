import React, { useState } from "react";
import MemberAdd from "./MemberAdd";
import MemberRemove from "./MemberRemove";
import { useSelector } from "react-redux";

const Member = () => {
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [memberAddBox, setMemberAddBox] = useState(false);

	return (
		<div className="glass flex flex-col pt-4 gap-4 text-white relative h-full z-10 overflow-auto scroll-style rounded-2xl shadow-xl border border-cyan-400/30 animate-fade-in">
			<div className="font-bold text-xl w-full text-center mb-2 text-cyan-200 tracking-tight drop-shadow">Members ({selectedChat?.users?.length})</div>
			<div className="w-full">
				{memberAddBox ? (
					<MemberAdd setMemberAddBox={setMemberAddBox} />
				) : (
					<MemberRemove setMemberAddBox={setMemberAddBox} />
				)}
			</div>
		</div>
	);
};

export default Member;
