import uuid from "uuid/v1";

export default class Config {
  userid: string;
  token: string;
  status: "normal" | "debug" | "verbose";

  color: boolean;

  constructor(token: string, id?: string, status?: "normal" | "debug" | "verbose", color?: boolean) {
    this.token = token;

    if (status === undefined) this.status = "normal";
    else this.status = status;

    if (id === undefined) this.userid = uuid();
    else this.userid = id;

    if (color === undefined) this.color = true;
    else this.color = color;
  }

  load() {
    throw new Error("Something bad happened");
  }
}
