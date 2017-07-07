var b_size = 30;

var tasks = [{"blocks":"1","before":"0","after":"1"},
{"blocks":"3","before":"0","after":"3"},
{"blocks":"12","before":"00","after":"21"},
{"blocks":"133","before":"000","after":"331"},
{"blocks":"123","before":"000","after":"231"},
{"blocks":"2","before":"3","after":"3_2"},
{"blocks":"111","before":"333","after":"333_111"},
{"blocks":"22","before":"10102","after":"10102_20200"},
{"blocks":"2","before":"123456_123406_123006_120006_100000","after":"123456_123406_123006_122006_100000"},
{"blocks":"122","before":"1104","after":"1114_2200"},
{"blocks":"","before":"1","after":"0"},
{"blocks":"","before":"11_02","after":"11"},
{"blocks":"3","before":"334_330_300","after":"004"},
{"blocks":"","before":"2224_1111","after":"0004"},
{"blocks":"3","before":"111124","after":"000024_000030"}
]

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
var x_floor = 250;//coorditanes where the task space start
var y_floor = 200;//coorditanes where the task space start
var blocks_per_floor = 1;//Number of blocks that can be placed horitonzally
var current_blocks = '';//Participant solving and using blocks 
var current_task = '';//Participant solving task panel bottom right
var creatingInstruction = [];//Creates the instruction for the next participant
var newInstructions = [];//New instructions
var answers = [];//Store time, attempts and result for each task as a JSON

var instructions = [
	"wiku shau", 	
	"wiku kuta", 		
	"wiku koe koi wiku shau",
	"wiku kuta koi wiku kuta koi wiku shau",
	"wiku koe koi wiku kuta koi wiku shau",
	"wiku kuta neba koe",	
	"wiku shau neba kuta",
	"wiku koe neba shau",
	"wiku koe neba kuta",
	"wiku koe neba shau koi shau",
	"sheshi shau",
	"sheshi koe",
	"sheshi kuta",	
	"sheshi shau sheshi koe", 
	"sheshi shau wiku kuta neba koe"
	];
	//place blue
	//place green	
	//place orange then place blue 
	//place green then place green then place blue
	//place orange then place green then place blue	
	//place green over orange	
	//place blue over green
	//place orange over blue
	//Place orange over green
	//place orange over blue then place blue
	//remove blue	
	//remove orange	
	//remove green
	//remove blue remove orange
	//remove blue place green over orange
instructionsB =	instructions;

/*
Participant
task n: time, result, attempts
newInstructions
survey

answers=[	
		"participantinst":0,
		"tasks":[
			{"task":0,"result":1,"time":5,"Attempts":0},
			{"task":1,"result":1,"time":15,"Attempts":3}],
		"newinstructions":["we","wi","wi ku we"],
		"survey":"123234"
		];
*/


var tokens=[" ","a","e","i","o","u","wa","we","wi","wo","wu","ka","ke","ki","ko","ku","ta","te","ti","to","tu","sha","she","shi","sho","shu","ba","be","bi","bo","bu","na","ni","nu","ne","no","tsa","tsi","tsu","tse","tso"];

var block_colors=[
{"color":"empty","unselect":"","select":""},
{"color":"blue","unselect":"#0080ff","select":"#004d99"},
{"color":"orange","unselect":"#ff8000","select":"#994d00"},
{"color":"green","unselect":"#009926","select":"#004d13"},
{"color":"pink","unselect":"#ff66ff","select":"#ff1aff"},
{"color":"purple","unselect":"#5900b3","select":"#26004d"},
{"color":"brown","unselect":"#4d2600","select":"#1a0d00"}]


