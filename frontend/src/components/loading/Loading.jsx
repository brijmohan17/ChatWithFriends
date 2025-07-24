import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/slices/conditionSlice";

const Loading = () => {
	const dispatch = useDispatch();
	const [showCancel, setShowCancel] = useState(false);
	useEffect(() => {
		const setId = setTimeout(() => {
			setShowCancel(true);
		}, 10000);
		return () => {
			clearTimeout(setId);
		};
	}, []);
	return (
		<div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/40 backdrop-blur-md">
			<div className="glass p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in">
				<div id="loader" className="mb-6"></div>
				{showCancel && (
					<button
						onClick={() => dispatch(setLoading(false))}
						className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 text-white font-bold shadow hover:bg-slate-800/80 border border-slate-400/30"
					>
						Cancel
					</button>
				)}
			</div>
		</div>
	);
};

export default Loading;
