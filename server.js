const express = require("express");
//invoke the express function we made above
const app = express();
const morgan = require("morgan");

app.use(morgan("dev"));
// this is the root index /
app.get('/', (req,res)=>{
    res.send("Hello Express");
});
//send method lets us send status codes such as 404
//can send string like hello, etc. 
app.get('/users', (req,res)=>{
    let users = ["tj", "kelly", "sarah"];
    res.send({ users });

    
});
app.get("/test-request",(req,res) =>{
    res.send({
       // headers: req.headers, 
        url: req.url,
        params: req.params,
        query: req.query
    });
    
});

app.get('/greeting',(req,res)=>{
   let requiredFields = ['name','age'];
   requiredFields.forEach(field => {
       if(!req.query[field]){
           res.status(400).send(`${field} is a required param `);
       };  
   });
    let {name, age} = req.query;
    res.send(`welcome ${name} you are ${age}`);
})
/*Create a route handler function on the path /sum that accepts two query parameters named a and b 
and find the sum of the two values. Return a string in the format "The sum of a and b is c".
 Note that query parameters are always strings so some thought should be given to converting them to numbers.
*/

app.get('/sum',(req, res)=>{
    let requiredFields = ['a','b'];
   requiredFields.forEach(field => {
       if(!req.query[field]){
           res.status(400).send(`${field} is a required param `);
       };  
   });
   let {a, b} = req.query;
   const numberA= parseInt(a);
   const numberB= parseInt(b);
   res.send(`the sum of a and b is ${numberA+ numberB}`);
})
/*Create an endpoint /cipher. The handler function should accept a query parameter named text 
and one named shift. Encrypt the text using a simple shift cipher also known as a Caesar Cipher. 
It is a simple substitution cipher where each letter is shifted a certain number of places down the alphabet. 
So if the shift was 1 then A would be replaced by B, and B would be replaced by C and 
C would be replaced by D and so on until finally Z would be replaced by A. 
using this scheme encrypt the text with the given shift and return the result to the client. 
Hint - String.fromCharCode(65) is an uppercase A and 'A'.charCodeAt(0) is the number 65. 
65 is the integer value of uppercase A in UTF-16. See the documentation for details.
*/
app.get('/cipher',(req, res)=>{
    let requiredFields = ['text','shift'];
   requiredFields.forEach(field => {
       if(!req.query[field]){
           res.status(400).send(`${field} is a required param `);
       };  
   });
   let {text, shift} = req.query;
   const shiftNum= parseInt(shift);
   text = text.toUpperCase();
   let encryptedMessage = "";
   let start = 65;
   let max = 65+25;

for(let i=0; i<text.length; i++){
    if(text[i].charCodeAt(0) < start || text[i].charCodeAt(0)>max){
        encryptedMessage += text[i];
    } else {
        let newPosition = text[i].charCodeAt(0) + shiftNum;
        if(newPosition > max){
            newPosition= (newPosition % max) + start-1;
        }
        encryptedMessage += String.fromCharCode(newPosition);
    }
}
   res.send(encryptedMessage);
})

/*To send an array of values to the server via a query string simply repeat the key with different values. 
For instance, the query string ?arr=1&arr=2&arr=3 results in the query object { arr: [ '1', '2', '3' ] }. 
Create a new endpoint /lotto that accepts an array of 6 distinct numbers between 1 and 20 named numbers. 
The function then randomly generates 6 numbers between 1 and 20. Compare the numbers sent in the query 
with the randomly generated numbers to determine how many match. If fewer than 4 numbers match respond 
with the string "Sorry, you lose". If 4 numbers match respond with the string "Congratulations, you win a free ticket", 
if 5 numbers match respond with "Congratulations! You win $100!". If all 6 numbers match respond with 
"Wow! Unbelievable! You could have won the mega millions!".
*/
app.get('/lotto',(req, res)=>{
    const { numbers } = req.query; 

    // validation: 
    // 1. the numbers array must exist
    // 2. must be an array
    // 3. must be 6 numbers
    // 4. numbers must be between 1 and 20
  
    if(!numbers) {
      return res
        .status(400)
        .send("numbers is required");
    }
   
   if(!Array.isArray(numbers)) {
    return res
      .status(400)
      .send("numbers must be an array");
  }

  const guesses = numbers
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));
  
  if(guesses.length != 6) {
    return res
      .status(400)
      .send("numbers must contain 6 integers between 1 and 20");
  }      

  // fully validated numbers

  // here are the 20 numbers to choose from
  const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

  //randomly choose 6
  const winningNumbers = [];
  for(let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }

  //compare the guesses to the winning number
  let diff = winningNumbers.filter(n => !guesses.includes(n));

  // construct a response
  let responseText;

  switch(diff.length){
    case 0: 
      responseText = 'Wow! Unbelievable! You could have won the mega millions!';
      break;
    case 1:   
      responseText = 'Congratulations! You win $100!';
      break;
    case 2:
      responseText = 'Congratulations, you win a free ticket!';
      break;
    default:
      responseText = 'Sorry, you lose';  
  }

  // res.json({
  //   guesses,
  //   winningNumbers,
  //   diff,
  //   responseText
  // });

  res.send(responseText);
});


//choose port number, try to be above 1000
app.listen(8000, ()=>{
    console.log("app is running at http://localhost:8000")
});

