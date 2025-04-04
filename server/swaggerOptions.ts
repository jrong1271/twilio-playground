// server/swaggerOptions.ts
export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Twilio App API",
      version: "1.0.0",
      description: "API documentation for the Twilio React app backend",
    },
    servers: [
      {
        url: "http://localhost:5100", // your server base URL
      },
    ],
  },
  apis: ["./server.ts"], // Adjust based on where your routes are defined
};
