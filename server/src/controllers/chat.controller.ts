import { NextFunction, Request, Response } from 'express';
import AbstractController from './index.controller';
import openAiServcie from 'libs/openai.lib';
import { InternalServerError } from 'errors/internal-server-error';
import { validateRequestBody } from 'validators/validateRequest';
import { z } from 'zod';

class ChatController extends AbstractController {
  post() {
    return [
      validateRequestBody(z.object({ message: z.string(), userId: z.string() })),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { message, userId } = req.body as { message: string; userId: string };

          let conversation = await this.ctx.db.client.conversation.findFirst({
            where: { userId: userId },
          });

          if (!conversation) {
            conversation = await this.ctx.db.client.conversation.create({
              data: { userId, messages: '[]' },
            });
          }

          const messages = JSON.parse(conversation.messages);
          messages.push({ role: 'user', content: message });

          const response = await openAiServcie.botResponse(messages);
          messages.push(response);

          await this.ctx.db.client.conversation.update({
            where: { id: conversation.id },
            data: { messages: JSON.stringify(messages) },
          });

          res.json({ response: response.content });
        } catch (e) {
          console.error(e);
          next(new InternalServerError());
        }
      },
    ];
  }
}

export default ChatController;
