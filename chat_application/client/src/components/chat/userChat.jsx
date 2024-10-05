import { Stack } from "react-bootstrap";
import { useFetchReceipentUser } from "../../hooks/useFetchReceipent";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";

const UserChat = ({ chat, user }) => {
  const { receipentUser } = useFetchReceipentUser(chat, user);
  const {onlineUsers, notifications, markUserNotificationAsRead} = useContext(ChatContext);
  const isOnline = onlineUsers?.some((user) => user?.userId === receipentUser?._id);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter(
    n => n.senderId === receipentUser?._id
  )

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      onClick={() => {
        markUserNotificationAsRead(thisUserNotifications, notifications)
      }}
    >
        <div className="d-flex">
            <div className="me-2" style={{
                    height: "100%", 
                    border: "2px solid white",
                    padding: "5px",
                    borderRadius: "50%",
                    backgroundColor: "#BB2CD9",
                }}
            >
                <strong>{receipentUser?.name[0].toUpperCase()}</strong>
            </div>
            <div className="text-content">
                <div className="name">{receipentUser?.name}</div>
                <div className="text">Text Message</div>
            </div>
        </div>
        <div className="d-flex flex-column align-items-end">
            <div className="date">
                12/12/2024
            </div>
            <div className={thisUserNotifications?.length ? "this-user-notifications": ""}>{thisUserNotifications.length || ''}</div>
            <span className={isOnline? "user-online": ""}></span>
        </div>
    </Stack>
  );
};

export default UserChat;
