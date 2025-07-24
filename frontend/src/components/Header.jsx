import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import handleScrollTop from "../utils/handleScrollTop";
import {
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdNotificationsActive,
} from "react-icons/md";
import {
	setHeaderMenu,
	setLoading,
	setNotificationBox,
	setProfileDetail,
} from "../redux/slices/conditionSlice";
import { IoLogOutOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";

const Header = () => {
	const user = useSelector((store) => store.auth);
	const isHeaderMenu = useSelector((store) => store?.condition?.isHeaderMenu);
	const newMessageRecieved = useSelector(
		(store) => store?.myChat?.newMessageRecieved
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const getAuthUser = (token) => {
		dispatch(setLoading(true));
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addAuth(json.data));
				dispatch(setLoading(false));
			})
			.catch((err) => {
				console.log(err);
				dispatch(setLoading(false));
			});
	};
	useEffect(() => {
		if (token) {
			getAuthUser(token);
			navigate("/");
		} else {
			navigate("/signin");
		}
		dispatch(setHeaderMenu(false));
	}, [token]);

	// Scroll to top of page && Redirect Auth change --------------------------------
	const { pathname } = useLocation();
	useEffect(() => {
		if (user) {
			navigate("/");
		} else if (pathname !== "/signin" && pathname !== "/signup") {
			navigate("/signin");
		}
		handleScrollTop();
	}, [pathname, user]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
		navigate("/signin");
	};

	useEffect(() => {
		var prevScrollPos = window.pageYOffset;
		const handleScroll = () => {
			var currentScrollPos = window.pageYOffset;
			if (prevScrollPos < currentScrollPos && currentScrollPos > 80) {
				document.getElementById("header").classList.add("hiddenbox");
			} else {
				document.getElementById("header").classList.remove("hiddenbox");
			}
			prevScrollPos = currentScrollPos;
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const headerMenuBox = useRef(null);
	const headerUserBox = useRef(null);
	// headerMenuBox outside click handler
	const handleClickOutside = (event) => {
		if (
			headerMenuBox.current &&
			!headerUserBox?.current?.contains(event.target) &&
			!headerMenuBox.current.contains(event.target)
		) {
			dispatch(setHeaderMenu(false));
		}
	};

	// add && remove events according to isHeaderMenu
	useEffect(() => {
		if (isHeaderMenu) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isHeaderMenu]);
	return (
		<div
			id="header"
			className="w-full h-16 fixed top-0 z-50 md:h-20 glass shadow-lg flex justify-between items-center px-6 py-2 font-semibold text-white backdrop-blur-md border-b border-slate-700"
		>
			<div className="flex items-center justify-start gap-3">
				<Link to={"/"}>
					<img
						src={Logo}
						alt="ChatApp"
						className="h-12 w-12 rounded-full border-2 border-blue-400 shadow-md bg-white object-cover"
					/>
				</Link>
				<Link to={"/"}>
					<span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">ChatApp</span>
				</Link>
			</div>

			{user ? (
				<div className="flex flex-nowrap items-center gap-3">
					<span
						className={`relative flex items-center justify-center cursor-pointer transition-all ${newMessageRecieved.length > 0 ? "animate-bounce" : ""}`}
						title={`You have ${newMessageRecieved.length} new notifications`}
						onClick={() => dispatch(setNotificationBox(true))}
					>
						<MdNotificationsActive fontSize={28} className="text-blue-400 drop-shadow" />
						{newMessageRecieved.length > 0 && (
							<span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow-lg border-2 border-slate-800">
								{newMessageRecieved.length}
							</span>
						)}
					</span>
					<span className="whitespace-nowrap ml-2 text-lg font-medium">
						Hi, {user.firstName}
					</span>
					<div
						ref={headerUserBox}
						onClick={(e) => {
							e.preventDefault();
							dispatch(setHeaderMenu(!isHeaderMenu));
						}}
						className="flex items-center gap-2 border-2 border-blue-400 rounded-full bg-white/80 hover:bg-blue-100 shadow-md cursor-pointer px-2 py-1 transition-all"
					>
						<img
							src={user.image}
							alt="gg"
							className="w-10 h-10 rounded-full object-cover border border-slate-300"
						/>
						<span className="m-2">
							{isHeaderMenu ? (
								<MdKeyboardArrowDown fontSize={22} />
							) : (
								<MdKeyboardArrowUp fontSize={22} />
							)}
						</span>
					</div>
					{isHeaderMenu && (
						<div
							ref={headerMenuBox}
							className="glass border border-slate-500 text-white w-44 py-3 flex flex-col justify-center rounded-xl items-center gap-2 absolute top-16 right-4 z-40 shadow-xl backdrop-blur-lg"
						>
							<div
								onClick={() => {
									dispatch(setHeaderMenu(false));
									dispatch(setProfileDetail());
								}}
								className="flex items-center w-full cursor-pointer justify-center hover:bg-blue-100 hover:text-blue-900 p-2 rounded-lg transition-all"
							>
								<div className="flex items-center justify-between w-2/4 gap-2">
									<PiUserCircleLight fontSize={23} />
									<span>Profile</span>
								</div>
							</div>
							<div
								className="flex items-center w-full cursor-pointer justify-center hover:bg-red-100 hover:text-red-700 p-2 rounded-lg transition-all"
								onClick={handleLogout}
							>
								<div className="flex items-center justify-between w-2/4 gap-2">
									<IoLogOutOutline fontSize={21} />
									<span>Logout</span>
								</div>
							</div>
						</div>
					)}
				</div>
			) : (
				<Link to={"/signin"}>
					<button className="py-2 px-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow-lg hover:from-blue-600 hover:to-cyan-500 transition-all border-none">
						Sign In
					</button>
				</Link>
			)}
		</div>
	);
};

export default Header;
