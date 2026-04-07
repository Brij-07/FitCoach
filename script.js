const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const button = document.getElementById("send-btn");

function addMessage(text, sender){

const msg=document.createElement("div");

msg.className="message "+sender;

msg.innerHTML=formatText(text);

chatBox.appendChild(msg);

chatBox.scrollTop=chatBox.scrollHeight;

}

function formatText(text){

return text

.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")

.replace(/\n/g,"<br>")

.replace(/•/g,"<span class='bullet'>•</span>");

}

async function askAI(prompt){

const response = await fetch("/ask",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
message: prompt
})

});

const data = await response.json();

return data.reply;

}

async function handleChat(){

const text=input.value.trim();

if(!text) return;

addMessage(text,"user");

input.value="";

const loading=document.createElement("div");

loading.className="message bot";

loading.innerHTML="Thinking...";

chatBox.appendChild(loading);

const reply=await askAI(text);

loading.innerHTML=formatText(reply);

}

button.onclick=handleChat;

input.addEventListener("keydown",e=>{

if(e.key==="Enter" && !e.shiftKey){

e.preventDefault();

handleChat();

}

});
