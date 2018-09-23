const prompt = require("prompts");

(async function(message) {
  const { text } = await prompt({
    type: "text",
    name: "text",
    message: `${message}? `,
    initial: true
  });
  console.log(text);
})(process.argv[2]);
