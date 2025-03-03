import { useContext, useLayoutEffect, useState } from 'react';
import { Input } from './Input';
import { Title } from './Title';
import { twMerge } from 'tailwind-merge';
import { ButtonsList } from './ButtonsList';
import { getConfig } from '../config';
import { AuthContext, useAuthContext } from './context/AuthContext';

export const Chat: React.FC = () => {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [isWaitingData, setIsWaitingData] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(true);
  const [user] = useAuthContext();
  const { SERVER_HOST, SERVER_PORT } = getConfig();
  const onMessageChange = (value: string) => {
    setMessage(value);
  };
  const [responseText, setResponseText] = useState<string | null>(null);

  useLayoutEffect(() => {
    fetch(`http://${SERVER_HOST}:${SERVER_PORT}/isBlocked`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Access-Control-Allow-Origin': '*',
        accept: 'application/json',
      },
    }).then((response) =>
      response.json().then((value) => setIsBlocked(Boolean(value['isBlocked']))),
    );
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(`Отправлено сообщение ${message}!`);
    setIsWaitingData(true);
    const response = await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/attempt`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Access-Control-Allow-Origin': '*',
        accept: 'application/json',
      },
      // headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' },
      body: JSON.stringify({ msg: message }),
    });
    console.log(await response.json());
    setIsWaitingData(false);
    if (!response.ok) {
      setResponseText('Ошибка входных данных!');
      return;
    }
    setResponseText(`${await response.text()}`);
  };

  const handleStatus = async () => {
    console.log(user.token);
    const response = await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/status`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Access-Control-Allow-Origin': '*',
        accept: 'application/json',
      },
    });
    console.log(await response.json());
    console.log(typeof (await response.json())['text']);
    setResponseText((await response.json())['text']);
  };

  const buttons = [
    {
      text: 'Статус',
      action: handleStatus,
    },
  ];

  return (
    <div className="flex h-[100vh] w-[100wh] flex-row place-content-center items-center gap-2 bg-gray-700">
      <div>
        <ButtonsList buttons={buttons} />
      </div>
      <div className="mb-[5%] flex-col items-center text-center">
        <div className="mb-3">
          <Title />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <div
            className={twMerge(
              'h-72 w-full rounded border border-gray-400 px-2 py-1 text-left text-gray-200',
              responseText === null && 'text-gray-500',
            )}
          >
            {responseText === null
              ? isBlocked
                ? 'Отправка сообщений запрещена'
                : 'Отправка сообщений разрешена'
              : responseText}
          </div>
          <Input
            maxLength={200}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Дорогой сервер, вот мой ответ..."
            required={true}
            disabled={isWaitingData}
            type="text"
          />
          <button
            disabled={isWaitingData || isBlocked}
            className={twMerge(
              'text h-8 w-full cursor-pointer break-after-all rounded border-none bg-[#324ab2] text-gray-200',
              (isWaitingData || isBlocked) && 'cursor-default opacity-50',
            )}
            type="submit"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};
