const prompt = require("prompts");

(async function(message) {
  const { confirm } = await prompt({
    type: "confirm",
    name: "confirm",
    message: `${message}? `,
    initial: true
  });

  if (!confirm) process.exit(1);
})(process.argv[2]);
