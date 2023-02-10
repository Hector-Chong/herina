import { HerinaBuildEventNames } from "@herina-rn/shared";
import EventManager from "./manager";

const HerinaEventManager = new EventManager<HerinaBuildEventNames>();

export default HerinaEventManager;
