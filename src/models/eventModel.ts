import { Schema, model, PaginateModel } from "mongoose";
import { IEvent } from "../types/eventType";
import paginate from "mongoose-paginate-v2";

// Schema for the event document
const eventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true },
    eventType: {
      type: String,
      required: true,
      enum: ["priced event", "free event"],
      default: "free event",
    },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    eventAccessType: {
      type: String,
      required: true,
      enum: ["open", "invite only"],
      default: "open",
    },
    eventPrice: { type: Number, required: true },
    location: { type: String, required: true },
    endTime: { type: String, required: true },
    eventCategory: {
      type: String,
      required: true,
      enum: ["new year party", "open mic", "meeting"],
      default: "new year party",
    },
    eventFormat: {
      type: String,
      required: true,
      enum: ["gala", "conference", "format"],
      default: "gala",
    },
    eventDescription: { type: String, required: true },
    eventHashtags: { type: [String], required: true },
    mediaUpload: {
      type: { type: String, enum: ["image", "video"], default: "image" },
      url: { type: String },
    },
    inviteesEmail: [{ type: String }],
    inviteesPhoneNumber: [{ type: String }],
    eventChecklist: { type: Schema.Types.Mixed },
    commodityName: { type: String },
    amountAllotted: { type: Number },
    budgetDescription: { type: String },
    paymentMethod: { type: [String], required: true },
    isIVCardPresent: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

eventSchema.plugin(paginate);

// interface EventDocument extends Document, IEventData {}

export const EventModel = model<IEvent, PaginateModel<IEvent>>(
  "Event",
  eventSchema,
  "events",
);
