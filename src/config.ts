const REACT_URL = process.env.REACT_URL ?? 'http://localhost:5173';
const PORT = process.env.PORT ?? 8080;
const NB_SALT_ROUNDS = process.env.NB_SALT_ROUNDS ?? 8;

export { NB_SALT_ROUNDS, PORT, REACT_URL };
