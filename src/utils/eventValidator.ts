import { IEvent } from "../types/eventType";
import { IError } from "./validator";

export async function validateEvent(payload: IEvent): Promise<IError[]> {
    const errors: IError[] = [];

    if (payload == null || JSON.stringify(payload) === "{}") {
        errors.push({
            field: "payload",
            message: "Payload is required",
        });
        return errors;
    }

    let {
        eventChecklist,
        commodityName,
        amountAllotted,
        budgetDescription,
        isIVCardPresent,
        mediaUpload,
        inviteesEmail,
        inviteesPhoneNumber,
        ...otherDetails
    } = payload as Record<string, any>; // Type assertion to overcome TypeScript error

    // Validate the required fields
    for (let field in otherDetails) {
        if (
            !otherDetails.hasOwnProperty(field) ||
            !otherDetails[field]?.toString()
        ) {
            errors.push({
                message: `${field[0].toUpperCase()}${field.slice(1)} is required`,
                field: `${field}`,
            });
        }
    }

    // Validate event name field
    if (!otherDetails.eventName || otherDetails.eventName.length < 3) {
        errors.push({
            message: "Event Name must be at least 3 characters long",
            field: "eventName",
        });
    }

    // Validate event time
    const eventTimeregex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!otherDetails.startTime || !eventTimeregex.test(otherDetails.startTime)) {
        errors.push({
            message: "Start time must be in format 'HH:mm'",
            field: "startTime",
        });
    }

    // Validate the endTime field
    if (!otherDetails.endTime || !eventTimeregex.test(otherDetails.endTime)) {
        errors.push({
            message: "End time must be in format 'HH:mm'",
            field: "endTime",
        });
    } else if (otherDetails.startTime >= otherDetails.endTime) {
        errors.push({
            message: "End time must be greater than start time",
            field: "endTime",
        });
    } else if (otherDetails.startTime === otherDetails.endTime) {
        errors.push({
            message: "End time must be different from start time",
            field: "endTime",
        });
    }

    // Validate event hashtag field
    if (
        !otherDetails.eventHashtags ||
        !Array.isArray(otherDetails.eventHashtags)
    ) {
        errors.push({
            message: "Invalid event hashtags",
            field: "eventHashtags",
        });
    } else {
        otherDetails.eventHashtags.forEach((hashtag: string) => {
            if (!hashtag.startsWith("#")) {
                errors.push({
                    message: "Hashtag must start with a `#` symbol",
                    field: "eventHashtags",
                });
            }

            if (hashtag.length < 4) {
                errors.push({
                    message: "Hashtag must be at least 4 characters long",
                    field: "eventHashtags",
                });
            }
        });
    }

    // Validate eventDate format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (
        !otherDetails.eventDate ||
        !dateRegex.test(otherDetails.eventDate.toString())
    ) {
        errors.push({
            message: "Event Date must be of format: YYYY-MM-DD",
            field: "eventDate",
        });
    } else {
        const eventDate = new Date(otherDetails.eventDate);
        // check if date is valid
        if (eventDate.toString() === "Invalid Date") {
            errors.push({
                message: "Invalid date",
                field: "eventDate",
            });
        }

        // Check if the event date is in the past
        if (eventDate < new Date()) {
            errors.push({
                message: "Event Date must be in the future",
                field: "eventDate",
            });
        }
    }

    // Validate the invitees email
    const emailRegex = /\S+@\S+\.[a-zA-Z]+$/;
    if (!inviteesEmail || !Array.isArray(inviteesEmail)) {
        errors.push({
            message: "Invalid invitee emails",
            field: "inviteesEmail",
        });
    } else {
        inviteesEmail.forEach((email: string) => {
            if (!emailRegex.test(email)) {
                errors.push({
                    message: "Invalid invitee email",
                    field: "inviteesEmail",
                });
            }
        });
    }
    inviteesEmail = new Set(inviteesEmail);
    return errors;
}

export async function validateEventUpdate(payload: IEvent): Promise<IError[]> {
    const errors: IError[] = [];

    if (payload == null || JSON.stringify(payload) === "{}") {
        errors.push({
            field: "payload",
            message: "Payload is required",
        });
        return errors;
    }

    const {
        eventChecklist,
        commodityName,
        amountAllotted,
        budgetDescription,
        isIVCardPresent,
        mediaUpload,
        inviteesEmail,
        inviteesPhoneNumber,
        ...otherDetails
    } = payload as Record<string, any>; // Type assertion to overcome TypeScript error

    // Validate event name field
    if (otherDetails.eventName && otherDetails.eventName.length < 3) {
        errors.push({
            message: "Event Name must be at least 3 characters long",
            field: "eventName",
        });
    }

    // Validate event time
    const eventTimeregex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (otherDetails.startTime && !eventTimeregex.test(otherDetails.startTime)) {
        errors.push({
            message: "Start time must be in format 'HH:mm'",
            field: "startTime",
        });
    }

    // Validate the endTime field
    if (otherDetails.endTime && !eventTimeregex.test(otherDetails.endTime)) {
        errors.push({
            message: "End time must be in format 'HH:mm'",
            field: "endTime",
        });
    } else if (otherDetails.startTime >= otherDetails.endTime) {
        errors.push({
            message: "End time must be greater than start time",
            field: "endTime",
        });
    } else if (otherDetails.startTime === otherDetails.endTime) {
        errors.push({
            message: "End time must be different from start time",
            field: "endTime",
        });
    }

    // Validate event hashtag field
    if (
        otherDetails.eventHashtags &&
        !Array.isArray(otherDetails.eventHashtags)
    ) {
        errors.push({
            message: "Invalid event hashtags",
            field: "eventHashtags",
        });
    } else if (otherDetails.eventHashtags) {
        otherDetails.eventHashtags.forEach((hashtag: string) => {
            if (!hashtag.startsWith("#")) {
                errors.push({
                    message: "Hashtag must start with a `#` symbol",
                    field: "eventHashtags",
                });
            }

            if (hashtag.length < 4) {
                errors.push({
                    message: "Hashtag must be at least 4 characters long",
                    field: "eventHashtags",
                });
            }
        });
    }

    // Validate eventDate format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (
        otherDetails.eventDate &&
        !dateRegex.test(otherDetails.eventDate.toString())
    ) {
        errors.push({
            message: "Event Date must be of format: YYYY-MM-DD",
            field: "eventDate",
        });
    } else {
        const eventDate = new Date(otherDetails.eventDate);
        // check if date is valid
        if (eventDate.toString() === "Invalid Date") {
            errors.push({
                message: "Invalid date",
                field: "eventDate",
            });
        }

        // Check if the event date is in the past
        if (eventDate < new Date()) {
            errors.push({
                message: "Event Date must be in the future",
                field: "eventDate",
            });
        }
    }

    // Validate the invitees email
    const emailRegex = /\S+@\S+\.[a-zA-Z]+$/;
    if (inviteesEmail && !Array.isArray(inviteesEmail)) {
        errors.push({
            message: "Invalid invitee emails",
            field: "inviteesEmail",
        });
    } else {
        inviteesEmail.forEach((email: string) => {
            if (!emailRegex.test(email)) {
                errors.push({
                    message: "Invalid invitee email",
                    field: "inviteesEmail",
                });
            }
        });
    }
    return errors;
}
