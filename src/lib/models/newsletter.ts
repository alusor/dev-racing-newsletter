import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEdition {
  subject: string;
  htmlContent: string;
  sections: { title: string; content: string }[];
  generatedAt: Date;
}

export interface INewsletter extends Document {
  title: string;
  description: string;
  topic: string;
  frequency: "daily" | "weekly";
  style: string;
  subscriberCount: number;
  coverImageUrl: string;
  previews: IEdition[];
  createdAt: Date;
}

const EditionSchema = new Schema<IEdition>({
  subject: { type: String, required: true },
  htmlContent: { type: String, required: true },
  sections: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
    },
  ],
  generatedAt: { type: Date, default: Date.now },
});

const NewsletterSchema = new Schema<INewsletter>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    topic: { type: String, required: true },
    frequency: { type: String, enum: ["daily", "weekly"], required: true },
    style: { type: String, required: true },
    subscriberCount: { type: Number, default: 0 },
    coverImageUrl: { type: String, default: "" },
    previews: [EditionSchema],
  },
  { timestamps: true }
);

export const Newsletter: Model<INewsletter> =
  mongoose.models.Newsletter ||
  mongoose.model<INewsletter>("Newsletter", NewsletterSchema);
