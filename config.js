//Load task
//This event is called when the DOM is fully loaded
var tasks;
//First position is used to denote an space with " " or a word "a" or nothing "". (No spaces at the beginig or end of sentences).
var tokens;
//All posible words to use for the game, consider always space.
var words;
   
function getFileFromServer(url, doneCallback) {
    var xhr;

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handleStateChange;
    xhr.open("GET", url, false);
    xhr.send();

    function handleStateChange() {
        if (xhr.readyState === 4) {
            doneCallback(xhr.status == 200 ? xhr.responseText : null);
        }
    }
}
function loadFiles(){
	getFileFromServer("json/tasks.json", function(text) {
		alert('1');
		if (text === null) {
			//Error
			alert('Error');
		}
		else {
			alert(text);
			tasks = JSON.parse(text);
		}
	});
	getFileFromServer("json/tokens.txt", function(text) {
		if (text === null) {
			//Error
		}
		else {
			tokens = text.split(",");
		}
	});
	getFileFromServer("json/words.json", function(text) {
		if (text === null) {
			//Error
		}
		else {
			words = JSON.parse(text);
		}
	});
}

//Configuration variables and Init variables
loadFiles();
loadTranslations();
var version=1.36;
var versionB=version;
var sessionID=Math.random();

var numberAttempts = 5;
var saveInServer = false;
var downloadJSON = true;

/*******************Game variables*******************************/
var b_size = 30;
var pattern_separation = 270;//Separate patters last attempt, before and after when all of them in screen
var startTime;
var experiment = 0;
var level = 0;
var done = 0;
var showInstructions = 'block';
var showAbout = 'block';
var block_actions = 0;
var currentAttempts = 0;
var cubes = [];//Save the possible blocks to place (Left panel)
var task_cubes = [];//Save the blocks place in the task (right  bottom panel)
var click_block = -1;//Save the last cube clicked (Left panel)
var x_floor = 220;//coorditanes where the task space start
var y_floor = 210;//coorditanes where the task space start
var blocks_per_floor = 1;//Number of blocks that can be placed horitonzally
var current_blocks = '';//Participant solving and using blocks 
var current_task = '';//Participant solving task panel bottom right
var creatingInstruction = [];//Creates the instruction for the next participant
var answers = [];//Store time, attempts and result for each task as a JSON
var survey = [];//Store time, attempts and result for each task as a JSON
//tasksB = tasks;//To restart to the begining.

//Colors to use for blocks
var block_colors=[
{"color":"empty","unselect":"","select":""},
{"color":"blue","unselect":"#0080ff","select":"#004d99"},
{"color":"orange","unselect":"#ff8000","select":"#994d00"},
{"color":"green","unselect":"#009926","select":"#004d13"},
{"color":"pink","unselect":"#ff66ff","select":"#ff1aff"},
{"color":"purple","unselect":"#5900b3","select":"#26004d"},
{"color":"brown","unselect":"#4d2600","select":"#1a0d00"}
]


function loadTranslations(){		
	space = getTranslation(" ");
	for(var i=0;i<tasks[0].conf.length;i++){
		translation = "";
		translate_sentence = tasks[0].conf[i].instruction;
		var words = translate_sentence.split(" ");
		for(var j=0;j<words.length;j++){
			word = getTranslation(words[j]);
			translation+=word;
			if(j<words.length-1)
				translation+=space;
		}
		tasks[0].conf[i].instruction=translation;
		tasks[0].conf[i].old_instruction=translation;
	}	
}
	
function getTranslation(word){
	new_word = "";
	for(var i=0;i<words.length;i++){
		if(words[i].word==word){
			tokens_pos=words[i].token;
			token_pos=tokens_pos.split(",");
			for(var j=0;j<token_pos.length;j++){
				new_word+=tokens[parseInt(token_pos[j])];
			}
			break;
		}			
	}
	return new_word;		
}