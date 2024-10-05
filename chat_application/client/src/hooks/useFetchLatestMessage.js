import { useState, useEffect, useContext } from "react";
import { getRequest } from "../utils/services";
import { ChatContext } from "../context/ChatContext";

export const useFetchLatestMessage = (chat) => {
    const {newMessage, notifications} = useContext(ChatContext);
    const [latestMessage, setLastestMessage] = useState(null);

    const getLastMessage = async () => {
        const response = await getRequest(`/messages/${chat._id}`);
        if (response.error){
            return console.log("Error getting message...", response);
        }
        const lastMessage = response[response?.length -1];
        setLastestMessage(lastMessage);
    };

    useEffect(() => {
        getLastMessage();
    }, [notifications, newMessage]);

    return { latestMessage };
}