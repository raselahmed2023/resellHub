import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

export const auth = betterAuth({
  database: mongodbAdapter(
    (await clientPromise).db("resellHub")
  ),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "buyer" },
      location: { type: "string", required: false },
      phone: { type: "string", required: false },
    },
  },
});