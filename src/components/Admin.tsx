import { useNavigate } from 'react-router';
import { ButtonsList } from './ButtonsList';
import { useAuthContext } from './context/AuthContext';
import { Title } from './Title';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { saveFile } from './utils';
('file-saver');

export const Admin: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [user] = useAuthContext();
  const navigate = useNavigate();
  const [blocked, setBlocked] = useState<boolean | null>(null);

  const handleScore = async () => {
    const response = await fetch(`api/rate`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Access-Control-Allow-Origin': '*',
        accept: 'application/json',
      },
    });

    const blob = await response.blob();
    setMessage('Сохранено!');
    saveFile(blob, 'баллы.xlsx');
  };

  useEffect(() => {
    fetch(`api/isBlocked`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Access-Control-Allow-Origin': '*',
        accept: 'application/json',
      },
    }).then((response) => response.json().then((value) => setBlocked(Boolean(value['isBlocked']))));
    return;
  }, []);

  useEffect(() => {
    setInterval(async () => {
      fetch(`api/isBlocked`, {
        mode: 'cors',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Access-Control-Allow-Origin': '*',
          accept: 'application/json',
        },
      }).then((response) =>
        response.json().then((value) => {
          // console.log(value, value['isBlocked'] === 'False');
          setBlocked(value['isBlocked'] !== 'False');
        }),
      );
    }, 5000);
  }, []);

  const handleBlock = async () => {
    const response = await fetch(`api/switch`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Access-Control-Allow-Origin': '*',
        accept: 'application/json',
      },
    });

    setMessage((await response.json())['text']);
    setBlocked((p) => !p);
  };

  const handleDownloadResult = async () => {
    const response = await fetch(`api/results`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Access-Control-Allow-Origin': '*',
        accept: 'application/json',
      },
    });

    const blob = await response.blob();
    setMessage('Сохранено!');
    saveFile(blob, 'баллы.xlsx');
  };

  const handleDownloadTeamBonus = async () => {
    const response = await fetch(`api/teamBonus`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Access-Control-Allow-Origin': '*',
        accept: 'application/json',
      },
    });

    const blob = await response.blob();
    setMessage('Сохранено!');
    saveFile(blob, 'бонусы команд.xlsx');
  };

  const buttons = [
    {
      text: 'Скачать рейтинг',
      action: handleScore,
    },
    {
      text:
        blocked === null
          ? 'Разрешить/запретить отправку попыток'
          : blocked
            ? 'Разрешить отправку попыток'
            : 'Запретить отправку попыток',
      action: handleBlock,
    },
    {
      text: 'Скачать результаты',
      action: handleDownloadResult,
    },
    {
      text: 'Скачать бонусы команд',
      action: handleDownloadTeamBonus,
    },
  ];

  const logout = () => {
    sessionStorage.clear();
    navigate('/auth');
  };

  return (
    <div className="flex h-[100vh] w-[100wh] flex-col place-content-center items-center gap-2 bg-gray-700">
      <div>
        <button
          className="absolute top-3 right-7 h-8 w-24 cursor-pointer rounded border border-none bg-[#324ab2] text-gray-200"
          onClick={logout}
        >
          Выйти
        </button>
        <div className="text-center">
          <Title />
        </div>
        <div
          className={twMerge(
            'h-32 w-full rounded border border-gray-400 px-2 py-1 text-left text-gray-200',
            message === null && 'text-gray-500',
          )}
        >
          {message === null ? 'Ответ от сервера...' : message}
        </div>
        <div className="mt-2">
          <ButtonsList buttonClassName="p-2 h-auto" buttons={buttons} />
        </div>
      </div>
    </div>
  );
};
