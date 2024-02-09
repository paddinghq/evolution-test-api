import { model, Schema } from "mongoose";
import { type IFavourite } from "../types/types";

const favouritesSchema = new Schema<IFavourite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true }
);

export const FavouriteModel = model<IFavourite>("Favourite", favouritesSchema);
