import { OAuth2Client } from 'google-auth-library';

interface IPayload {
  sub?: string; // GoogleId
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

export default class GoogleLoginService {
  public async execute(token: string): Promise<IPayload | undefined> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload: IPayload | undefined = ticket.getPayload();

    return payload;
  }
}
