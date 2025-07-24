import React from "react";
import { MdChatBubbleOutline } from "react-icons/md";

const ChatNotSelected = () => {
	return (
		<div className="h-full w-full flex justify-center items-center">
			<div className="glass flex flex-col items-center justify-center px-8 py-12 rounded-2xl shadow-2xl animate-fade-in">
				<MdChatBubbleOutline className="text-cyan-400 mb-4" size={48} />
				<h1 className="text-white text-2xl font-bold mb-2">Welcome to ChatApp!</h1>
				<p className="text-cyan-100 text-lg font-medium">Select a chat to start messaging 🎉</p>
			</div>
		</div>
	);
};

export default ChatNotSelected;
