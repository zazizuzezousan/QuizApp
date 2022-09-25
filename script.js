//セッティング
const $numericalCheck = document.getElementById("numerical");
const $randomCheck = document.getElementById("random");
const $selectionCheck = document.getElementById("selection");
const $writingCheck = document.getElementById("writing");

let orderOfQuestions = "numerical";
let questionFormat = "selection";

function setOrderOfQuestions(){
    if($numericalCheck.checked){
        orderOfQuestions = "numerical";
    }else if($randomCheck.checked){
        orderOfQuestions = "random";
    }
}
function setQuestionFormat(){
    if($selectionCheck.checked){
        questionFormat = "selection";
    }else if($writingCheck.checked){
        questionFormat = "writing";
    }
}

//問題作成
const $questionCreateDisplay = document.getElementById("question-create-display");
const $questionSentenceCreate = document.getElementById("question-sentence-create");
const $correctAnswersCreateList = document.getElementById("correct-answers-create");
const $wrongAnswersCreateList = document.getElementById("wrong-answers-create");
const $createdQuestion = document.getElementById("created-question");
const $createdQuestionList = document.getElementById("created-question-list");

let creationMode = false;
let numberOfWrongs = 0;
let numberOfcorrects = 0;
let questionNumber = 0;
let questionArray = new Array();

function showQuestionCreateDisplay(element){
    if(!creationMode){
        $questionCreateDisplay.style.display = "block";
        $createdQuestion.style.position = "absolute";
        $createdQuestion.style.display = "block";
        element.innerText = "問題作成を中断";
        hideQuestionButton();
        creationMode = true;
    }else{
        $questionCreateDisplay.style.display = "none";
        $createdQuestion.style.position = "relative";
        $createdQuestion.style.display = "none";
        element.innerText = "問題作成";
        showQuestionButton();
        creationMode = false;
    }
    document.getElementById("menuCheck").checked = false;
}
function setCorrectAnswerCreateInput(input){
    const value = Number(input);
    if(value == ""){
        numberOfcorrects = 0;
        $correctAnswersCreateList.innerHTML = "";
    }else if(value > numberOfcorrects){
        for(let i = 0; i < (value - numberOfcorrects); i++){
            const newCorrectAnswerCreateLi = document.createElement("li");
            const newCorrectAnswerCreateInput = document.createElement("input");
            const idNumber = i + numberOfcorrects;
            newCorrectAnswerCreateInput.type = "text";
            newCorrectAnswerCreateInput.placeholder = "正答を入力";
            newCorrectAnswerCreateInput.id = "correct-answer" + idNumber;
            newCorrectAnswerCreateInput.classList.add("correct-selection");
            newCorrectAnswerCreateLi.appendChild(newCorrectAnswerCreateInput);
            $correctAnswersCreateList.appendChild(newCorrectAnswerCreateLi);
        }
        numberOfcorrects = value;
    }else if(value < numberOfcorrects){
        for(let i = 0; i < (numberOfcorrects - value); i++){
            const idNumber = numberOfcorrects - i - 1;
            document.getElementById("correct-answer" + idNumber).parentNode.remove();
        }
        numberOfcorrects = value;
    }
}
function setWrongAnswerCreateInput(input){
    const value = Number(input);
    if(value == ""){
        numberOfWrongs = 0;
        $wrongAnswersCreateList.innerHTML = "";
    }else if(value > numberOfWrongs){
        for(let i = 0; i < (value - numberOfWrongs); i++){
            const newWrongAnswerCreateLi = document.createElement("li");
            const newWrongAnswerCreateInput = document.createElement("input");
            const idNumber = i + numberOfWrongs;
            newWrongAnswerCreateInput.type = "text";
            newWrongAnswerCreateInput.placeholder = "誤答を入力";
            newWrongAnswerCreateInput.id = "wrong-answer" + idNumber;
            newWrongAnswerCreateInput.classList.add("wrong-selection");
            newWrongAnswerCreateLi.appendChild(newWrongAnswerCreateInput);
            $wrongAnswersCreateList.appendChild(newWrongAnswerCreateLi);
        }
        numberOfWrongs = value;
    }else if(value < numberOfWrongs){
        for(let i = 0; i < (numberOfWrongs - value); i++){
            const idNumber = numberOfWrongs - i - 1;
            document.getElementById("wrong-answer" + idNumber).parentNode.remove();
        }
        numberOfWrongs = value;
    }
}
function createQuestion(){
    const $correctSelections = document.getElementsByClassName("correct-selection");
    const $wrongSelections = document.getElementsByClassName("wrong-selection");
    questionArray[questionNumber] = new Object();
    questionArray[questionNumber].questionSentence = $questionSentenceCreate.value;
    questionArray[questionNumber].wrongSelections = new Array();
    questionArray[questionNumber].correctSelections = new Array();
    for(let i = 0; i < $wrongSelections.length; i++) questionArray[questionNumber].wrongSelections[i] = $wrongSelections[i].value;
    for(let i = 0; i < $correctSelections.length; i++) questionArray[questionNumber].correctSelections[i] = $correctSelections[i].value;
    const createdQuestion = document.createElement("li");
    createdQuestion.innerText = questionArray[questionNumber].questionSentence;
    createdQuestion.id = "Q" + questionNumber;
    $createdQuestionList.appendChild(createdQuestion);
    questionNumber++;
    $questionSentenceCreate.value = "";
    numberOfWrongs = 0;
    numberOfcorrects = 0;
    $correctAnswersCreateList.innerHTML = "";
    $wrongAnswersCreateList.innerHTML = "";
    document.getElementById("number-of-correct").value = "";
    document.getElementById("number-of-wrong").value = "";
}
function outputJSFile(){
    if(!document.getElementById("output-file-name").value == ""){
        let textFromArray = JSON.stringify(questionArray);
        textFromArray = "let " + document.getElementById("output-file-name").value + " = " + textFromArray + ";";
        navigator.clipboard.writeText(textFromArray);
        window.alert("クリップボートにコピーしました");
    }else{
        window.alert("変数名を入力してください");
    }
}

