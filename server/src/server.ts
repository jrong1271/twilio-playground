import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

import dotenv from "dotenv";
import twilioRoutes from "./services/twilio";

dotenv.config();
const app = Fastify();

app.register(swagger, {
  openapi: {
    info: {
      title: "Twilio Playground API",
      version: "1.0.0",
      description: "API docs for my app",
    },
  },
});

app.register(swaggerUI, {
  routePrefix: "/api", // Swagger UI will be served here
});
app.register(twilioRoutes);

async function start() {
  app.listen({ port: 5100 }, () => {
    console.log("Server running on http://localhost:5100");
  });
}
start();
