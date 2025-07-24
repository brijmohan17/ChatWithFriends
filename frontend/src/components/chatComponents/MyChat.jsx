import React, { useEffect } from "react";
import { FaPenAlt } from "react-icons/fa";
import { addMyChat, addSelectedChat } from "../../redux/slices/myChatSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    setChatLoading,
    setGroupChatBox,
} from "../../redux/slices/conditionSlice";
import ChatShimmer from "../loading/ChatShimmer";
import getChatName, { getChatImage } from "../../utils/getChatName";
import { VscCheckAll } from "react-icons/vsc";
import { SimpleDateAndTime, SimpleTime } from "../../utils/formateDateTime";

const MyChat = () => {
    const dispatch = useDispatch();
    const myChat = useSelector((store) => store.myChat.chat);
    const authUserId = useSelector((store) => store?.auth?._id);
    const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
    const isChatLoading = useSelector(
        (store) => store?.condition?.isChatLoading
    );
    // Re render newmessage send and new group chat created
    const newMessageId = useSelector((store) => store?.message?.newMessageId);
    const isGroupChatId = useSelector((store) => store.condition.isGroupChatId);
    // All My Chat Api Call
    useEffect(() => {
        const getMyChat = () => {
            dispatch(setChatLoading(true));
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    dispatch(addMyChat(json?.data || []));
                    dispatch(setChatLoading(false));
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(setChatLoading(false));
                });
        };
        getMyChat();
    }, [newMessageId, isGroupChatId]);
    return (
        <>
            <div className="p-6 w-full h-[7vh] font-semibold flex justify-between items-center bg-slate-800 text-white border-slate-500 border-r">
                <h1 className="mr-2 whitespace-nowrap text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent drop-shadow">My Chats</h1>
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-400/40 shadow-md text-cyan-200 font-semibold hover:bg-cyan-400/10 hover:text-cyan-300 transition-all"
                    title="Create New Group"
                    onClick={() => dispatch(setGroupChatBox())}
                >
                    <FaPenAlt className="text-cyan-400" />
                    <span className="hidden sm:inline">New Group</span>
                </button>
            </div>
            <div className="flex flex-col w-full px-2 sm:px-4 gap-2 py-3 overflow-y-auto overflow-hidden scroll-style h-[73vh] bg-gradient-to-br from-slate-900/60 to-blue-900/40 rounded-2xl shadow-inner">
                {myChat.length == 0 && isChatLoading ? (
                    <ChatShimmer />
                ) : (
                    <>
                        {myChat?.length === 0 && (
                            <div className="w-full h-full flex justify-center items-center text-white">
                                <h1 className="text-base font-semibold">
                                    Start a new conversation.
                                </h1>
                            </div>
                        )}
                        {myChat?.map((chat) => {
                            return (
                                <div
                                    key={chat?._id}
                                    className={`w-full h-16 glass border border-cyan-400/30 rounded-xl flex justify-start items-center p-2 font-semibold gap-3 hover:bg-cyan-400/10 transition-all cursor-pointer shadow-md mb-2 ${
                                        selectedChat?._id == chat?._id
                                            ? "bg-gradient-to-tr from-cyan-400/30 to-blue-900/40 border-2 border-cyan-400 text-cyan-200"
                                            : "text-white"
                                    } animate-fade-in`}
                                    onClick={() => {
                                        dispatch(addSelectedChat(chat));
                                    }}
                                >
                                    <img
                                        className="h-12 min-w-12 rounded-full border-2 border-cyan-400 object-cover bg-white"
                                        src={getChatImage(chat, authUserId)}
                                        alt="img"
                                    />
                                    <div className="w-full">
                                        <div className="flex justify-between items-center w-full">
                                            <span className="line-clamp-1 capitalize text-lg font-bold text-cyan-200">
                                                {getChatName(chat, authUserId)}
                                            </span>
                                            <span className="text-xs font-light ml-1 text-cyan-100">
                                                {chat?.latestMessage && SimpleTime(chat?.latestMessage?.createdAt)}
                                            </span>
                                        </div>
                                        <span className="text-xs font-light line-clamp-1 text-cyan-100">
                                            {chat?.latestMessage ? (
                                                <div className="flex items-end gap-1">
                                                    <span>
                                                        {chat?.latestMessage?.sender?._id === authUserId && (
                                                            <VscCheckAll color="cyan" fontSize={14} />
                                                        )}
                                                    </span>
                                                    <span className="line-clamp-1">
                                                        {chat?.latestMessage?.message}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-light text-cyan-100">
                                                    {SimpleDateAndTime(chat?.createdAt)}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </>
    );
};

export default MyChat;
