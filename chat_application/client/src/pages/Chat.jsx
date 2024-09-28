import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/userChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/potentialChat";

const Chat = () => {
  const { userChats, isUserChatLoading, userChatsError } =
    useContext(ChatContext);
  const { user } = useContext(AuthContext);
  return (
    <Container className="pt-3">
      <PotentialChats />
      {userChats.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatLoading && <p>Loading Chats...</p>}
            {userChats.map((chat, idx) => (
              <div className="" key={idx}>
                <UserChat chat={chat} user={user} />
              </div>
            ))}
          </Stack>
          <p>Chatbox</p>
        </Stack>
      )}
    </Container>
  );
};

export default Chat;
