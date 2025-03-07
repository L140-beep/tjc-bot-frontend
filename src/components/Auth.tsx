import { useState } from 'react';
import { Input } from './Input';
import { Title } from './Title';
import { useAuthContext } from './context/AuthContext';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router';
import { getConfig } from '../config';

export const Auth: React.FC = () => {
  const context = useAuthContext();
  const navigate = useNavigate();
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
    if (!context) {
      throw new Error('Ошибка! Отсутствует контекст!');
    }
    e.preventDefault();
    e.target.reset();

    if (!password || !login) return;

    const [, serCurrentUser] = context;

    setIsWaitingData(true);

    const formData = new FormData();

    formData.append('password', password);
    formData.append('username', login);
    try {
      const { SERVER_HOST, SERVER_PORT } = getConfig();
      const response = await fetch(`http://${SERVER_HOST}:${SERVER_PORT}/api/token`, {
        mode: 'cors',
        method: 'POST',
        headers: { 'Access-Control-Allow-Origin': '*', accept: 'application/json' },
        body: formData,
      });
      if (!response.ok) {
        setIsWaitingData(false);
        return;
      }
      const jsonResponse = await response.json();
      const token = jsonResponse['access_token'];

      const isAdmin = jsonResponse['is_admin'];
      serCurrentUser({
        token: token,
        isAdmin: isAdmin,
      });

      sessionStorage.clear();
      if (response.ok) {
        sessionStorage.setItem('isAdmin', isAdmin);
        sessionStorage.setItem('token', token);
        navigate('/');
      }
    } finally {
      clear();
      setError('Неверный логин или пароль!');
    }
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
          {error && <span className="text-red-500"> {error} </span>}
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
