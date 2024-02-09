import { NextFunction, Response, Request } from "express";
import eventService from "../services/eventService";

class EventController {
    private eventService: typeof eventService;

    constructor() {
        this.eventService = eventService;
    }

    /**
     * @route POST api/v1/events
     * @desc Create an event
     * @access Private
     * @async
     */

    createEvent = async (req: Request, res: Response, next: NextFunction) => {
        await this.eventService.createEvent(req, res, next);
    };
}

export default EventController;
