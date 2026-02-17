import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { server } from "../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend, AiOutlineMessage, AiOutlineSearch, AiOutlineDelete } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/styles";
const ENDPOINT = "http://localhost:8000";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInbox = ({ isProfile }) => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [images, setImages] = useState();
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef(null);

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
    const getConversation = async () => {
      try {
        const response = await axios.get(
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          }
        );

        const conversationData = response.data.conversations;

        // Fetch user/shop details for each conversation to enable searching/filtering
        const enrichedConversations = await Promise.all(
          conversationData.map(async (conversation) => {
            const friendId = conversation.members.find((m) => m !== user?._id);
            if (friendId) {
              try {
                const res = await axios.get(`${server}/shop/get-shop-info/${friendId}`);
                return { ...conversation, friend: res.data.shop };
              } catch (err) {
                console.log("Error fetching shop info:", err);
                return conversation;
              }
            }
            return conversation;
          })
        );

        setConversations(enrichedConversations);
      } catch (error) {
        // console.log(error);
      }
    };
    if (user) {
      getConversation();
    }
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      const userId = user?._id;
      console.log('User connecting to socket:', userId);
      socketId.emit("addUser", userId);

      // Remove existing listener to prevent duplicates
      socketId.off("getUsers");

      socketId.on("getUsers", (data) => {
        console.log('Online users received (user side):', data);
        setOnlineUsers(data);
      });
    }

    return () => {
      socketId.off("getUsers");
    };
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentChat) {
      getMessage();
    }
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    if (!newMessage && !images) {
      return;
    }

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    // send message to socket server
    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
      images: images,
    });

    try {
      if (images) {
        const response = await axios.post(
          `${server}/message/create-new-message`,
          {
            images,
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
          }
        );
        setImages();
      } else {
        const response = await axios.post(
          `${server}/message/create-new-message`,
          message
        );
      }

      // Update last message in conversation
      await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: user._id,
      });

      setNewMessage("");
      setMessages((prev) => [...prev, message]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (e) => {

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(
          `${server}/message/create-new-message`,
          {
            images: e,
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
          }
        )
        .then((res) => {
          setImages();
          setNewMessage("");
          setMessages([...messages, res.data.message]);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((item) =>
    item.friend?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`w-full ${!isProfile ? 'min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900' : ''}`}>
      {!open && (
        <>
          {!isProfile && <Header />}

          {/* Messages Container */}
          <div className={`${!isProfile ? 'max-w-5xl mx-auto px-4 py-8' : 'w-full'}`}>
            {/* Header inside container */}
            <div className="bg-gradient-to-r from-brand-teal to-brand-purple dark:from-brand-teal-dark dark:to-brand-purple py-6 px-8 relative shadow-lg rounded-t-2xl mb-0">
              <button
                onClick={() => navigate(-1)}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300"
              >
                <AiOutlineArrowRight size={24} className="rotate-180" />
              </button>
              <h1 className="text-center text-3xl font-bold text-white font-Poppins">
                All Messages
              </h1>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 border-x border-gray-100 dark:border-gray-700 p-4">
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

            {filteredConversations && filteredConversations.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-xl overflow-hidden">
                {filteredConversations.map((item, index) => (
                  <MessageList
                    data={item}
                    userInfo={item.friend}
                    key={index}
                    index={index}
                    setOpen={setOpen}
                    setCurrentChat={setCurrentChat}
                    me={user?._id}
                    setUserData={setUserData}
                    userData={userData}
                    online={onlineCheck(item)}
                    setActiveStatus={setActiveStatus}
                    loading={loading}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-xl p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-brand-teal/20 to-brand-purple/20 rounded-full flex items-center justify-center">
                  <AiOutlineMessage size={48} className="text-brand-teal dark:text-brand-teal-light" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {searchTerm ? "No results found" : "No Messages Yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? "Try searching for a different shop name" : "Start a conversation with a shop to see your messages here"}
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
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={user._id}
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
  userInfo,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading
}) => {
  const [active, setActive] = useState(0);
  // const [user, setUser] = useState([]); // Removed internal state, using userInfo prop
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/inbox?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
  }, [me, data, online, setActiveStatus]);

  // Render using userInfo prop instead of fetching
  const user = userInfo;

  return (
    <div
      className={`w-full flex items-center p-5 hover:bg-gradient-to-r hover:from-brand-teal/5 hover:to-brand-purple/5 dark:hover:from-brand-teal/10 dark:hover:to-brand-purple/10 transition-all duration-300 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 group ${active === index ? "bg-gradient-to-r from-brand-teal/5 to-brand-purple/5 dark:from-brand-teal/10 dark:to-brand-purple/10" : "bg-transparent"
        }`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="relative">
        <div className="relative">
          <img
            src={`${user?.avatar?.url}`}
            alt=""
            className="w-[60px] h-[60px] rounded-full object-cover border-3 border-white dark:border-gray-700 shadow-md group-hover:shadow-lg transition-shadow duration-300"
          />
          {online ? (
            <div className="w-[16px] h-[16px] bg-gradient-to-r from-green-400 to-green-500 rounded-full absolute bottom-0 right-0 border-3 border-white dark:border-gray-800 shadow-sm" />
          ) : (
            <div className="w-[16px] h-[16px] bg-gray-400 dark:bg-gray-500 rounded-full absolute bottom-0 right-0 border-3 border-white dark:border-gray-800" />
          )}
        </div>
      </div>
      <div className="pl-4 flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[17px] font-bold text-gray-800 dark:text-white truncate">
            {user?.name}
          </h1>
          {online && (
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
              Online
            </span>
          )}
        </div>
        <p className="text-[14px] text-gray-600 dark:text-gray-400 truncate">
          {!loading && data?.lastMessageId !== userData?._id
            ? "You: "
            : userData?.name.split(" ")[0] + ": "}
          {data?.lastMessage}
        </p>
      </div>
      <div
        className="p-2 hover:bg-red-100 rounded-full group-hover:block transition-all duration-200 ml-2"
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
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-teal-50 via-cyan-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Unified Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 h-full">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-brand-teal to-brand-purple dark:from-brand-teal-dark dark:to-brand-purple shadow-lg rounded-t-2xl px-6 py-4 border-2 border-gray-200 dark:border-gray-700 border-b-0">
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
                    src={`${userData?.avatar?.url}`}
                    alt=""
                    className="w-[48px] h-[48px] rounded-full border-2 border-white/50 object-cover shadow-md"
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
                  <p className="text-[13px] font-medium flex items-center gap-1.5">
                    {activeStatus ? (
                      <>
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        <span className="text-white/95">Active now</span>
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
          className="flex-1 min-h-0 bg-white dark:bg-gray-800 border-x-2 border-gray-200 dark:border-gray-700 overflow-y-auto pr-1"
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
                      src={`${userData?.avatar?.url}`}
                      className="w-[36px] h-[36px] rounded-full mr-3 border-2 border-brand-teal/30 object-cover self-end"
                      alt=""
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
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 border-t-0 rounded-b-2xl p-4 shadow-lg">
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

export default UserInbox;
