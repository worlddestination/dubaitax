const fs = require("fs");
const axios = require("axios");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

async function generateBlogs() {

const news = await axios.get(

`https://newsapi.org/v2/everything?q=UAE tax OR Dubai VAT&language=en&pageSize=3&apiKey=${NEWS_API_KEY}`

);

const articles = news.data.articles;

let blogs = [];

for (const article of articles) {

const prompt = `
Rewrite this UAE tax news into a short unique blog summary.
Keep it professional and SEO friendly.
Do not copy wording.

Title:
${article.title}

Content:
${article.description}
`;

const ai = await axios.post(

"https://api.groq.com/openai/v1/chat/completions",

{
model:"llama3-70b-8192",

messages:[
{
role:"user",
content:prompt
}
]
},

{
headers:{
Authorization:`Bearer ${GROQ_API_KEY}`,
"Content-Type":"application/json"
}
}

);

blogs.push({

title:article.title,

summary:ai.data.choices[0].message.content,

source:article.url,

date:new Date().toLocaleDateString()

});

}

fs.writeFileSync("blogs.json", JSON.stringify(blogs,null,2));

console.log("Blogs Updated");

}

generateBlogs();
