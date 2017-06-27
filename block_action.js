	function setCharAt(str,index,chr) {
		if(index > str.length-1) return str;
		return str.substr(0,index) + chr + str.substr(index+1);
	}

	function writeMessage(canvas, message) {
        var context = canvas.getContext('2d');
        context.clearRect(5, canvas.height-25, 125, 25);
        context.font = '14pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 5, canvas.height-10);
    }
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: Math.round(evt.clientX - rect.left),
          y: Math.round(evt.clientY - rect.top)
        };
    }
	
	function setCursorByID(id,cursorStyle) {
		var elem;
		if (document.getElementById &&
			(elem=document.getElementById(id)) ) {
			if (elem.style) elem.style.cursor=cursorStyle;
		}
	}
	////////////////////EVENTS/////////////////////////
	var c = document.getElementById('blocksCanvas');
	
	///////////////////EVENTS Blocks///////////////////    
    blocksCanvas.addEventListener('mousemove', function(e) {
		if(block_actions==1){
			e.target.style.cursor = 'not-allowed';
			return;
		} 
		
		//e.target.style.cursor = 'pointer'
		//e.target.style.cursor="url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur)";		
		
		var clickedX = e.pageX - this.offsetLeft;
		var clickedY = e.pageY - this.offsetTop;
		var message = clickedX + ',' + clickedY;
		
		if (clickedX > 620 && clickedX < 720 && clickedY > 320 && clickedY < 370) {
			return;
		}
		
		var selected = -1;
		for (var i = 0; i < cubes.length; i++) {
			if (clickedX < cubes[i].right && clickedX > cubes[i].left && clickedY > cubes[i].top && clickedY < cubes[i].bottom) {
				selected = i;
			}
		}
		
		var selected_task = -1;
		for (var i = 0; i < blocks_per_floor; i++) {
			if (clickedX >= x_floor+i*b_size-b_size/2 && clickedX < x_floor+b_size+i*b_size) {
				selected_task = i;
			}
		}				
		
		current_task = loadTask(blocksCanvas,current_task,selected_task);
		loadBlocks(blocksCanvas,current_blocks,selected,clickedX,clickedY);
		//writeMessage(blocksCanvas, message);
		writeMessage(blocksCanvas, numberAttempts-currentAttempts+' attempts left.');
		if(isShowButton('submit')==0 && tasks[level].after!=current_task)
			drawX(blocksCanvas,250,300);
    }, false);
	
	blocksCanvas.addEventListener('mouseout', function(e) {
		if(block_actions==1) return;
		
		e.target.style.cursor = 'move'
		
		//writeMessage(blocksCanvas, '');		
		loadBlocks(blocksCanvas,current_blocks);
		current_task = loadTask(blocksCanvas,current_task);
	}, false);
	
	blocksCanvas.addEventListener('mouseenter', function(e) {
		if(block_actions==1) return;
		
		blocksCanvas.setAttribute("style", "cursor: move; cursor: grab; cursor:-moz-grab; cursor:-webkit-grab;");
	}, false);
	
	
	blocksCanvas.addEventListener('mousedown', function (e) {
		if(block_actions==1) return;		
		
		blocksCanvas.setAttribute("style", "cursor: move; cursor: grabbing; cursor:-moz-grabbing; cursor:-webkit-grabbing;");
		
		var clickedX = e.pageX - this.offsetLeft;
		var clickedY = e.pageY - this.offsetTop;
    		   
		//Select a block and hold it
		if(click_block==-1){
			for (var i = 0; i < cubes.length; i++) {
				if (clickedX < cubes[i].right && clickedX > cubes[i].left && clickedY > cubes[i].top && clickedY < cubes[i].bottom) {
					click_block = i;
					loadBlocks(blocksCanvas,current_blocks,-1,clickedX,clickedY);
					current_task = loadTask(blocksCanvas,current_task);		
				}
			}			
		}	

		var selected_column = -1;
		for (var i = 0; i < blocks_per_floor; i++) {
			if (clickedX >= x_floor+i*b_size-b_size/2 && clickedX < x_floor+b_size+i*b_size) {
				selected_column = i;
			}
		}
		//Place a block in the task		
		if (click_block==-1 && selected_column!=-1) {//Remove a block in the task				
			var row = current_task.split("_");
			var removed = 0;
			for (var i = row.length-1 ; i >= 0 ; i--) {						
				for(var j=0; j<row[i].length;j++){
					if(removed==0 && selected_column==j && row[i].charAt(j)!='0'){
						current_blocks+=row[i].charAt(j);
						row[i] = setCharAt(row[i],j,"0");
						removed=1;
					}				
				}							
			}
			top_row = '';
			for(var i=0;i<blocks_per_floor;i++){
				top_row+='0';
			}
			current_task = '';
			for (var i = 0; i < row.length ; i++) {
				if(i==0 || row[i]!=top_row){
					if(current_task!='') current_task+='_';
					current_task+= row[i];
				}
			}			
			click_block = cubes.length;								
			current_task = loadTask(blocksCanvas,current_task);				
			loadBlocks(blocksCanvas,current_blocks,-1,clickedX,clickedY);				
		}		
				
	});
	
	blocksCanvas.addEventListener('mouseup', function (e) {		
		if(block_actions==1) return;				
		
		blocksCanvas.setAttribute("style", "cursor: move; cursor: grab; cursor:-moz-grab; cursor:-webkit-grab;");
		
		var clickedX = e.pageX - this.offsetLeft;
		var clickedY = e.pageY - this.offsetTop;
    		   
		var selected_column = -1;
		for (var i = 0; i < blocks_per_floor; i++) {
			if (clickedX >= x_floor+i*b_size-b_size/2 && clickedX < x_floor+b_size+i*b_size) {
				selected_column = i;				
			}
		}
		if(selected_column==-1){			
			if(click_block!=-1){
				showButton('submit',1);				
			}
			click_block = -1;
			loadBlocks(blocksCanvas,current_blocks,-1,clickedX,clickedY);
			current_task = loadTask(blocksCanvas,current_task);							
		}		
		//Place a block in the task		
		if (click_block!=-1 && selected_column!=-1) {
			showButton('submit',1);
			cur_blocks = '';
			for (var j = 0; j < current_blocks.length; j++) {					
				if(j!=click_block){
					cur_blocks += current_blocks.charAt(j);				
				}else{//100,	111_101_101
					var row = current_task.split("_");
					var placed = 0;
					for (var k = 0; k < row.length ; k++) {
						for(var n=0; n<row[k].length;n++){
							if(placed==0 && selected_column==n && row[k].charAt(n)=='0'){
								row[k] = setCharAt(row[k],n,current_blocks.charAt(j));
								placed = 1;		
							}	
							
						}							
					}
					current_task = '';
					for (var k = 0; k < row.length ; k++) {
						if(current_task!='') current_task+='_';
						current_task+= row[k];
					}
					if(placed==0){
						new_floor = '_'
						for (var k = 0; k < row[0].length ; k++) {
							if(selected_column==k){
								new_floor += current_blocks.charAt(j);
							}else{
								new_floor += '0';
							}
						}
						current_task+=new_floor;
					}
					
				}											
			}
			current_blocks = cur_blocks;			
			click_block=-1;
			loadBlocks(blocksCanvas,current_blocks,click_block,clickedX,clickedY);							
			current_task = loadTask(blocksCanvas,current_task);			
		}	
		setVariables();				
	});
	
	///////////////////LOAD/////////////////////////
	///////////////////////////////////////////////
		
	function loadInstruction() {
		document.getElementById("instruction").innerHTML = instructions[level];
	}
		
		
	function loadBlocks(canvas,blocks,selected, x_mouse, y_mouse){	
		if(selected === undefined) {
			selected = -1;
		}
		if(x_mouse === undefined) {
			x_mouse = -100;
		}
		if(y_mouse === undefined) {
			y_mouse = -100;
		}
		current_blocks = blocks;
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, b_size*5, canvas.height-25);
		
		
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = '#8c8c8c';
		context.moveTo(b_size*5,0);
		context.lineTo(b_size*5,canvas.height);
		context.stroke();
		
		context.moveTo(0,0);
		context.lineTo(canvas.width,0);
		context.stroke();
		
		context.lineWidth = 1;
		
		
		cubes = [];
		for (var i = 0; i < current_blocks.length; i++) {
			var current_block = current_blocks.charAt(i);
			block_color = block_colors[parseInt(current_block)];			
			color = (selected==i?block_color.select:block_color.unselect)			
			x = b_size + b_size*2.5*(i%2);
			y = b_size*2+b_size*i*1.2;
			tune = 10;

			cubes.push(drawCube(
				context,
				x+tune,//30
				y+tune,//60
				b_size,//30
				b_size,//30
				b_size,//30
				color,
				i
			));	
			if(click_block==i){
				drawCubeShadow(context,
				x+tune,//30
				y+tune,//60
				b_size,//30
				b_size,//30
				b_size,//30
				'#cccccc',
				i);
				
				drawCube(context,
				x_mouse,//30
				y_mouse,//60
				b_size,//30
				b_size,//30
				b_size,//30
				color,
				i);
			}			
		}			
	}

	function loadTask(canvas,level, selected, left){
		if(selected === undefined) {
			selected = -1;
		}
		if(left === undefined) {
			left = 0;
		}
		var context = canvas.getContext('2d');
		if(left==0)
			context.clearRect(b_size*5+left, 0, canvas.width-b_size*5, canvas.height);
		else
			context.clearRect(b_size*5+left, 0, canvas.width/2-b_size*5, canvas.height);
		
		cur_task = level;
		floor_size=3;
		floor_number = 0;
		count=0;
		
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = '#8c8c8c';
		context.moveTo(b_size*5,0);
		context.lineTo(b_size*5,canvas.height);
		context.stroke();
		
		context.moveTo(0,0);
		context.lineTo(canvas.width,0);
		context.stroke();
		
		context.lineWidth = 1;
		
		task_cubes=[];
		blocks_per_floor = 0;
		for (var i = 0; i < cur_task.length; i++) {
			var current_block = cur_task.charAt(i)
			if(floor_number==0 && current_block!='_'){
				task_cubes.push(drawCube(context,
					x_floor+b_size*i+left,
					y_floor+b_size*i/2,
					b_size,
					b_size,
					floor_size,
					selected==count?'#ffff00':'#404040',
					count*100));
				blocks_per_floor++;
			}
			if(current_block=='_'){
				floor_number++;
				count=0;
			}else if(current_block!='0'){	
				block_color = block_colors[parseInt(current_block)];
				color = block_color.unselect;
				task_cubes.push(drawCube(context,
					x_floor+b_size*count-(floor_number>0?b_size:0)+left,
					y_floor+b_size*count/2-floor_size-(floor_number*b_size)-(floor_number>0?b_size/2:0),
					b_size,
					b_size,
					b_size,
					color,
					floor_number+count*100));
			}			
			count++;
		}
		return cur_task;
		
	}
	
	//Submit//////////////////////////
	function drawX(canvas, x, y) {
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		
		ctx.strokeStyle = '#e60000';
		ctx.lineWidth = 10;
		ctx.moveTo(x - 30, y - 30);
		ctx.lineTo(x + 30, y + 30);

		ctx.moveTo(x + 30, y - 30);
		ctx.lineTo(x - 30, y + 30);
		ctx.stroke();
		ctx.lineWidth = 1;
		      
		ctx.font = '14pt Calibri';
		ctx.fillStyle = 'black';
		ctx.fillText('Incorrect', x+30,y);			
	}
	
	function drawO(canvas, x, y) {
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		
		var centerX = x;
		var centerY = y;
		var radius = 30;

		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		ctx.lineWidth = 10;
		ctx.strokeStyle = '#00b300';
		ctx.stroke();
		ctx.lineWidth = 1;
		
		ctx.font = '14pt Calibri';
		ctx.fillStyle = 'black';
		ctx.fillText('Correct', x+40,y);
	}

	function showButton(element,status) {
		var x = document.getElementById(element);
		if (status == 1) {
			x.style.display = 'block';
		} else {
			x.style.display = 'none';
		}
	}

	function isShowButton(element) {
		var x = document.getElementById(element);
		if (x.style.display == 'block') {
			return 1;
		}
		return 0;
	}
	
	function submitAnswer(){			
		showButton('submit',0);
		currentAttempts++;			
		if(tasks[level].after==current_task){				
			//writeMessage(blocksCanvas, 'Correct!');
			drawO(blocksCanvas,250,300);
			writeMessage(blocksCanvas,'');			
		}else{
			//writeMessage(blocksCanvas, 'Sorry its incorrect.');						
			drawX(blocksCanvas,250,300);
			writeMessage(blocksCanvas, numberAttempts-currentAttempts+' attempts left.');
		}
		//showVariables();
		setVariables();	
		if(currentAttempts>=numberAttempts || tasks[level].after==current_task){
			blockAndNext();
		}		
	}
	
	function submitAnswer2(){			
		if(creatingInstruction.length==0 || (creatingInstruction.length==1 && creatingInstruction[0]==' ')){
			alert("You need to write an instruction in order to submit.")
			return;
		}
			
		level++;
		
		var string = "";
		for (var i = 0; i < creatingInstruction.length; i++) {
			string+=creatingInstruction[i];
		}
		newInstructions.push(string.trim());
					
		if(level<tasks.length){			
			loadAllCanvas2();
			setVariables();	
			//showVariables();
		}else{
			level=tasks.length-1;
			experiment=3;
			setVariables();	
			//instructions = newInstructions;
			//window.open("experiment1.html","_self");			
			window.open("survey.html","_self");
		}	
	}
	
	function blockAndNext(){
		block_actions=1;
		done=1;
		
		if(tasks[level].after!=current_task){
			loadTask(blocksCanvas,tasks[level].after,-1,300);
		
			var context = blocksCanvas.getContext('2d');        
			context.font = '14pt Calibri';
			context.fillStyle = 'black';
			context.fillText('Correct', 455,210);			
			context.fillText('pattern:', 455,225);
		}		
		
		showButton('reset',0);
		showButton('submit',0);
		showButton('next',1);
		setVariables();			
	}
	
	function nextLevel(){
		level++;
		done=0;
		currentAttempts = 0;
		if(level<tasks.length){			
			setVariables();	
			loadAllCanvas();
		}else{
			level=0;
			experiment=2;
			showInstructions='block';
			setVariables();				
			window.open("experiment2.html","_self");
		}		
	}
	////////RUN LOAD/////////////////////////	
	function loadAllCanvas(){	
		var context = blocksCanvas.getContext('2d');
		context.clearRect(0, 0, blocksCanvas.width, blocksCanvas.height);
		
		block_actions=0;
		showButton('reset',1);
		showButton('submit',1);
		showButton('next',0);
		loadInstruction();
		loadBlocks(blocksCanvas,tasks[level].blocks);
		current_task = loadTask(blocksCanvas,tasks[level].before);		
		writeMessage(blocksCanvas, numberAttempts-currentAttempts+' attempts left.');		
	}	
	
	function loadAllCanvas2(){	
		printInstruction('',-1);
		var context = blocksCanvas.getContext('2d');
		context.clearRect(0, 0, blocksCanvas.width, blocksCanvas.height);
		
		block_actions=1;
		
		loadTask(blocksCanvas,tasks[level].before);
		loadTask(blocksCanvas,tasks[level].after,-1,300);
		loadBlocks(blocksCanvas,tasks[level].blocks);
		
		var context = blocksCanvas.getContext('2d');        
		context.font = '14pt Calibri';
		context.fillStyle = 'black';
		context.fillText('Before:', 170,210);			
		context.fillText('After:', 470,210);		
		
	}	
	
	function printInstruction(val,op){
		var newInstruction = document.getElementById("newInstruction");
		
		if(op==1){
			if(!(creatingInstruction.length>0 && val==' ' && creatingInstruction[creatingInstruction.length-1]==' '))
				creatingInstruction.push(val);
		}else if(op==0){
			creatingInstruction.pop();
		}else{
			creatingInstruction=[];
		}		
		newInstruction.innerHTML = "";
		for (var i = 0; i < creatingInstruction.length; i++) {
			if(i==creatingInstruction.length-1 && creatingInstruction[i]==' ')
				newInstruction.innerHTML += "_";
			else
				newInstruction.innerHTML += creatingInstruction[i];
		}
	}	
	
	function createKeyboard(){
		var n = 0;
		var space = 0;
		var backspace = 0;
		var kb = document.getElementById("keyboard");
		for (var i = 0; i < tokens.length; i++) {
			var val = tokens[i];
			if(val==' '){
				space=1;
			}else{
				n++;
				kb.innerHTML += '<button id="but'+i+'" style="width:40px;cursor:pointer;" onclick="printInstruction(\''+val+'\',1);">'+val+'</button>';
				if(n>tokens.length/3){
					if(backspace==0){
						kb.innerHTML += '<button id="butD" style="width:60px;cursor:pointer;" onclick="printInstruction(\'\',0);">Delete</button>';
						backspace=1;
					}
					kb.innerHTML += '<br/>';
					n=0;
				}
			}
			
		}	
		//kb.innerHTML += '<button id="submit" onclick="submitAnswer2();">Submit</button>';
		if(space==1)
			kb.innerHTML += '<br/><button id="but0" style="width:500px;cursor:pointer;" onclick="printInstruction(\' \',1);">Space</button>';
		
	}	
	
	function showInstructionPopUp(val){		
		showInstructions=val;
		document.getElementById('instructions').style.display = showInstructions;				
		setVariables();
	}
	
	//COOKIES
	function agreeEthics(){
		if(document.getElementById('agree').checked) { 
			experiment=1;
			setVariables();
			window.open("experiment1.html","_self");			
		} else { 
			alert('Please indicate that you have read and agree to the consent form'); return false;
		}
	}
	
	function showVariables(){
		
		alert(" experiment: "+experiment
			+"\n level: "+level
			+"\n done: "+done
			+"\n showInstructions: "+showInstructions
			+"\n block_actions: "+block_actions
			+"\n currentAttempts: "+currentAttempts
			+"\n cubes: "+ JSON.stringify(cubes)
			+"\n task_cubes: "+ JSON.stringify(task_cubes)
			+"\n click_block: "+click_block
			+"\n blocks_per_floor: "+blocks_per_floor
			+"\n current_blocks: "+current_blocks
			+"\n current_task: "+current_task
			+"\n creatingInstruction: "+creatingInstruction
			+"\n newInstructions: "+newInstructions
			+"\n instructions: "+instructions);
			
	}
	
	function setVariables(){
		localStorage.setItem("experiment", experiment.toString());
		localStorage.setItem("level", level.toString());
		localStorage.setItem("done", done.toString());
		localStorage.setItem("showInstructions", showInstructions);		
		localStorage.setItem("block_actions", block_actions.toString());
		localStorage.setItem("currentAttempts", currentAttempts.toString());
		localStorage.setItem("cubes", JSON.stringify(cubes));
		localStorage.setItem("task_cubes", JSON.stringify(task_cubes));
		localStorage.setItem("click_block", click_block.toString());
		localStorage.setItem("blocks_per_floor", blocks_per_floor.toString());
		localStorage.setItem("current_blocks", current_blocks);
		localStorage.setItem("current_task", current_task);
		localStorage.setItem("creatingInstruction", creatingInstruction);
		localStorage.setItem("newInstructions", newInstructions);
		localStorage.setItem("instructions", instructions);
		//document.cookie = "block_actions="+block_actions+";currentAttempts="+currentAttempts+";cubes="+JSON.stringify(cubes)+";task_cubes="+JSON.stringify(task_cubes)+";click_block="+click_block+";blocks_per_floor="+blocks_per_floor+";current_blocks="+current_blocks+";current_task="+current_task+";";		
	}
	
	function resetVariables(){
		//showVariables();
		localStorage.setItem("experiment", "0");
		localStorage.setItem("level", "0");
		localStorage.setItem("done", "0");
		localStorage.setItem("showInstructions", "block");		
		localStorage.setItem("block_actions", "0");
		localStorage.setItem("currentAttempts", "0");
		localStorage.setItem("cubes", "[]");
		localStorage.setItem("task_cubes", "[]");
		localStorage.setItem("click_block", "-1");
		localStorage.setItem("blocks_per_floor", "1");
		localStorage.setItem("current_blocks", "");
		localStorage.setItem("current_task", "");
		localStorage.setItem("creatingInstruction", "");
		localStorage.setItem("newInstructions", "");
		localStorage.setItem("instructions", instructionsB);	
		location.reload();		
	}
	
	function getVariables(){
		if (localStorage.getItem("level") === null) {			
			resetVariables();
			return;
		}		
		experiment = parseInt(localStorage.getItem("experiment"));
		level = parseInt(localStorage.getItem("level"));
		done = parseInt(localStorage.getItem("done"));
		showInstructions = localStorage.getItem("showInstructions");		
		block_actions = parseInt(localStorage.getItem("block_actions"));
		currentAttempts = parseInt(localStorage.getItem("currentAttempts"));
		cubes = JSON.parse(localStorage.getItem("cubes"));
		task_cubes = JSON.parse(localStorage.getItem("task_cubes"));
		click_block = parseInt(localStorage.getItem("click_block"));
		blocks_per_floor = parseInt(localStorage.getItem("blocks_per_floor"));
		current_blocks = localStorage.getItem("current_blocks");
		current_task = localStorage.getItem("current_task");
		creatingInstruction = localStorage.getItem("creatingInstruction").split(",");		
		newInstructions = localStorage.getItem("newInstructions").split(",");
		instructions = localStorage.getItem("instructions").split(",");
		
		var x = document.URL
		if(experiment==0 && x.indexOf("index")==-1){
			window.open("index.html","_self");
		}
		if(experiment==1){
			if(x.indexOf("experiment1")==-1){
				window.open("experiment1.html","_self");
			}
			if(done==1){
				nextLevel();
			}
		}		
		if(experiment==2 && x.indexOf("experiment2")==-1){
			window.open("experiment2.html","_self");
		}
		if(experiment==3 && x.indexOf("survey")==-1){
			window.open("survey.html","_self");
		}
		if(experiment==4 && x.indexOf("done")==-1){
			window.open("done.html","_self");
		}

		if(experiment!=0)
			showInstructionPopUp(showInstructions);
		//showVariables();
		
		/*var cookies = document.cookie.split(";");
		block_actions = parseInt(cookies[0]);
		currentAttempts = parseInt(cookies[1]);
		cubes = JSON.parse(cookies[2]);
		task_cubes = JSON.parse(cookies[3]);
		click_block = parseInt(cookies[4]);
		blocks_per_floor = parseInt(cookies[5]);
		current_blocks = cookies[6];
		current_task = cookies[7];*/
	}

	//loadAllCanvas();
	