//問題一覧表示&非表示
const $questionList = document.getElementById("question-list");

function showQuestionButton(){
    $questionList.style.display = "flex";
    for(let i = 0; i < questionListArray.length; i++){
        const questionButton = document.createElement("button");
        questionButton.classList.add("question-button");
        questionButton.id = questionListArray[i];
        questionButton.onclick = function(){
            startQuestion(this.id);
        };
        questionButton.innerText = questionListArray[i];
        $questionList.appendChild(questionButton);
    }
}
function hideQuestionButton(){
    $questionList.innerHTML = "";
    $questionList.style.display = "none";
}

//問題選択＆開始
const $runQuestion = document.getElementById("run-question");

let nowQuestionNumber = 0;
let numberOfCorrectAnswers = 0;

function startQuestion(id){
    hideQuestionButton();
    nowQuestionNumber = 0;
    numberOfCorrectAnswers = 0;
    const thisQuiz = eval(id);
    for(let i = 0; i < thisQuiz.length; i++){
        const createQuestionDisplay = document.createElement("div");
        createQuestionDisplay.classList.add("question-display");
        createQuestionDisplay.id = "question" + i;
        const createQuestionSentence = document.createElement("p");
        createQuestionSentence.classList.add("question-sentence");
        createQuestionSentence.innerText = "Q." + thisQuiz[i].questionSentence;
        createQuestionDisplay.appendChild(createQuestionSentence);
        const choices = thisQuiz[i].wrongSelections.concat(thisQuiz[i].correctSelections);
        let done = new Array(choices.length);
        for(let j = 0; j < choices.length; j++){
            let thisChoice = new Number();
            do{
                thisChoice = Math.floor(Math.random() * choices.length);
            }while(done[thisChoice] == true);
            done[thisChoice] = true;
            const createSelection = document.createElement("label");
            createSelection.classList.add("selection", "inQuestion" + i);
            createSelection.innerHTML = '<input type="checkbox" class="selection-input">' + choices[thisChoice];
            createQuestionDisplay.appendChild(createSelection);
        }
        const createSubmitButton = document.createElement("button");
        createSubmitButton.classList.add("submit-button");
        createSubmitButton.onclick = function(){
            const selections = document.getElementsByClassName("inQuestion" + nowQuestionNumber);
            let selected = new Array();
            for(let i = 0; i < selections.length; i++){
                if(selections[i].firstElementChild.checked == true) selected.push(selections[i].innerText);
            }
            if(thisQuiz[nowQuestionNumber].correctSelections.toString() == selected.toString()) numberOfCorrectAnswers++;
            console.log(numberOfCorrectAnswers);
            document.getElementById("question" + nowQuestionNumber).style.display = "none";
            nowQuestionNumber++;
            document.getElementById("question" + nowQuestionNumber).style.display = "block";
        };
        createSubmitButton.innerText = "回答";
        createQuestionDisplay.appendChild(createSubmitButton);
        $runQuestion.appendChild(createQuestionDisplay);
    }
    document.getElementById("question0").style.display = "block";
}
function judgeAndNext(){
    const selections = document.getElementsByClassName("selection");
    let selected = new Array();
    for(let i = 0; i < selections.length; i++){
        if(selections[i].firstElementChild.checked == true) selected.push(selections[i].innerText);
    }
    if(thisQuiz[nowQuestionNumber].correctSelections == selected) numberOfCorrectAnswers++;
    document.getElementById("question" + nowQuestionNumber).style.display = "none";
    nowQuestionNumber++;
    document.getElementById("question" + nowQuestionNumber).style.display = "block";
}

window.onload = function(){
    showQuestionButton();
}