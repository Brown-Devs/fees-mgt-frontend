import React, { useEffect, useState } from "react";
import api from "../apis/axios";
import { connectSocket, getSocket, disconnectSocket } from "../apis/socket";

export default function NotificationDropdown({ currentUser }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const load = async () => {
        const res = await api.get("/notifications", { params: { page: 1, limit: 10 } });
        const list = res.data.data || [];
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.read).length);
    };

    useEffect(() => {
        load();
        if (currentUser) {
            connectSocket(currentUser._id);
            const socket = getSocket();
            if (socket) {
                socket.on("notification:new", (n) => {
                    setNotifications(prev => [n, ...prev]);
                    setUnreadCount(c => c + 1);
                });
            }
        }
        return () => {
            const socket = getSocket();
            if (socket) socket.off("notification:new");
            disconnectSocket();
        };
    }, [currentUser]);

    const markAllRead = async () => {
        await api.post("/notifications/mark-read");
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    return (
        <div>
            <button>
                🔔
                {unreadCount > 0 && <span>{unreadCount}</span>}
            </button>

            <div>
                <div>
                    <strong>Notifications</strong>
                    <button onClick={markAllRead}>Mark all read</button>
                </div>
                <div>
                    {notifications.length === 0 ? <div>No notifications</div> :
                        notifications.map(n => (
                            <div key={n._id} style={{ background: n.read ? "transparent" : "#eef" }}>
                                <div>{n.message}</div>
                                <div style={{ fontSize: 12 }}>{new Date(n.createdAt).toLocaleString()}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
