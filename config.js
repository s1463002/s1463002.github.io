var tasks;
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        myObj = JSON.parse(this.responseText);
        tasks = myObj;
    }
};
xmlhttp.open("GET", "tasks.json", true);
xmlhttp.send();

//First position is used to denote an space with " " or a word "a" or nothing "". (No spaces at the beginig or end of sentences).
var tokens=[" ","wa","wi","wu","we","wo","ka","ku","ke","ko","ta","ti","te","to","to","ba","bi","bu","bo","na","ni"];
var words=[
	{"word":" ","token":"0"},
	{"word":"add","token":"2,10"},
	{"word":"remove","token":"15,8"},
	{"word":"fill","token":"1,7"},
	{"word":"on","token":"19,17"},
	{"word":"all","token":"2,20"},
	{"word":"blue","token":"5,11"},
	{"word":"orange","token":"9,10"}
]
var block_colors=[
{"color":"empty","unselect":"","select":""},
{"color":"blue","unselect":"#0080ff","select":"#004d99"},
{"color":"orange","unselect":"#ff8000","select":"#994d00"},
{"color":"green","unselect":"#009926","select":"#004d13"},
{"color":"pink","unselect":"#ff66ff","select":"#ff1aff"},
{"color":"purple","unselect":"#5900b3","select":"#26004d"},
{"color":"brown","unselect":"#4d2600","select":"#1a0d00"}
]
//Configuration variables and Init variables
loadTranslations();
var b_size = 30;
var startTime;
var experiment = 0;
var level = 0;
var done = 0;
var showInstructions = 'block';
var showAbout = 'block';
var block_actions = 0;
var numberAttempts = 5;
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
tasksB = tasks;//To restart to the begining.

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