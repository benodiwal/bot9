import getEnvVar from 'env/index';
import OpenAI from 'openai';
import Hotel from 'services/hotel.service';
import { parseEnv } from 'env/index';

class OpenAIService {
  #client: OpenAI;

  constructor() {
    parseEnv();
    this.#client = new OpenAI({
      apiKey: getEnvVar('OPENAI_API_KEY'),
    });
  }

  async botResponse(messages: any): Promise<any> {
    const initialMessages = [
      {
        role: 'system',
        content: 'you are a helpful assistant',
      },
      {
        role: 'system',
        content: 'your job is to help the user find the perfect room for them and make a booking',
      },
      {
        role: 'system',
        content: 'if the user is going off topic you should say that you don"t know about it and prompt them to make a booking, always prompt the user for their full name, email address and the amount of nights when booking a room, do not proceed to call the function without it',
      },
      {
        role: 'system',
        content: 'you should understand the tone of the user and talk in the same tone'
      }
    ];

    initialMessages.forEach((msg) => {
      if (!messages.some((m: any) => m.role === 'system' && m.content === msg.content)) {
        messages.unshift(msg);
      }
    });

    const completion = await this.#client.chat.completions.create({
      model: 'gpt-3.5-turbo-0613',
      messages: messages,
      tools: [
        {
          type: 'function',
          function: {
            name: 'get_room_options',
            description: 'Get available room options from the hotel',
            parameters: {
              type: 'object',
              properties: {},
              required: [],
            },
          },
        },
        {
          type: 'function',
          function: {
            name: 'book_room',
            description: 'Book a room at the hotel',
            parameters: {
              type: 'object',
              properties: {
                roomId: { type: 'integer' },
                fullName: { type: 'string' },
                email: { type: 'string' },
                nights: { type: 'integer' },
              },
              required: ['roomId', 'fullName', 'email', 'nights'],
            },
          },
        },
      ],
      tool_choice: 'auto',
    });

    const message = completion.choices[0].message;

    if (message.tool_calls) {
      for (const tool_call of message.tool_calls) {
        const functionName = tool_call.function.name;
        const functionArgs = JSON.parse(tool_call.function.arguments);

        let functionResult;
        if (functionName === 'get_room_options') {
          functionResult = await Hotel.getRoomOptions();
        } else if (functionName === 'book_room') {
          functionResult = await Hotel.bookRoom(functionArgs.roomId, functionArgs.fullName, functionArgs.email, functionArgs.nights);
        }

        messages.push(message);
        messages.push({
          role: 'tool',
          tool_call_id: tool_call.id,
          name: functionName,
          content: JSON.stringify(functionResult),
        });
      }

      return this.botResponse(messages);
    }

    return message;
  }
}

const openAiServcie = new OpenAIService();
export default openAiServcie;
