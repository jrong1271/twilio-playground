import { FastifyInstance } from "fastify";
import twilio from "twilio";
import dotenv from "dotenv";
import _ from "lodash";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(accountSid, authToken);
function maskPhone(phone: string): string {
  // Extract the part after the dash
  const parts = phone.split("-");
  const lastPart = _.last(parts); // e.g. "0256"
  return "***-***-" + lastPart;
}
export default async function (app: FastifyInstance) {
  app.post("/api/call", {
    schema: {
      summary: "Initiate a Twilio Call",
      description: "Makes a phone call to a specified number using Twilio.",
      tags: ["Call"],
      body: {
        type: "object",
        required: ["to"],
        properties: {
          to: { type: "string", description: "Phone number to call" },
        },
      },
      response: {
        200: {
          description: "Call initiated",
          type: "object",
          properties: {
            sid: { type: "string" },
            status: { type: "string" },
          },
        },
        400: {
          description: "Invalid request",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: async (req, reply) => {
      const { to } = req.body as { to: string };

      try {
        const call = await client.calls.create({
          to,
          from:
            process.env.TWILIO_PHONE_NUMBER ||
            (() => {
              throw new Error("TWILIO_PHONE_NUMBER is not defined");
            })(),
          twiml: "<Response><Say>Hello from Twilio</Say></Response>",
        });

        return { sid: call.sid, status: call.status };
      } catch (err) {
        const error = err as Error; // Type assertion
        reply.code(400).send({ error: error.message });
      }
    },
  });

  app.get("/api/history", {
    schema: {
      description: "Get recent Twilio call history",
      tags: ["Call History"],
      response: {
        200: {
          type: "object",
          description: "Grouped call history, keyed by date (YYYY-MM-DD)",
          additionalProperties: {
            type: "array",
            items: {
              type: "object",
              properties: {
                sid: {
                  type: "string",
                  description: "Unique identifier for the call",
                  example: "CA0e4bd060e090d4429a92fdabd64702fe",
                },
                fromFormatted: {
                  type: "string",
                  description: "The phone number formatted with masking",
                  example: "***-***-0256",
                },
                formattedTime: {
                  type: "string",
                  description: "The date and time when the call occurred",
                  example: "4/4/2025, 8:01:15 PM",
                },
                formattedPrice: {
                  type: "string",
                  description: "The cost of the call",
                  example: "0.014 USD",
                },
              },
              required: [
                "sid",
                "fromFormatted",
                "formattedTime",
                "formattedPrice",
              ],
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const calls = await client.calls.list({ limit: 20 });
      // Convert to local date string (e.g., "2024-04-06")
      const groupedCalls = calls.reduce(
        (acc, call) => {
          const [date, time] = new Date(call.startTime)
            .toLocaleString()
            .split(", ");

          if (!acc[date]) {
            acc[date] = [];
          }

          acc[date].push({
            sid: call.sid,
            fromFormatted: maskPhone(call.fromFormatted),
            formattedTime: time,
            formattedPrice:
              Math.abs(parseFloat(call.price)).toPrecision(2) +
              " " +
              call.priceUnit,
          }); // Add the call to the corresponding date group
          return acc;
        },
        {} as Record<string, any>
      );

      reply.send(groupedCalls);
    },
  });
}
