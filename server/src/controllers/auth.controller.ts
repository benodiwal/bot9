import { Request, Response, NextFunction } from 'express';
import AbstractController from './index.controller';
import { InternalServerError } from 'errors/internal-server-error';
import { validateRequestBody } from 'zod-express-middleware';
import { z } from 'zod';

class AuthController extends AbstractController {
  postAuthGoogleCallback() {
    return [
      validateRequestBody(z.object({ code: z.string().min(10) })),
      async (_req: Request, _res: Response, next: NextFunction) => {
        try {
          // const { code } = req.body as unknown as { code: string };
          // const payload = await googleOAuthClient.getTokenAndVerifyFromCode(code);
          // let exists = true;
          // const data = {
          //     existingUser: await this.ctx.db.client.user.findFirst({
          //       where: {
          //         sub: payload.sub,
          //       },
          //     }),
          // };
          // if (data.existingUser === null) {
          //     exists = false;
          //     const transaction = new Transaction(this.ctx);
          //     await transaction.execute(async (ctx) => {
          //       data.existingUser = await ctx.db.client.user.create({
          //         data: {
          //           email: payload.email as string,
          //           name: payload.given_name as string,
          //           sub: payload.sub,
          //           avatar_url: payload.picture as string,
          //         },
          //       });
          //     });
          //   }
          //   req.session.currentUserId = data?.existingUser?.id;
          // return res.sendStatus(exists ? 200 : 201);
        } catch (e) {
          console.error(e);
          next(new InternalServerError());
        }
      },
    ];
  }
}

export default AuthController;
