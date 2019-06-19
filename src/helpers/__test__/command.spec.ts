import { Command } from "commander";
import "jest-extended";

import { MakeCommand, MakeOption } from "../command";

describe.skip("test about command maker", function() {
  test("Should add option to commander", function() {
    const program = new Command();

    MakeOption(program, {
      name: "test",
      desc: "test option",
    });

    MakeOption(program, {
      name: "another",
      desc: "",
    });

    MakeOption(program, {
      name: "all",
      desc: "test option",
      fn: jest.fn(),
    });

    const opts = program.opts();

    expect(opts).toContainKey("test");
    expect(opts).toContainKey("another");
    expect(opts).toContainKey("all");
  });

  test("Should add the command to commander", function(done) {
    const program = new Command();

    MakeCommand(program, {
      name: "test <arg>",
      desc: "test",
      alias: "T",
      fn: _ => {
        done();
      },
    });

    program.parse(["/usr/local/bin/node", "path/test.js", "test", "user1"]);
  });
});
