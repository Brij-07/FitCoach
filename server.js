const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const API_KEY = process.env.API_KEY;

/*
SMART SYSTEM PROMPT
makes bot flexible instead of one dimensional
*/

const SYSTEM_PROMPT = `
You are FitCoach AI, an intelligent fitness assistant.

You help users with:
• workout plans
• diet plans
• calories and macros
• fitness tips
• beginner guidance
• muscle gain advice
• fat loss advice
• exercise explanations
• habit building advice

PERSONALITY:
friendly
encouraging
practical
simple language

INTENT RULES:

Greeting (hi, hello etc)
→ short friendly greeting
→ ask what goal user has

General fitness questions
→ explain clearly
→ do NOT generate full plan unless asked

Workout requests
→ structured workout plan
→ adapt difficulty:
   beginner
   intermediate
   advanced

Diet requests
→ simple realistic foods
→ balanced nutrition

Macros/calories questions
→ calculate or estimate
→ use context if diet already exists

Follow-up requests
→ modify previous answer
→ keep context

Examples of follow-ups:
"add more protein"
"make it vegetarian"
"increase intensity"
"home workout version"
"reduce calories"

Workout format:

Workout Plan

Day 1 – Muscle Group
• Exercise – sets x reps
• Exercise – sets x reps

Diet format:

Diet Plan

Breakfast
• Food

Lunch
• Food

Dinner
• Food

Snacks
• Food

Macros format:

Calories: ___ kcal
Protein: __ g
Carbs: __ g
Fat: __ g

RULES:

• do not always generate full plans
• understand intent first
• ask clarification if needed
• keep answers structured
• avoid long paragraphs
• keep answers practical
• use bullet points when helpful
• remember conversation context
• if user unsure → suggest options
`;

let chatHistory = [
{
role:"user",
parts:[{ text: SYSTEM_PROMPT }]
}
];

app.post("/ask", async (req,res)=>{

const userMessage = req.body.message;

chatHistory.push({
role:"user",
parts:[{ text:userMessage }]
});

try{

const response = await fetch(

`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,

{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({

contents: chatHistory,

generationConfig:{
temperature:0.7,
topP:0.9,
maxOutputTokens:2500
}

})

}

);

const data = await response.json();

const reply =

data?.candidates?.[0]?.content?.parts?.[0]?.text

|| "I couldn't generate a response.";

chatHistory.push({
role:"model",
parts:[{ text: reply }]
});

res.json({ reply });

}catch(error){

res.json({
reply:"Server error"
});

}

});

app.listen(3000,()=>{
console.log("FitCoach running on http://localhost:3000");
});