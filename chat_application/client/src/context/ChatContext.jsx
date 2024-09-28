import { createContext, useState, useCallback, useEffect } from "react";
import { getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext({});

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatLoading, setIsUserChatLoading] = useState(null);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);

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
                chat.members && (chat.members[0] === member._id || chat.members[1] === member._id)
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
    const resp = await postRequest("/chat/", JSON.stringify({ firstId, secondId }));
    if (resp.error) {
      return console.error(resp.message);
    }
    setUserChats((prev) => [...prev, resp]);
  }, []);

  useEffect(() => {
    getUserChats();
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatLoading,
        userChatsError,
        potentialChats,
        createChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
