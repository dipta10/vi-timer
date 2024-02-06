import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSessionStore } from '../states/store';
import axios from '@/utils/config';

export function Layout() {
  // TODO: bring in the header in this outlet!
  const { clearSession } = useSessionStore();

  useEffect(() => {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
    } else {
      Notification.requestPermission();
    }

    const audio = new Audio('./iphone_sound.mp3');
    audio.addEventListener('canplaythrough', () => {
      console.log('notification sound can be played');
    });

    const interval = setInterval(() => {
      new Notification(`VI Timer (${new Date().toLocaleString()})`, {
        body: `Hey! Are you tracking time?`,
        icon: 'https://www.vkf-renzel.com/out/pictures/generated/product/1/356_356_75/r12044336-01/general-warning-sign-10836-1.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        dir: 'ltr',
        requireInteraction: true,
        data: 'hello',
      });

      audio.volume = 0.1;
      audio
        .play()
        .then((e) => {
          console.log('notification should has been played', e);
        })
        .catch((e) => {
          console.error('unable to play notification sound', e);
        });
    }, 1000 * 60 * 10); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios
      .get('user')
      .then(({ data }) => {
        console.log('user is', data);
      })
      .catch((err) => {
        console.log('error getting user info', err);
        clearSession();
      });
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
