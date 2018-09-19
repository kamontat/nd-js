import { Controller } from "./_interface";

class InteractiveController implements Controller {
  Command = "interactive";
  Alias = ["i"];
  Description = "Make program as interactive shell";
}

export const Interactive = new InteractiveController();
