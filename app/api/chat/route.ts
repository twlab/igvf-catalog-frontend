import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse, experimental_StreamData } from 'ai';
import { igvfApiFunctions, igvfApiFunctionsMapped } from './functions';
import { ChatStreamData } from '@/app/chat/chatTypes';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

const model = 'gpt-4-1106-preview';

export async function POST(req: Request) {
    const { messages } = await req.json() as { messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] };
    const functionCompletion = await openai.chat.completions.create({
        model,
        messages,
        stream: true,
        functions: igvfApiFunctionsMapped,
    });

    const streamData = new experimental_StreamData();

    const stream = OpenAIStream(functionCompletion, {
        experimental_onFunctionCall: async (
            { name, arguments: args },
            createFunctionCallMessages,
        ) => {
            const apiFunction = igvfApiFunctions.find(f => f.name === name);
            if (apiFunction) {
                const data = await apiFunction.function(args);

                streamData.append({
                    type: "function_result",
                    about: apiFunction.actionDescription,
                    data,
                } as ChatStreamData);

                const newMessages = createFunctionCallMessages(data);
                return openai.chat.completions.create({
                    messages: [...messages, ...newMessages as any],
                    stream: true,
                    model,
                    functions: igvfApiFunctionsMapped,
                });
            }
        },
        onFinal: () => {
            streamData.close();
        },
        experimental_streamData: true,
    });

    return new StreamingTextResponse(stream, {}, streamData);
}
