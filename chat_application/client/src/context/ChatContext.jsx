import { createContext, useState, useCallback, useEffect } from "react";
import { getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext({});

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatLoading, setIsUserChatLoading] = useState(null);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotificatons] = useState([]);
  const [allUsers, setAllUsers] = useState([])

  console.log("NOTIFICATIONS", notifications);

  useEffect(() => {
    // initial socket
    const newSocket = io("http://localhost:3000/");
    setSocket(newSocket);

    // on destroy => cleanup fnction
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (response) => {
      setOnlineUsers(response);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // send message
  useEffect(() => {
    if (!socket) return;
    const recipientId = currentChat?.members.find(id => id !== user?._id);
    socket.emit("sendMessage", {...newMessage, recipientId});
  }, [newMessage]);

//  receive message
    useEffect(()=>{
        if (!socket) return;
        socket.on("getMessage", response => {
            if(currentChat?._id !== response?.chatId) {
                return;
            }
            setMessages(prev => [...prev, response]);
        });

        socket.on("getNotification", response => {
            const isChatOpen = currentChat?.members?.some(id => id === response.senderId);
            if (isChatOpen) {
                response.isRead = true;
            }
            setNotificatons(prev => [response, ...prev]);
        });

        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        }
    }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const resp = await getRequest("/users");
      if (resp.error) {
        return;
      }
      setAllUsers(resp);

      setPotentialChats(
        resp.filter((member) => {
          let isChatCreated = false;
          if (!user) {
            return false;
          }

          if (user._id === member._id) {
            return false;
          }

          if (userChats) {
            isChatCreated = userChats?.some(
              (chat) =>
                chat.members &&
                (chat.members[0] === member._id ||
                  chat.members[1] === member._id)
            );
          }
          return !isChatCreated;
        })
      );
    };
    getUsers();
  }, [userChats]);

  const getUserChats = async () => {
    setIsUserChatLoading(true);
    if (!user) {
      return;
    }

    const response = await getRequest(`/chat/${user._id}`);
    if (response.error) {
      setUserChatsError(response);
      setIsUserChatLoading(false);
      return;
    }
    setUserChats(response);
    setUserChatsError(null);
    setIsUserChatLoading(false);
  };

  const createChat = useCallback(async (firstId, secondId) => {
    const resp = await postRequest(
      "/chat/",
      JSON.stringify({ firstId, secondId })
    );
    if (resp.error) {
      return console.error(resp.message);
    }
    setUserChats((prev) => [...prev, resp]);
  }, []);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const getMessages = async () => {
    setIsMessagesLoading(true);
    if (!currentChat) {
      return;
    }

    const response = await getRequest(`/messages/${currentChat?._id}`);
    if (response.error) {
      setMessagesError(response);
      setIsMessagesLoading(false);
      return;
    }
    setMessages(response);
    setMessagesError(null);
    setIsMessagesLoading(false);
  };

  useEffect(() => {
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    getUserChats();
  }, [user]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) {
        return;
      }
      const response = await postRequest(
        "/messages/",
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );
      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response);
      setTextMessage("");
      setMessages((prev) => [...prev, response]);
    },
    []
  );

  const markAllNotificationsAsRead = ()=>{
    const myNotifications = notifications.map(n => ({...n, isRead: true}))
    setNotificatons(myNotifications);
  };

  const markNotificationAsRead = useCallback((notification, userChats, user, notifications) => {
    // find chat to open;
    const desiredChat = userChats.find(chat => {
        const chatMembers = [user._id, notification.senderId];
        const isDesiredChat = chat?.members.every(member => {
            return chatMembers.includes(member);
        });
        return isDesiredChat
    });
    // mark notification as read;
    const mNotifications = notifications.map(n => ({
            ...n,
            isRead: n.senderId === notification.senderId ? true: false
        }
    ));
    updateCurrentChat(desiredChat);
    setNotificatons(mNotifications);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
