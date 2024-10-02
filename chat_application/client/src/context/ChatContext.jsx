import { createContext, useState, useCallback, useEffect } from "react";
import { getRequest, postRequest } from "../utils/services";

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

  useEffect(() => {
    const getUsers = async () => {
      const resp = await getRequest("/users");
      if (resp.error) {
        return;
      }

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
      setMessages(prev => [...prev, response]);
    },
    []
  );

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
