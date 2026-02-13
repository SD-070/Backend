import type { Types } from 'mongoose';
import type { Post } from '#models';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roles: string[];
      };
      post?: InstanceType<typeof Post>;
    }
  }
}
