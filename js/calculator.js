input = document.getElementById('input');
const logicDic = ["+", "-", "*", "/", "^", "√"];
const floating = ",";

setZero();

function setZero(){
	if(input.value == ""){
		input.value = "0";
	} 
}

//0 - insert with checking, 1 = insert without it

function delZero(mode = 0){
	if (mode == 0){
		if (input.value[0] == "0" && input.value[1] != floating && (logicDic.indexOf(input.value[1]) == -1 || input.value[1] == "√")) {
			input.value = input.value.substring(1, input.value.length);
		}
	return true;
	} else{
			return false;
	}
}


function val_is_logic(val){
	if (logicDic.indexOf(val) != -1) {
		return true;
	} else{
		return false;
	}
}

//checking for insert function

function isPlusAfterExp(val){
	if (input.value[input.value.length - 1] == "^" && ((val == "+" || val == "-" || val == "√") && val != "*" && val != "/" && val != floating)) {
		return true;
	} else{
		return false;
	}
}

function isSqrtRootAfterLogic(val){
	if (val == "√" && logicDic.indexOf(input.value[input.value.length - 1]) != -1 && input.value[input.value.length - 1] != "√") {
		return true;
	} else{
		return false;
	}
}

function isNegativeAfterLogic(val){
	if (val == "-" && logicDic.indexOf(input.value[input.value.length - 1]) != -1 && input.value[input.value.length - 1] != "-") {
		return true;
	} else{
		return false;
	}
}

function isNumAfterZeroAfterLogic(val){
	if (!val_is_logic(val) && val != floating && input.value[input.value.length - 1] === "0" && input.value !== "0" && logicDic.indexOf(input.value[input.value.length - 2]) != -1) {
		return true;
	} else{
		return false;
	}
}

//0 - insert with checking, 1 = insert without it
function insert(val, delMode = 0){
	if (val_is_logic(input.value[input.value.length - 1]) && val_is_logic(val) && !isPlusAfterExp(val) && !isSqrtRootAfterLogic(val) && !isNegativeAfterLogic(val) || isNumAfterZeroAfterLogic(val)) {
		console.warn('Insert mistake');
		return false;
	} else{
		input.value += val.toString();
		delZero(delMode);
		return true;
	}
}

function clearInput(){
	input.value = '';
	setZero();
	return true;
}

function clearLastChar(){
	input.value = input.value.substring(0, input.value.length-1);
	setZero();
	return true;
}

//functions with math operations

function add(num1 = 0, num2 = 0){
	return num1 + num2;
}

function minus(num1 = 0, num2 = 0){
	return num1 - num2;
}

function divide(num1 = 0, num2 = 1){
	return num1 / num2;
}

function multiply(num1 = 0, num2 = 1){
	return num1 * num2;
}

function raiseTo(num = 0, ext = 1) {
	return Math.pow(num, ext);
}

function SquareRoot(num = 1) {
	return Math.sqrt(num);
}

function makeFloat(num1, num2){
	return Number(`${num1}.${num2}`);
}

function makeNegative(num) {
	return Number(`-${num}`);
}

//function for "=" btn

