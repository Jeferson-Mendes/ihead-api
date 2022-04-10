export default {
  jwt: {
    secret: process.env.APP_SECRET || 'secret_ihead-api',
    expiresIn: '1d',
  },
};
