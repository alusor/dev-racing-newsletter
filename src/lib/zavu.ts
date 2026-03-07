import Zavu from "@zavudev/sdk";

export const zavu = new Zavu({ apiKey: process.env.ZAVU_API_KEY! });

export const zavuSendOptions = {
  headers: { "Zavu-Sender": process.env.ZAVU_SENDER_ID || "" },
};
