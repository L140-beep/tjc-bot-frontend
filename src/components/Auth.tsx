import { ChangeEvent, FormEvent, useState } from 'react';
import { Input } from './Input';
import { Title } from './Title';
import { useAuthContext } from './context/AuthContext';
import { getConfig } from '../config';
import { twMerge } from 'tailwind-merge';

export const Auth: React.FC = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [login, setLogin] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [isWaitingData, setIsWaitingData] = useState<boolean>(false);

  const clear = () => {
    setError(undefined);
    setLogin(undefined);
    setPassword(undefined);
    setIsWaitingData(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.target.reset();
    const { SERVER_HOST, SERVER_PORT } = getConfig();
    setIsWaitingData(true);
    const response = await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/token`, {
      mode: 'no-cors',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' },
      body: JSON.stringify({ password, username: login }),
    });
    console.log(JSON.stringify({ password, username: login }));
    console.log(response);
    // console.log(password);

    clear();
  };
  const onLoginChange = (value: string) => {
    setLogin(value);
  };
  const onPasswordChange = (value: string) => {
    setPassword(value);
  };
  return (
    <div className="flex h-[100vh] w-[100wh] place-content-center items-center bg-gray-700">
      <div className="mb-[5%] flex-col items-center text-center">
        <div className="mb-3">
          <Title />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <Input
            maxLength={20}
            onChange={(e) => onLoginChange(e.target.value)}
            placeholder="Логин"
            required={true}
            disabled={isWaitingData}
          />
          <Input
            maxLength={20}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Пароль"
            type={'password'}
            required={true}
            disabled={isWaitingData}
          />
          {}
          <button
            disabled={isWaitingData}
            className={twMerge(
              'h-8 w-full cursor-pointer rounded border-none bg-[#324ab2] text-gray-200',
              isWaitingData && 'opacity-50',
            )}
            type="submit"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};
