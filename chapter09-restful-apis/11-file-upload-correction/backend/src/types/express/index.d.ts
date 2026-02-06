import type { File } from 'formidable';
declare global {
  namespace Express {
    export interface Request {
      file?: File;
    }
  }
}
