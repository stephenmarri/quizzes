window.addEventListener('load', (event) => {
    main();
});

var content__json;
var question__text = document.getElementById('question__text');
var counter__text = document.getElementById('counter__text');
var nextButton = document.getElementById('controls--button');
var userInput = document.getElementById('input__user');
var answerContainer = document.querySelector('.answers');
var currNumber = 1;  
var totalQuestions;
var userAnswers=[];
async function main(){       
    
    content__json = await (await fetch("content.json")).json();
    totalQuestions =  Object.keys(content__json).length;
    loadQuestion(currNumber)    
    nextButton.addEventListener('click', IncremenQ)
    
}

async function IncremenQ(){
    userAnswers.push(userInput.value.length > 0 ? userInput.value.toString() : null);
    userInput.value='';
    currNumber+=1;
    if(currNumber<=totalQuestions) await loadQuestion(currNumber);
    if(currNumber>totalQuestions) await showScores();
    
}

async function loadQuestion(name){
    let question;
    question = content__json['question_' + name.toString()].question;
    question__text.textContent = question;
    counter__text.textContent = currNumber + '/' + totalQuestions;
    userInput.placeholder = content__json['question_' + name.toString()].placeholder;    
    if(currNumber==totalQuestions) nextButton.textContent = "Submit";
}

async function showScores(){
    document.querySelector('.main-container').style.display = 'none';
    document.querySelector('.results').style.display = 'flex';
    console.log(userAnswers);
    for(let i=1; i<=totalQuestions;i++){
        await generateOneQAPair(i);
    }
    await generateScoreText();
}

async function generateOneQAPair(name){
    let span_q = document.createElement('span');
    let span_a = document.createElement('span');
    let span_p = document.createElement('span');
    span_a.className = "results__answer";
    span_q.id = "results__question";
    span_p.id = "results__placeholder";
    span_q.textContent = content__json['question_' + name.toString()].question;
    span_a.textContent = content__json['question_' + name.toString()].answer;
    span_p.textContent = content__json['question_' + name.toString()].placeholder;
    answerContainer.appendChild(span_q);
    answerContainer.appendChild(span_p);
    answerContainer.appendChild(span_a);

}

async function generateScoreText(){
    let span_s = document.createElement('span');
    span_s.id = 'score__text';
    let score = await calculateScore();
    span_s.textContent = `Score ${score}/5`;
    document.querySelector('.score').appendChild(span_s);

}

 async function calculateScore(){
    let score=0;
    let anwers = document.getElementsByClassName('results__answer');
    for(let i=0;i<userAnswers.length;i++){
        let ans = content__json['question_' + (i+1).toString()].answer.toString();
        if(userAnswers[i] != null){
            if(ans.toLowerCase().startsWith(userAnswers[i].trim().toLowerCase())){
                score++;
                anwers[i].classList.add('correct');
            }
        }
    }     
    return score;
}