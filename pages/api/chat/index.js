import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      const { id, ...lastAnswer } = req.body.chatHistory.at(-1);
      const messages = lastAnswer ? [lastAnswer] : [];
      console.log(lastAnswer);

      messages.push({
        role: "user",
        content: req.body.query,
      });

      messages.unshift({
        role: "system",
        content: `You are a product owner. Write a User Story.
        Write the acceptance criteria as specific as possible.
        Answer only with the following template: 

        TEMPLATE: 
        As a user, 
        I want …, 
        So that … 

        ## Acceptance criteria
        - [ ] criteria 1
        - [ ] criteria 2
        ...

        ## Tasks
        - [ ] task 1
        - [ ] task 2
        ...

        ## Size
        `,
      });

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 1,
        messages,
      });

      res.json(response.data.choices[0].message);

      break;
    default:
      res.status(405).json({ message: "wrong method" });
  }
}
