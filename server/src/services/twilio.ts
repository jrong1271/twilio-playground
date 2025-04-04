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
          type: "array",
          items: {
            type: "object",
            properties: {
              sid: { type: "string" },
              toFormatted: { type: "string" },
              formattedTime: { type: "string" },
              formattedPrice: { type: "string" },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const calls = await client.calls.list({ limit: 10 });
      const updatedList = calls.map((call) => {
        return {
          sid: call.sid,
          toFormatted: maskPhone(call.toFormatted),
          formattedTime: new Date(call.startTime).toLocaleString(),
          formattedPrice:
            Math.abs(parseFloat(call.price)).toPrecision(2) +
            " " +
            call.priceUnit,
        };
      });
      reply.send(updatedList);
    },
  });

  // app.get("/", async (_, reply) => {
  //   reply.send({ msg: "hello" });
  // });
}
