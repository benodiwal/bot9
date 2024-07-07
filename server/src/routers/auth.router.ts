import AuthController from 'controllers/auth.controller';
import AbstractRouter from './index.router';

class AuthRouter extends AbstractRouter {
  registerRoutes(): void {
    const authController = new AuthController(this.ctx);
    this.registerPOST('/google/callback', authController.postAuthGoogleCallback());
  }
}

export default AuthRouter;
