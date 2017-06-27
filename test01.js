var b_size = 30;

var tasks = [{"blocks":"1","before":"0","after":"1"},
{"blocks":"12","before":"00","after":"21"},
{"blocks":"","before":"1","after":"0"},
{"blocks":"22","before":"10102","after":"10102_20200"},
{"blocks":"","before":"123_120_100","after":"000"},
{"blocks":"2","before":"123456_123406_123006_120006_100000","after":"123456_123406_123006_122006_100000"}]

var experiment = 0;
var level = 0;
var done = 0;
var showInstructions = 'block';
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

var instructions = [
	"wiku shau netse", 	
	"wiku kuta netse koi shau netse",
	"sheshi shau netse", 
	"wiku koe netse neba ketsa shau netse",
	"sheshi ketsa netse",
	"wiku koe netse neba kuta netse"
	];
	//place blue block
	//remove blue block
	//place green block and blue block
	//place orange block over all blue block
	//remove all block
	//Place orange block over green block
instructionsB =	instructions;

var tokens=[" ","a","e","i","o","u","wa","we","wi","wo","wu","ka","ke","ki","ko","ku","ta","te","ti","to","tu","sha","she","shi","sho","shu","ba","be","bi","bo","bu","na","ni","nu","ne","no","tsa","tsi","tsu","tse","tso"];

var block_colors=[
{"color":"empty","unselect":"","select":""},
{"color":"blue","unselect":"#0080ff","select":"#004d99"},
{"color":"orange","unselect":"#ff8000","select":"#994d00"},
{"color":"green","unselect":"#009926","select":"#004d13"},
{"color":"pink","unselect":"#ff66ff","select":"#ff1aff"},
{"color":"purple","unselect":"#5900b3","select":"#26004d"},
{"color":"brown","unselect":"#4d2600","select":"#1a0d00"}]


