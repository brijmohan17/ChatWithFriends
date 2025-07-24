import React from "react";

const ChatShimmer = () => {
	return (
		<>
			{Array(10)
				.fill("")
				.map((el, idx) => {
					return (
						<div
							key={idx}
							className="w-full h-16 glass border border-cyan-400/20 rounded-xl flex justify-start items-center p-2 font-semibold gap-3 shadow-md mb-2 animate-fade-in"
						>
							<div className="h-12 min-w-12 rounded-full border-2 border-cyan-400 shimmer-animated bg-gradient-to-br from-slate-800/40 to-cyan-400/10"></div>
							<div className="w-full">
								<div className="rounded-xl h-4 w-3/4 min-w-32 shimmer-animated mb-3.5 bg-gradient-to-r from-cyan-400/10 to-slate-800/30"></div>
								<div className="rounded-xl h-3 w-1/2 min-w-24 shimmer-animated bg-gradient-to-r from-cyan-400/10 to-slate-800/30"></div>
							</div>
						</div>
					);
				})}
		</>
	);
};
export const ChatShimmerSmall = () => {
	return (
		<>
			{Array(10)
				.fill("")
				.map((el, idx) => {
					return (
						<div
							key={idx}
							className="w-full h-12 glass border border-cyan-400/20 rounded-xl flex justify-start items-center p-2 font-semibold gap-3 shadow-md mb-2 animate-fade-in"
						>
							<div className="h-10 min-w-10 rounded-full border-2 border-cyan-400 shimmer-animated bg-gradient-to-br from-slate-800/40 to-cyan-400/10"></div>
							<div className="rounded-xl h-3 w-3/4 min-w-32 shimmer-animated bg-gradient-to-r from-cyan-400/10 to-slate-800/30"></div>
							<div className="h-8 min-w-8 rounded-xl shimmer-animated bg-gradient-to-r from-cyan-400/10 to-slate-800/30"></div>
						</div>
					);
				})}
		</>
	);
};

export default ChatShimmer;
