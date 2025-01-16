import { recipeFunction } from "@/data/openai";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { RunStatus } from "openai/resources/beta/threads/runs/runs.mjs";
import sharp from "sharp";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const text = formData.get("text");
    const image = formData.get("image");

    if (image instanceof File && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const processedImage = await sharp(buffer)
        .resize(768, 768, { fit: "inside" })
        .jpeg({ quality: 80 })
        .toBuffer();

      const base64Image = processedImage.toString("base64");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful cooking assistant. Analyze images and text to create recipes. Always respond with valid JSON objects matching the required schema.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  text?.toString() || "Analyze this image and create a recipe",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.7,
        response_format: { type: "json_object" },
        tools: [
          {
            type: "function" as const,
            function: recipeFunction,
          },
        ],
      });

      return NextResponse.json({ result: completion.choices[0].message });
    } else {
      // Text-only request using the existing assistant
      const thread = await openai.beta.threads.create();
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: text?.toString() + " (respond with json object)",
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID!,
        tools: [
          {
            type: "function" as const,
            function: recipeFunction,
          },
        ],
      });

      const response = await pollRunCompletion(thread.id, run.id);
      await openai.beta.threads.del(thread.id);
      return NextResponse.json({ result: response });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function pollRunCompletion(threadId: string, runId: string) {
  let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

  while (true) {
    switch (runStatus.status) {
      case "requires_action":
        const toolCalls =
          runStatus.required_action?.submit_tool_outputs.tool_calls;
        if (toolCalls) {
          const toolOutputs = toolCalls.map((toolCall) => ({
            tool_call_id: toolCall.id,
            output: JSON.stringify(toolCall.function),
          }));
          await openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
            tool_outputs: toolOutputs,
          });
        }
        break;
      case "completed":
        const messages = await openai.beta.threads.messages.list(threadId);
        return messages.data[0];
      case "failed":
      case "cancelled":
      case "expired":
        throw new Error(`Run failed with status: ${runStatus.status}`);
    }

    // Wait and check again for non-terminal states
    if ((runStatus.status as RunStatus) !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    }
  }
}

async function convertImageToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}
