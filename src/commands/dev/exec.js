const execa = require("execa");
const Command = require("@netlify/cli-utils");
const { track } = require("@netlify/cli-utils/src/utils/telemetry");
const chalk = require("chalk");
const NETLIFYDEV = `[${chalk.cyan("Netlify Dev")}]`;

class ExecCommand extends Command {
  async run() {
    const { site, api } = this.netlify;
    if (site.id) {
      console.log(
        `${NETLIFYDEV} Checking your site's environment variables...`
      );
      const accessToken = api.accessToken;
      const { addEnvVariables } = require("../../utils/dev");
      await addEnvVariables(api, site, accessToken);
    } else {
      console.log(
        `${NETLIFYDEV} No Site ID detected. You probably forgot to run \`netlify link\` or \`netlify init\`. `
      );
    }
    execa(this.argv[0], this.argv.slice(1), {
      env: process.env,
      stdio: "inherit"
    });
    // Todo hoist this telemetry `command` to CLI hook
    track("command", {
      command: "dev:exec"
    });
  }
}

ExecCommand.description = `Exec command
Runs a command within the netlify dev environment, e.g. with env variables from any installed addons
`;

ExecCommand.examples = ["$ netlify exec npm run bootstrap"];

ExecCommand.strict = false;
ExecCommand.parse = false;

module.exports = ExecCommand;
