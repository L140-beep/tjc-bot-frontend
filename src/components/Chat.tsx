import { useEffect, useLayoutEffect, useState } from 'react';
import { Input } from './Input';
import { Title } from './Title';
import { twMerge } from 'tailwind-merge';
import { ButtonsList } from './ButtonsList';
import { useAuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router';

export const Chat: React.FC = () => {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [isWaitingData, setIsWaitingData] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(true);
  const [user] = useAuthContext();
  const navigate = useNavigate();
  const onMessageChange = (value: string) => {
    setMessage(value);
  };
  const [responseText, setResponseText] = useState<string[] | null>(null);

  useLayoutEffect(() => {
    fetch(`api/isBlocked`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Access-Control-Allow-Origin': '*',
        accept: 'application/json',
      },
    }).then((response) =>
      response.json().then((value) => setIsBlocked(value['isBlocked'] !== 'False')),
    );
  });

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
          setIsBlocked(value['isBlocked'] !== 'False');
        }),
      );
    }, 5000);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(`Отправлено сообщение ${message}!`);
    setIsWaitingData(true);
    const response = await fetch(`api/attempt`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Access-Control-Allow-Origin': '*',
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' },
      body: JSON.stringify({ msg: message }, null, 4),
    });
    const jsonResponse = await response.json();
    // const a = await response.text();
    // console.log(JSON.parse(a));
    // setResponseText(`${await response.text()}`);
    setIsWaitingData(false);
    if (!response.ok) {
      setResponseText(
        jsonResponse['error']
          ? [jsonResponse['error'], jsonResponse['text']]
          : ['Ошибка входных данных!'],
      );
      return;
    }
    setResponseText([jsonResponse['text']]);
  };

  const handleStatus = async () => {
    console.log(user.token);
    const response = await fetch(`api/status`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Access-Control-Allow-Origin': '*',
        accept: 'application/json',
      },
    });
    setResponseText([(await response.json())['text']]);
  };

  const buttons = [
    {
      text: 'Статус',
      action: handleStatus,
    },
  ];

  const logout = () => {
    sessionStorage.clear();
    navigate('/auth');
  };

  return (
    <div className="flex h-[100vh] w-[100wh] flex-row place-content-center items-center gap-2 bg-gray-700">
      <button
        className="absolute top-3 right-7 h-8 w-24 cursor-pointer rounded border border-none bg-[#324ab2] text-gray-200"
        onClick={logout}
      >
        Выйти
      </button>
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
              'h-72 w-72 rounded border border-gray-400 px-2 py-1 text-left text-gray-200',
              responseText === null && 'text-gray-500',
            )}
          >
            {responseText === null
              ? isBlocked
                ? 'Отправка сообщений запрещена'
                : 'Отправка сообщений разрешена'
              : responseText.map((value) => {
                  return (
                    <p>
                      {value} <br></br> <br />
                    </p>
                  );
                })}
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
              'text h-8 w-full cursor-pointer rounded border-none bg-[#324ab2] break-all text-gray-200',
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
