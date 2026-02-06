declare global {
  namespace Express {
    export interface Request {
      image?: unknown;
    }
  }
}
export {};
