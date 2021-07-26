import { Command } from "commander";
import stringArgv from "string-argv";

export default class Cli {
  constructor(appendToConsoleRef, setConsoleOutput) {
    this.appendToConsoleRef = appendToConsoleRef;

    this.program = new Command()
      .name(" ")
      .usage("[command] [options]")
      .configureOutput({
        writeOut: (str) => { this.writeOut(str); },
        writeErr: (str) => { this.writeOut(str); },
        getOutHelpWidth: () => {},
        getErrHelpWidth: () => {}
      })

    this.program
      .command("clear")
      .action(() => {
        setConsoleOutput([]);
      });

    this.program
      .command("bark")
      .description("Output bark to the console.")
      .option("-n, --number <number>", "number of times to bark")
      .action(({ number = 3 }) => {
        let res = "";
        for (let i = 0; i < number; i++) {
          res += "bark ";
        }
        this.writeOut(res);
      });

    this.program
      .command("users")
      .option("-l, --list", "fetch users and list them", true)
      .option("-rm, --remove <userId>", "remove a user by their id")
      .action(async ({ list, remove }) => {
        if (remove !== undefined) {
          const res = await fetch("https://gorest.co.in/public/v1/users/" + remove, { method: "DELETE" });
          const users = await res.json();
          const userData = users.data.reduce((acc, curr) => {
            acc += `[${curr.id}] ${curr.name} (${curr.email}) Gender: ${curr.gender} Status: ${curr.status}\n`;
            return acc;
          }, "");
          this.writeOut(userData);
        } else if (list) {
          const res = await fetch("https://gorest.co.in/public/v1/users")
          const users = await res.json();
          const userData = users.data.reduce((acc, curr) => {
            acc += `[${curr.id}] ${curr.name} (${curr.email}) Gender: ${curr.gender} Status: ${curr.status}\n`;
            return acc;
          }, "");
          this.writeOut(userData);
        }
      })

  }

  writeOut(str) {
    this.appendToConsoleRef.current(str);
  }

  async run(toParse) {
    try {
      await this.program.parseAsync(stringArgv(toParse), { from: "user" });
    } catch (err) {
      // catch exit throws meant for terminals
    }
  }
}