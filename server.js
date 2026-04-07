import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
  res.send("FitCoach Gemini API running");
});

app.post("/ask", async (req,res)=>{

  try{

    const response = await fetch(

`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,

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
text:`
You are FitCoach AI 💪

Create:
• workout plans
• gym routines
• diet suggestions
• home exercises

Rules:
- structured
- bullet points
- beginner friendly

User question:
${req.body.message}
`
}
]
}

]

})

}

);

const data = await response.json();

res.json({

reply:data.candidates?.[0]?.content?.parts?.[0]?.text || "No response"

});

}

catch(error){

console.log(error);

res.json({

reply:"Server error"

});

}

});


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{

console.log("FitCoach Gemini running");

});
