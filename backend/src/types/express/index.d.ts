export {}; // <-------- THIS IS CRUCIAL!!! Otherwise it does not work!
// https://blog.logrocket.com/extend-express-request-object-typescript/#extending-the-express-request-type-in-typescript

interface Language {
  name: string;
}

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      googleId: string;
      // email: string;
    }
    export interface Request {
      language?: Language;
      user: User;
    }
  }
}
