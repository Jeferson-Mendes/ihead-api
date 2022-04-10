import { Secret, verify } from 'jsonwebtoken';
import { AppError } from '@core/errors/AppError';
import authConfig from '@core/config/auth';

export function Auth(
  target: unknown,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor,
): void {
  const method = propertyDescriptor.value;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propertyDescriptor.value = function (...args: any[]) {
    const authHeader = args[0].headers.authorization;

    if (!authHeader) {
      throw new AppError('JWT Token is missing.', 401);
    }
    // Bearer sdlkfjsldkfjlsjfffdklfjdflksjflkjfdlk3405905
    const [, token] = authHeader.split(' ');

    try {
      const decodedToken = verify(token, authConfig.jwt.secret as Secret);

      // const { sub } = decodedToken as ITokenPayload;
      args[0].user = decodedToken;
    } catch {
      throw new AppError('Invalid JWT Token.');
    }
    return method.apply(this, args);
  };
}
