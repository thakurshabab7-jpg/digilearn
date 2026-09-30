// DigiLearn backend
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const dataPath = (f) => path.join(__dirname, "data", f);
const read = (f) => JSON.parse(fs.readFileSync(dataPath(f), "utf8"));

if (!fs.existsSync(dataPath("scores.json"))) {
  fs.writeFileSync(dataPath("scores.json"), "[]");
}

app.get("/api/lessons", (req, res) => {
  res.json(read("lessons.json").map(({id,title,icon}) => ({id,title,icon})));
});

app.get("/api/lessons/:id", (req, res) => {
  const lesson = read("lessons.json").find(l => l.id === req.params.id);
  lesson ? res.json(lesson) : res.status(404).json({error:"Lesson not found"});
});

app.get("/api/quiz", (req, res) => {
  res.json(read("quiz.json").map(({q,options}) => ({q,options})));
});

app.post("/api/quiz/submit", (req, res) => {
  const {name,answers} = req.body;
  if(!name || !Array.isArray(answers)) {
    return res.status(400).json({error:"Name and answers needed"});
  }

  const quiz = read("quiz.json");
  const correct = quiz.map(x => x.answer);
  const score = answers.filter((a,i) => a === correct[i]).length;

  const scores = read("scores.json");
  scores.push({
    name:String(name).slice(0,30),
    score,
    total:quiz.length,
    date:new Date().toISOString()
  });
  fs.writeFileSync(dataPath("scores.json"), JSON.stringify(scores,null,2));

  res.json({score,total:quiz.length,correct});
});

app.get("/api/scores", (req,res) => {
  res.json(
    read("scores.json")
      .sort((a,b) => b.score - a.score)
      .slice(0,10)
  );
});

app.listen(PORT, () => {
  console.log(`DigiLearn running at http://localhost:${PORT}`);
});
