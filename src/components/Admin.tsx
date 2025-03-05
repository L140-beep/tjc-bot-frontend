import { useNavigate } from 'react-router';
import { ButtonsList } from './ButtonsList';
import { useAuthContext } from './context/AuthContext';
import { Title } from './Title';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
('file-saver');

export const Admin: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [user] = useAuthContext();
  const navigate = useNavigate();
  const [blocked, setBlocked] = useState<boolean | null>(null);

  const saveFile = (blob: Blob, name: string) => {
    const blobURL = URL.createObjectURL(blob);
    // Сделать невидимый HTML-элемент `<a download>`
    // и включить его в документ
    const a = document.createElement('a');
    a.href = blobURL;
    a.download = name;
    a.style.display = 'none';
    document.body.append(a);
    // Программно кликнуть по ссылке.
    a.click();
    // Уничтожить большой blob URL
    // и удалить ссылку из документа
    // после клика по ней
    setTimeout(() => {
      URL.revokeObjectURL(blobURL);
      a.remove();
    }, 1000);
  };

  const handleScore = async () => {
    const response = await fetch(`/rate`, {
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
  ];

  const logout = () => {
    sessionStorage.clear();
    navigate('/auth');
  };

  return (
    <div className="flex h-[100vh] w-[100wh] flex-col place-content-center items-center gap-2 bg-gray-700">
      <button
        className="absolute top-3 right-7 h-8 w-24 cursor-pointer rounded border border-none bg-[#324ab2] text-gray-200"
        onClick={logout}
      >
        Выйти
      </button>
      <Title />
      <div
        className={twMerge(
          'h-32 w-74 rounded border border-gray-400 px-2 py-1 text-left text-gray-200',
          message === null && 'text-gray-500',
        )}
      >
        {message === null ? 'Ответ от сервера...' : message}
      </div>
      <ButtonsList buttonClassName="w-74 py-2 h-auto" buttons={buttons} />
    </div>
  );
};
