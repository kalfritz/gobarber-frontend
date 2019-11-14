import React, { useState, useEffect, useMemo } from 'react';
import { MdNotifications } from 'react-icons/md';
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import {
  Container,
  Badge,
  NotificationList,
  Scroll,
  Notification,
} from './styles';

export default function Notifications() {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const hasUnread = useMemo(() => {
    return notifications.some(notification => notification.read === false);
  }, [notifications]);

  useEffect(() => {
    async function loadNotifications() {
      const response = await api.get('notifications');

      const data = response.data.map(notification => ({
        ...notification,
        timeDistance: formatDistance(
          parseISO(notification.createdAt),
          new Date(),
          { addSuffix: true, locale: pt },
        ),
      }));
      setNotifications(data);
    }
    loadNotifications();
  }, []);

  const handleMarkAsRead = async id => {
    await api.put(`notifications/${id}`);
    setNotifications(
      notifications.map(notification =>
        notification._id === id
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <Container>
      <Badge hasUnread={hasUnread} onClick={() => setVisible(!visible)}>
        <MdNotifications size={20} color='#7159c1' />
      </Badge>
      <NotificationList visible={visible}>
        <Scroll>
          {notifications.map(notif => (
            <Notification key={notif._id} unread={!notif.read}>
              <p>{notif.content}</p>
              <time>{notif.timeDistance}</time>
              {!notif.read && (
                <button
                  type='button'
                  onClick={() => handleMarkAsRead(notif._id)}
                >
                  Marcar como lida
                </button>
              )}
            </Notification>
          ))}
        </Scroll>
      </NotificationList>
    </Container>
  );
}
