window.addEventListener('load', (event) => {
    main();
});

var content__json;
var question_img = document.getElementById('question-img');
var counter__text = document.getElementById('counter__text');
var nextButton = document.getElementById('controls--button');
var userInput = document.getElementById('input__user');
var answerContainer = document.querySelector('.answers');
var CheckButton = document.querySelector('#check__text');
var checkResultDiv = document.querySelector('#check__symbol');
var checkIcon = document.querySelector('#check__icon');
var currNumber = 1;  
var totalQuestions;
var userAnswers=[];
var checkClickCounter = 0;
async function main(){       
    
    content__json = await (await fetch("content.json")).json();
    totalQuestions =  Object.keys(content__json).length;
    loadQuestion(currNumber)    
    nextButton.addEventListener('click', IncremenQ)
    CheckButton.addEventListener('click', checkHandler)
}

async function IncremenQ(){
    userAnswers.push(userInput.value.length > 0 ? userInput.value.toString() : null);
    userInput.value='';
    currNumber+=1;
    checkClickCounter=0;
    checkResultDiv.style.display='none'
    CheckButton.classList.remove('disabled')
    if(currNumber<=totalQuestions) await loadQuestion(currNumber);
    if(currNumber>totalQuestions) await showScores();
    
}

async function loadQuestion(name){
    let question;
    question = content__json['question_' + name.toString()].question;
    question_img.src = question;
    counter__text.textContent = currNumber + '/' + totalQuestions;
    userInput.placeholder = content__json['question_' + name.toString()].placeholder; 
    //userInput.focus();
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
    let span_q = document.createElement('img');
    let span_a = document.createElement('span');
    let span_p = document.createElement('span');
    span_a.className = "results__answer";
    span_q.id = "results__question";
    span_p.id = "results__placeholder";
    span_q.src = content__json['question_' + name.toString()].question;
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
    span_s.textContent = `Score ${score}/${totalQuestions}`;
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

async function checkHandler(){
    
    let actualAns;
    userAns = userInput.value;
    actualAns = content__json['question_' + currNumber.toString()].answer;
    

    if(checkClickCounter>2){        
        return
    }

    if( userAns.length>0){   
        checkIcon.className="fas";
        let icon = document.createElement('i');       
        
        checkResultDiv.style.display='flex'
        if(actualAns.toLowerCase().startsWith(userAns.trim().toLowerCase())){            
            checkIcon.classList.add('fa-check-circle')          
            checkIcon.classList.add('yes')          
            CheckButton.classList.add('disabled')
        }else{            
            checkIcon.classList.add('fa-times-circle')          
            checkIcon.classList.add('no')          
        }
        checkClickCounter++;
        if(checkClickCounter>2){
            CheckButton.classList.add('disabled')
            return
        }
    }    

}

//<i class="fas fa-check-circle"></i>  --  color: #6ab04c;    
//<i class="fas fa-check-circle"></i>  --  color: #EA2027;;
