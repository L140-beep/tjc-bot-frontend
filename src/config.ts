export const getConfig = () => {
  return {
    SERVER_HOST: 'localhost',
    SERVER_PORT: '8000',
  };
};

export const getApiBaseUrl = (): string => {
  const { SERVER_HOST, SERVER_PORT } = getConfig();
  return `http://${SERVER_HOST}:${SERVER_PORT}`;
};

export const getApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};
