export type ConfigAppProviderType = {
  database: {
    connection: string;
    username: string;
    password: string;
    authSource: string;
  };
  jwt: {
    secretKey: string;
    expires: number;
  };
  node_env: 'production' | 'development';
  origin: RegExp;
  port: number;
  rabbitmq: {
    endpoint: string;
    username: string;
    password: string;
  };
};