function result(){
	string = input.value;
	var infoNum = [], num = [], logic = [], logicID = [],  countLogicID = 0, taskCount = 0, task = [], equality;
	
	//getting logic

	if (string != "" && string != "0") {
		for (var i = 0; i < string.length; i++) {
			if (logicDic.indexOf(string[i]) != -1 || string[i] == floating) {
				logic.push(string[i]);
				logicID.push(i);
			}
		}

		logicID.push(string.length);

		//getting nums

		for (var j = 0; j < logicID.length; j++) {
			getEachNum = string.substring(countLogicID, logicID[j])
			countLogicID = logicID[j]+1;
			num.push(Number(getEachNum));
			infoNum.push(Number(getEachNum));

		}

		logicID.pop();

		//forming task, initialization for math operations 

		for (var i = 0; i < num.length; i++) {
			task.push(num[i]);
			task.push(logic[i]);
			taskCount++;
		}
		task.pop();

		//making float num

		for (var i = 0; i < task.length; i++) {
			if (task[i] == ",") {
				task[i] = makeFloat(task[i-1], task[i+1]);
				task.splice(i-1, 1);
				i--;
				task.splice(i+1, 1);
				i=0;
			}
		}

		//fixing bug with "0√3" in the task

		for (var i = 0; i < task.length; i++) {
			if (task[i] == 0 && task[i+1] == "√") {
				task.splice(i, 1);
				i=0;
			}
		}

		//checking if it is a negative exp

		for (var i = 0; i < task.length; i++) {
			if (task[i] == "^" && task[i+1] == "0" && task[i+2] == "-") {
				task[i+3] = makeNegative(task[i+3]);
				task.splice(i+1, 2)
				i=0;
			}
		}

		//checking if it is negative num after logic

		for (var i = 0; i < task.length; i++) {
			if (logicDic.indexOf(task[i]) != -1 && task[i+1] == "0" && task[i+2] == "-") {
				task[i+3] = makeNegative(task[i+3]);
				task.splice(i+1, 2)
				i=0;
			}
		}

		console.log(`%cTask: ${task.join(" ")}`, "color: #5A009D;");

		//fixing bug with "{\d}^√{\d}" in the task

		for (var i = 0; i < task.length; i++) {
			if (task[i] == "√" && task[i-1] == "^") {
				task[i] = SquareRoot(task[i+1]);
				console.log(`%cFixing task: √${task[i+1]} = ${task[i]}`, "color: orange;");
				task.splice(i+1, 1);
				i=0;
				console.log(task);
				console.log(`%cTask: ${task.join(" ")}`, "color: #5A009D;");
			}
		}

		//fixing bug with "{\d}√{\d}"

		for (var i = 0; i < task.length; i++) {
			if (task[i] == "√" && !val_is_logic(task[i-1]) && task[i-1] != undefined) {
				var num = task[i+1];
				task[i] = "*"
				task[i+1] = SquareRoot(num);
				console.log(`%cFixing task: √${num} = ${task[i+1]}`, "color: orange;");
				i=0;
				console.log(task);
				console.log(`%cTask: ${task.join(" ")}`, "color: #5A009D;");
			}
		}

		//getting square root and ext

		for (var i = 0; i < task.length; i++) {
			if (task[i] == "√") {
				task[i] = SquareRoot(task[i+1]);
				console.log(`√${task[i+1]} = ${task[i]}`);
				task.splice(i+1, 1);
				i=0;
				console.log(task);
			}
			else if (task[i] == "^") {
				task[i] = raiseTo(task[i-1], task[i+1]);
				console.log(`${task[i-1]} ^ ${task[i+1]} = ${task[i]}`);
				task.splice(i-1, 1);
				i--;
				task.splice(i+1, 1);
				i=0;
				console.log(task);
			}
		}

		//multiplying and dividing

		for (var i = 0; i < task.length; i++) {
			if (task[i] == "*") {
				task[i] = multiply(task[i-1], task[i+1]);
				console.log(`${task[i-1]} * ${task[i+1]} = ${task[i]}`);
				task.splice(i-1, 1);
				i--;
				task.splice(i+1, 1);
				i=0;
				console.log(task);
			}
			else if (task[i] == "/") {
				task[i] = divide(task[i-1], task[i+1]);
				console.log(`${task[i-1]} / ${task[i+1]} = ${task[i]}`);
				task.splice(i-1, 1);
				i--;
				task.splice(i+1, 1);
				i=0;
				console.log(task);
			}
		}
		
		//add and minus

		for (var i = 0; i < task.length; i++) {
			if (task[i] == "+") {
				task[i] = add(task[i-1], task[i+1]);
				console.log(`${task[i-1]} + ${task[i+1]} = ${task[i]}`);
				task.splice(i-1, 1);
				i--;
				task.splice(i+1, 1);
				i=0;
				console.log(task);
			}
			else if (task[i] == "-") {
				task[i] = minus(task[i-1], task[i+1]);
				console.log(`${task[i-1]} - ${task[i+1]} = ${task[i]}`);
				task.splice(i-1, 1);
				i--;
				task.splice(i+1, 1);
				i=0;
				console.log(task);
			}
		}

		//forming result

		equality = task.join('').toString();
		equality = Number(equality);

		console.log(`%cLogic: ${logic}\nNum: ${infoNum}\nLogicID: ${logicID}`, "color: blue;");
		console.info(`%cResult: ${equality}`, "color: green;");
		console.log("==============");

		if (!isNaN(equality) && equality != Infinity) {
			if (equality != +equality.toFixed(10)) {
				equality = +equality.toFixed(10);
			}
			equality = equality.toString();
			if (equality.indexOf(".") != -1) {
				equality = equality.substring(0, equality.indexOf(".")) + floating + equality.substring(equality.indexOf(".")+1, equality.length);	
			}

			input.value = "";
			insert(equality, 1);
			return true;
		} else{
			input.value = "ERROR";
			return false;
		}
	}
}