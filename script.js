const API_KEY = "AIzaSyBTPXnxbP12sDUBy9mkraICPawEye3dh34";
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const button = document.getElementById("send-btn");
let chatHistory = [];
function addMessage(text, sender) {
const msg = document.createElement("div");
msg.className = "message " + sender;
msg.innerHTML = formatText(text);
chatBox.appendChild(msg);
chatBox.scrollTop = chatBox.scrollHeight;
}
function formatText(text) {
return text
.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")
.replace(/\n/g,"<br>")
.replace(/•/g,"<span class='bullet'>•</span>");
}
async function askAI(prompt) {
chatHistory.push({
role:"user",
parts:[{text:prompt}]
});
const response = await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
contents:[
{
parts:[
{
text:`You are FitCoach AI.
Understand user intent and respond appropriately.
INTENTS:
Greeting/chat:
→ short 1 sentence reply
Workout request:
→ full 5-7 day split
Diet request:
→ full diet plan
Macros/calories request:
→ show calories, protein, carbs, fats for each meal
Follow-up questions:
→ use previous context
FORMAT RULES:
Workout Plan
Day 1 – Muscle
• Exercise 3x10
Diet Plan
Breakfast
• Food
Macros Example:
Breakfast
Calories: 350 kcal
Protein: 20g
Carbs: 40g
Fat: 12g
RULES:
• No long paragraphs
• Keep clean formatting
• Bullet points only where needed
`
}
]
},
...chatHistory
]
})
});
const data = await response.json();
const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
|| "Error generating response";
chatHistory.push({
role:"model",
parts:[{text:reply}]
});
return reply;
}
async function handleChat() {
const text = input.value.trim();
if(!text) return;
addMessage(text,"user");
input.value = "";
const loading = document.createElement("div");
loading.className = "message bot";
loading.innerHTML = "Thinking...";
chatBox.appendChild(loading);
const reply = await askAI(text);
loading.innerHTML = formatText(reply);
}
button.onclick = handleChat;
input.addEventListener("keydown", e => {
if(e.key === "Enter" && !e.shiftKey){
e.preventDefault();
handleChat();
}
});