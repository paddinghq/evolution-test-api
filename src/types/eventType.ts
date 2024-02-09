import { Document, Types } from "mongoose";

// Interface for each checklist item
export interface IChecklistItem {
    label: string,
    isChecked: boolean,
}


// Interface for the overall event checklist
export interface IEventChecklist {
    [header: string]: IChecklistItem,
}

// Interface for the event document
export interface IEvent extends Document {
    eventName: string,
    eventType: string,
    eventDate: Date,
    startTime: string,
    eventAccessType: string,
    eventPrice: number,
    location: string,
    endTime: string,
    eventCategory: string,
    eventFormat: string,
    eventDescription: string,
    eventHashtags: string[],
    mediaUpload: {
        type: "image" | "video",
        url: String,
    },
    inviteesEmail: string[],
    inviteesPhoneNumber: string[],
    eventChecklist: IEventChecklist,
    commodityName: string,
    amountAllotted: number,
    budgetDescription: string,
    paymentMethod: string[],
    isIVCardPresent: boolean,
    createdBy: Types.ObjectId
}