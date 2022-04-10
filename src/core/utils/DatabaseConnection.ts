import mongoose from 'mongoose';

const uri = String(process.env.MONGODB_URI || 'mongodb://localhost/ihead-api');

const init = async (): Promise<void> => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default {
  init,
};
