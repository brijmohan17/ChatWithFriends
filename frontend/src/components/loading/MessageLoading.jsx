import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const MessageLoading = () => {
	return (
		<div className="flex justify-center items-center w-full px-4 gap-1 py-2 overflow-y-auto overflow-hidden scroll-style h-[66vh] bg-gradient-to-br from-slate-900/60 to-blue-900/40 rounded-2xl shadow-inner">
			<div className="glass p-6 rounded-full shadow-xl flex items-center justify-center animate-fade-in">
				<AiOutlineLoading3Quarters
					fontSize={32}
					color="#06b6d4"
					className="animate-spin"
				/>
			</div>
		</div>
	);
};

export default MessageLoading;
