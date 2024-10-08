import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
    const {user} = useContext(AuthContext);
    const {potentialChats, createChat, onlineUsers} = useContext(ChatContext);

    return ( 
        <>
            <div className="all-users">
                {potentialChats?.map((potChat, idx) => (
                    <div className="single-user" key={idx} onClick={() => createChat(user._id, potChat._id)}>
                        {potChat.name}
                        <span className={
                            onlineUsers?.some(user=> user?.userId === potChat?._id) ? "user-online": ""
                        }></span>
                    </div>
                ))}
            </div>
        </>
     );
}
 
export default PotentialChats;