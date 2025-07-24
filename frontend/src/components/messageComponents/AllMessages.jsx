import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { VscCheckAll } from "react-icons/vsc";
import { CgChevronDoubleDown } from "react-icons/cg";
import {
    SimpleDateAndTime,
    SimpleDateMonthDay,
    SimpleTime,
} from "../../utils/formateDateTime";

const AllMessages = ({ allMessage }) => {
    const chatBox = useRef();
    const adminId = useSelector((store) => store.auth?._id);
    const isTyping = useSelector((store) => store?.condition?.isTyping);

    const [scrollShow, setScrollShow] = useState(true);
    // Handle Chat Box Scroll Down
    const handleScrollDownChat = () => {
        if (chatBox.current) {
            chatBox.current.scrollTo({
                top: chatBox.current.scrollHeight,
                // behavior: "auto",
            });
        }
    };
    // Scroll Button Hidden
    useEffect(() => {
        handleScrollDownChat();
        if (chatBox.current.scrollHeight == chatBox.current.clientHeight) {
            setScrollShow(false);
        }
        const handleScroll = () => {
            const currentScrollPos = chatBox.current.scrollTop;
            if (
                currentScrollPos + chatBox.current.clientHeight <
                chatBox.current.scrollHeight - 30
            ) {
                setScrollShow(true);
            } else {
                setScrollShow(false);
            }
        };
        const chatBoxCurrent = chatBox.current;
        chatBoxCurrent.addEventListener("scroll", handleScroll);
        return () => {
            chatBoxCurrent.removeEventListener("scroll", handleScroll);
        };
    }, [allMessage, isTyping]);

    return (
        <>
            {scrollShow && (
                <div
                    className="absolute bottom-20 right-6 cursor-pointer z-20 font-light glass shadow-lg hover:scale-110 transition-all text-cyan-200 hover:text-white p-2 rounded-full border border-cyan-400"
                    onClick={handleScrollDownChat}
                >
                    <CgChevronDoubleDown title="Scroll Down" fontSize={24} />
                </div>
            )}
            <div
                className="flex flex-col w-full px-2 sm:px-6 gap-2 py-4 overflow-y-auto overflow-hidden scroll-style h-[66vh] bg-gradient-to-br from-slate-900/60 to-blue-900/40 rounded-2xl shadow-inner"
                ref={chatBox}
            >
                {allMessage?.map((message, idx) => {
                    return (
                        <Fragment key={message._id}>
                            <div className="sticky top-0 flex w-full justify-center z-10">
                                {new Date(
                                    allMessage[idx - 1]?.updatedAt
                                ).toDateString() !==
                                    new Date(
                                        message?.updatedAt
                                    ).toDateString() && (
                                    <span className="text-xs font-semibold mb-2 mt-1 glass shadow px-6 py-1 rounded-full border border-cyan-400 text-cyan-200 backdrop-blur cursor-pointer">
                                        {SimpleDateMonthDay(message?.updatedAt)}
                                    </span>
                                )}
                            </div>
                            <div
                                className={`flex items-end gap-2 sm:gap-3 mb-1 ${
                                    message?.sender?._id === adminId
                                        ? "flex-row-reverse text-white"
                                        : "flex-row text-black"
                                }`}
                            >
                                {message?.chat?.isGroupChat &&
                                    message?.sender?._id !== adminId && (
                                        <img
                                            src={message?.sender?.image}
                                            alt="avatar"
                                            className="h-10 w-10 rounded-full border-2 border-cyan-400 shadow-md object-cover bg-white"
                                        />
                                )}
                                <div
                                    className={`glass shadow-md px-4 py-2 min-w-10 text-start flex flex-col relative max-w-[80vw] sm:max-w-[65%] ${
                                        message?.sender?._id === adminId
                                            ? "bg-gradient-to-tr from-cyan-400/80 to-slate-800/90 rounded-s-2xl rounded-ee-3xl border border-cyan-400"
                                            : "bg-gradient-to-tr from-white/80 to-slate-800/80 rounded-e-2xl rounded-es-3xl border border-slate-300"
                                    }`}
                                >
                                    {message?.chat?.isGroupChat &&
                                        message?.sender?._id !== adminId && (
                                            <span className="text-xs font-bold text-cyan-700 mb-1">
                                                {message?.sender?.firstName}
                                            </span>
                                        )}
                                    <div
                                        className={`mt-1 pb-1.5 ${
                                            message?.sender?._id == adminId
                                                ? "pr-16"
                                                : "pr-12"
                                        }`}
                                    >
                                        <span className="break-words text-base">
                                            {message?.message}
                                        </span>
                                        <span
                                            className="text-[11px] font-light absolute bottom-1 right-2 flex items-end gap-1.5 px-2 py-0.5 rounded-full glass border border-cyan-200 shadow-sm backdrop-blur"
                                            title={SimpleDateAndTime(
                                                message?.updatedAt
                                            )}
                                        >
                                            {SimpleTime(message?.updatedAt)}
                                            {message?.sender?._id ===
                                                adminId && (
                                                <VscCheckAll
                                                    color="white"
                                                    fontSize={14}
                                                />
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    );
                })}
                {isTyping && (
                    <div className="flex items-end gap-2 mt-2">
                        <div className="h-10 w-10 rounded-full bg-cyan-200/40 border-2 border-cyan-400 flex items-center justify-center shadow-md">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="6" cy="12" r="2" fill="#06b6d4">
                                    <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" begin="0s"/>
                                </circle>
                                <circle cx="12" cy="12" r="2" fill="#06b6d4">
                                    <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" begin="0.2s"/>
                                </circle>
                                <circle cx="18" cy="12" r="2" fill="#06b6d4">
                                    <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" begin="0.4s"/>
                                </circle>
                            </svg>
                        </div>
                        <div className="glass px-4 py-2 rounded-2xl border border-cyan-200 shadow text-cyan-700 font-semibold text-sm animate-pulse">Typing...</div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AllMessages;
