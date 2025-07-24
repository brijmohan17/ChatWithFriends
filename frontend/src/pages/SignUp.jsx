import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkValidSignUpFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignUp = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [load, setLoad] = useState("");
	const [isShow, setIsShow] = useState(false);
	const navigate = useNavigate();

	const signUpUser = (e) => {
		toast.loading("Wait until you SignUp");
		e.target.disabled = true;
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstName,
				lastName,
				email,
				password,
			}),
		})
			.then((response) => response.json())
			.then((json) => {
				setLoad("");
				e.target.disabled = false;
				toast.dismiss();
				if (json.token) {
					navigate("/signin");
					toast.success(json?.message);
				} else {
					toast.error(json?.message);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				setLoad("");
				toast.dismiss();
				toast.error("Error : " + error.code);
				e.target.disabled = false;
			});
	};

	const handleSignup = (e) => {
		if (firstName && lastName && email && password) {
			const validError = checkValidSignUpFrom(firstName, lastName, email, password);
			if (validError) {
				toast.error(validError);
				return;
			}
			setLoad("Loading...");
			signUpUser(e);
		} else {
			toast.error("Required: All Fields");
		}
	};

	return (
		<div className="flex flex-col items-center my-6 text-slate-300 min-h-[80vh]">
			<div className="p-4 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] min-w-72 max-w-[1000px] border border-slate-400 bg-slate-800 rounded-lg mt-5 transition-all">
				<h2 className="text-2xl underline underline-offset-8 font-semibold text-slate-100 text-center mb-4">
					SignUp ChatApp
				</h2>
				<form className="w-full flex flex-col">
					<label className="text-xl font-semibold p-1">Enter First Name</label>
					<input
						className="w-full border border-slate-700 my-2 py-3 px-6 rounded-full bg-white text-black"
						type="text"
						placeholder="Enter First Name"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>

					<label className="text-xl font-semibold p-1">Enter Last Name</label>
					<input
						className="w-full border border-slate-700 my-2 py-3 px-6 rounded-full bg-white text-black"
						type="text"
						placeholder="Enter Last Name"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					/>

					<label className="text-xl font-semibold p-1">Enter Email Address</label>
					<input
						className="w-full border border-slate-700 my-2 py-3 px-6 rounded-full bg-white text-black"
						type="email"
						placeholder="Enter Email Address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<label className="text-xl font-semibold p-1">Enter Password</label>
					<div className="relative">
						<input
							className="w-full border border-slate-700 my-2 py-3 px-6 rounded-full bg-white text-black"
							type={isShow ? "text" : "password"}
							placeholder="Enter Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span
							onClick={() => setIsShow(!isShow)}
							className="cursor-pointer text-black/80 absolute right-5 top-[20px]"
						>
							{isShow ? <PiEyeClosedLight fontSize={22} /> : <PiEye fontSize={22} />}
						</span>
					</div>

					<button
						onClick={(e) => {
							e.preventDefault();
							handleSignup(e);
						}}
						className="disabled:opacity-50 disabled:cursor-not-allowed w-full font-semibold hover:bg-black rounded-full px-5 py-3 mt-4 text-lg border border-slate-400 text-slate-400 hover:text-white bg-slate-700 transition-all"
					>
						{load === "" ? "SignUp" : load}
					</button>

					<div className="flex items-center my-4">
						<div className="flex-1 h-[1px] bg-slate-600"></div>
						<Link to="/signin">
							<div className="px-3 font-semibold text-md hover:text-white">SignIn</div>
						</Link>
						<div className="flex-1 h-[1px] bg-slate-600"></div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
