import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import { AiOutlineArrowRight, AiOutlineDelete, AiOutlineSearch, AiOutlineMessage } from "react-icons/ai";
import styles from "../../styles/styles";
import { format } from "timeago.js";
import socketIO from "socket.io-client";
import { getAllConversations, getAllMessages, sendMessage } from "../../redux/actions/message";
import { server } from "../../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../../server";

const ENDPOINT = "http://localhost:8000";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardMessages = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { conversations, messages: reduxMessages, isLoading, error } = useSelector((state) => state.messages);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();
  const [userData, setUserData] = useState(null);
  const scrollRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (seller?._id) {
      console.log('Seller connecting to socket:', seller._id);
      socketId.emit("addUser", seller._id);

      // Remove existing listener to prevent duplicates
      socketId.off("getUsers");

      socketId.on("getUsers", (data) => {
        console.log('Online users received:', data);
        setOnlineUsers(data);
      });
    }

    return () => {
      socketId.off("getUsers");
    };
  }, [seller]);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        images: data.images,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    setMessages(reduxMessages);
  }, [reduxMessages]);


  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllConversations(seller._id));
    }
  }, [dispatch, seller]);

  useEffect(() => {
    const getUserData = async () => {
      if (currentChat?._id) {
        dispatch(getAllMessages(currentChat._id));
        const chatMember = currentChat.members.find((member) => member !== seller?._id);
        if (chatMember) {
          try {
            const { data } = await axios.get(`${server}/user/user-info/${chatMember}`);
            setUserData(data.user);

            // Check if user is online
            const isOnline = onlineUsers.find((user) => user.userId === chatMember);
            setActiveStatus(isOnline ? true : false);
          } catch (error) {
            console.log(error);
          }
        }
      }
    };
    getUserData();
  }, [currentChat, dispatch, seller, onlineUsers]);

  useEffect(() => {
    if (currentChat) {
      dispatch(getAllMessages(currentChat._id));
    }
  }, [currentChat, dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const onlineCheck = (chat) => {
    const chatMember = chat.members.find((member) => member !== seller?._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage && !images) return;

    try {
      const receiverId = currentChat.members.find(
        (member) => member !== seller._id
      );

      // send message to socket server
      socketId.emit("sendMessage", {
        senderId: seller._id,
        receiverId,
        text: newMessage,
        images: images,
      });

      const messageData = {
        sender: seller._id,
        text: newMessage,
        conversationId: currentChat._id,
      };

      if (images) {
        messageData.images = images;
      }

      const response = await axios.post(
        `${server}/message/create-new-message`,
        messageData
      );

      setImages();
      setNewMessage("");

      // Update last message in conversation
      await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      });

      setMessages((prev) => [...prev, messageData]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      if (reader.readyState === 2) {
        setImages(reader.result);

        const receiverId = currentChat.members.find(
          (member) => member !== seller._id
        );

        socketId.emit("sendMessage", {
          senderId: seller._id,
          receiverId,
          images: reader.result,
        });

        try {
          await axios.post(
            `${server}/message/create-new-message`,
            {
              images: reader.result,
              sender: seller._id,
              text: newMessage,
              conversationId: currentChat._id,
            }
          ).then((res) => {
            setImages();
            setNewMessage("");
            setMessages((prev) => [...prev, res.data.message]);
          });
        } catch (error) {
          console.log(error);
        }
      }
    };

    reader.readAsDataURL(file);
  };

  // Filter conversations based on search
  // Since we don't have the friend's name directly in the conversation object until it's rendered in MessageList,
  // we might need a different approach or fetch it. However, the existing implementation fetches user data inside MessageList.
  // To keep it simple and consistent with UserInbox (which fetches upfront), we'll do this:
  // For now, let's update the UI structure first. Filtering by name inside MessageList is tricky without hoisting state.
  // We'll rely on the conversations list for now, but adding the Search Bar UI is the priority.
  // NOTE: UserInbox fetches friend data upfront. DashboardMessages fetches it inside MessageList.
  // To support search properly, we should refactor data fetching, but I will first align the UI.

  return (
    <div className="w-[98%] 800px:w-[95%] bg-white dark:bg-gray-800 m-auto mt-5 h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700">
      {/* All messages list */}
      {!open && (
        <>
          <div className="bg-gradient-to-r from-brand-teal to-brand-purple dark:from-brand-teal-dark dark:to-brand-purple py-6 shadow-md">
            <h1 className="text-center text-3xl font-bold text-white font-Poppins tracking-tight">
              Shop Inbox
            </h1>
          </div>

          {/* Search Bar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-10 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
              />
              <AiOutlineSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations && conversations.length > 0 ? (
              conversations.map((item, index) => (
                <MessageList
                  data={item}
                  key={index}
                  index={index}
                  setOpen={setOpen}
                  setCurrentChat={setCurrentChat}
                  me={seller._id}
                  setUserData={setUserData}
                  userData={userData}
                  online={onlineCheck(item)}
                  setActiveStatus={setActiveStatus}
                  isLoading={isLoading}
                  searchTerm={searchTerm}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <div className="w-24 h-24 mb-6 bg-gradient-to-br from-brand-teal/20 to-brand-purple/20 rounded-full flex items-center justify-center">
                  <AiOutlineMessage size={48} className="text-brand-teal dark:text-brand-teal-light" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  No Messages Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start a conversation with a user to see your messages here
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={handleSendMessage}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
  isLoading,
  searchTerm
}) => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = data.members.find((user) => user !== me);

    const getUser = async () => {
      try {
        const { data } = await axios.get(
          `${server}/user/user-info/${userId}`
        );
        setUser(data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  const handleClick = (id) => {
    navigate(`/dashboard-messages?${id}`);
    setOpen(true);
    setCurrentChat(data);
  };

  // Filter based on search term (simple client-side filter)
  if (searchTerm && user?.name && !user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
    return null;
  }

  return (
    <div
      className={`w-full flex p-4 px-4 hover:bg-brand-teal/5 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer border-b border-gray-100 dark:border-gray-700 ${index === 0 ? "bg-brand-teal/5 dark:bg-gray-700" : "bg-transparent"
        }`}
      onClick={() => handleClick(data._id)}
    >
      <div className="relative">
        <img
          src={user?.avatar?.url || user?.avatar}
          alt=""
          className="w-[55px] h-[55px] rounded-full border-2 border-brand-teal/20 dark:border-brand-teal object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/55';
          }}
        />
        {online ? (
          <div className="w-[14px] h-[14px] bg-brand-teal rounded-full absolute top-[2px] right-[2px] border-2 border-white dark:border-gray-800" />
        ) : (
          <div className="w-[14px] h-[14px] bg-gray-400 dark:bg-gray-500 rounded-full absolute top-[2px] right-[2px] border-2 border-white dark:border-gray-800" />
        )}
      </div>
      <div className="pl-4 flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[17px] font-bold text-gray-800 dark:text-white truncate">{user?.name}</h1>
          {online && (
            <span className="text-xs font-semibold text-brand-teal dark:text-brand-teal-light bg-brand-teal/10 px-2 py-0.5 rounded-full">
              Online
            </span>
          )}
        </div>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 truncate">
          {data?.lastMessage
            ? data.lastMessage.slice(0, 40) + "..."
            : "No messages yet"}
        </p>
      </div>
      <div
        className="p-2 hover:bg-red-100 rounded-full group-hover:block transition-all duration-200"
        onClick={(e) => {
          e.stopPropagation();
          const confirmDelete = window.confirm("Are you sure you want to delete this conversation?");
          if (confirmDelete) {
            axios
              .delete(`${server}/conversation/delete-conversation/${data._id}`, { withCredentials: true })
              .then((res) => {
                window.location.reload();
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }}
      >
        <AiOutlineDelete size={20} className="text-gray-400 hover:text-red-500" />
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
      {/* Unified Chat Container */}
      <div className="flex-1 flex flex-col w-full h-full">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-brand-teal to-brand-purple dark:from-brand-teal-dark dark:to-brand-purple shadow-lg rounded-t-3xl px-6 py-4 border-2 border-gray-100 dark:border-gray-700 border-b-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300"
              >
                <AiOutlineArrowRight size={24} className="rotate-180" />
              </button>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={userData?.avatar?.url || userData?.avatar}
                    alt=""
                    className="w-[48px] h-[48px] rounded-full border-2 border-white/50 object-cover shadow-md"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48';
                    }}
                  />
                  {activeStatus && (
                    <div className="w-[14px] h-[14px] bg-white rounded-full absolute bottom-0 right-0 border-2 border-brand-teal shadow-sm">
                      <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-[18px] font-bold text-white">
                    {userData?.name}
                  </h1>
                  <p className="text-[13px] font-medium flex items-center gap-1.5 text-white/90">
                    {activeStatus ? (
                      <>
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        <span>Active now</span>
                      </>
                    ) : (
                      <span className="text-white/70">Offline</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div
          className="flex-1 min-h-0 bg-white dark:bg-gray-800 border-x-2 border-gray-100 dark:border-gray-700 overflow-y-auto pr-1"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#06B6D4 #f3f4f6'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 8px;
            }
            div::-webkit-scrollbar-track {
              background: #f3f4f6;
            }
            div::-webkit-scrollbar-thumb {
              background: #06B6D4;
              border-radius: 10px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #0891B2;
            }
            .dark div::-webkit-scrollbar-track {
              background: #374151;
            }
            .dark div::-webkit-scrollbar-thumb {
              background: #06B6D4;
            }
          `}</style>
          <div className="px-6 py-6">
            {messages &&
              messages.map((item, index) => (
                <div
                  className={`flex w-full my-4 ${item.sender === sellerId ? "justify-end" : "justify-start"
                    }`}
                  ref={scrollRef}
                  key={index}
                >
                  {item.sender !== sellerId && (
                    <img
                      src={userData?.avatar?.url || userData?.avatar}
                      className="w-[36px] h-[36px] rounded-full mr-3 border-2 border-brand-teal/30 object-cover self-end"
                      alt=""
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/36';
                      }}
                    />
                  )}
                  <div className={`flex flex-col ${item.sender === sellerId ? "items-end" : "items-start"}`}>
                    {item.images && (
                      <img
                        src={`${item.images?.url}`}
                        className="max-w-[300px] h-auto object-cover rounded-2xl shadow-lg mb-2"
                        alt=""
                      />
                    )}
                    {item.text !== "" && (
                      <div>
                        <div
                          className={`max-w-[400px] px-5 py-3 rounded-2xl shadow-md ${item.sender === sellerId
                            ? "bg-gradient-to-r from-brand-teal to-brand-purple text-white rounded-br-sm"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-sm"
                            }`}
                        >
                          <p className="text-[15px] leading-relaxed break-words">{item.text}</p>
                        </div>
                        <p className={`text-[11px] text-gray-500 dark:text-gray-400 mt-1 ${item.sender === sellerId ? "text-right" : "text-left"
                          }`}>
                          {format(item.createdAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 p-4 border-2 border-gray-100 dark:border-gray-700 border-t-0 rounded-b-3xl shadow-lg">
          <form
            aria-required={true}
            className="flex items-center gap-3"
            onSubmit={sendMessageHandler}
          >
            <div className="flex-shrink-0">
              <input
                type="file"
                name=""
                id="image"
                className="hidden"
                onChange={handleImageUpload}
              />
              <label htmlFor="image" className="cursor-pointer">
                <div className="w-[44px] h-[44px] bg-gradient-to-r from-brand-teal/10 to-brand-purple/10 dark:from-brand-teal/20 dark:to-brand-purple/20 hover:from-brand-teal/20 hover:to-brand-purple/20 rounded-full flex items-center justify-center transition-all duration-300">
                  <TfiGallery className="text-brand-teal dark:text-brand-teal-light" size={20} />
                </div>
              </label>
            </div>

            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white px-5 py-3 pr-12 rounded-full focus:border-brand-teal dark:focus:border-brand-teal-light focus:outline-none transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="w-[36px] h-[36px] bg-gradient-to-r from-brand-teal to-brand-purple hover:from-brand-teal-dark hover:to-brand-purple-dark rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg">
                  <AiOutlineSend size={18} className="text-white" />
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardMessages;