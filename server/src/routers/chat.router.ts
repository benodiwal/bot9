import ChatController from 'controllers/chat.controller';
import AbstractRouter from './index.router';

class ChatRouter extends AbstractRouter {
  registerRoutes(): void {
    const chatController = new ChatController(this.ctx);
    this.registerPOST('/', chatController.post());
  }
}

export default ChatRouter;
