import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  newsletterId: mongoose.Types.ObjectId;
  frequency: "daily" | "weekly";
  subscribedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: { type: String, required: true },
  newsletterId: {
    type: Schema.Types.ObjectId,
    ref: "Newsletter",
    required: true,
  },
  frequency: { type: String, enum: ["daily", "weekly"], required: true },
  subscribedAt: { type: Date, default: Date.now },
});

SubscriberSchema.index({ email: 1, newsletterId: 1 }, { unique: true });

export const Subscriber: Model<ISubscriber> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);
