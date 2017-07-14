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
		if(isShowButton('submit')==0 && tasks[0].conf[level].after!=current_task)
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
		document.getElementById("instruction").innerHTML = tasks[0].conf[level].instruction;
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

	function loadTask(canvas,lvl, selected, left){
		if(selected === undefined) {
			selected = -1;
		}
		if(left === undefined) {
			left = 0;
		}
		var context = canvas.getContext('2d');
		if(left==0)
			context.clearRect(b_size*5, 0, canvas.width, canvas.height);
		else
			context.clearRect(b_size*5+left, 0, canvas.width, canvas.height);
		
		cur_task = lvl;
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
		progress(canvas,-1);
			
		return cur_task;
		
	}
	
	function progress(canvas,current){
		var context = canvas.getContext('2d');
		for(var i = 0; i < tasks[0].conf.length; i++){			
			color='#404040';			
			if(answers.length>i){
				if(answers[i].result==1)
					color='#00b300';
				else
					color='#e60000';
			}
			if(answers.length==i && current!=-1){
				if(current==1)
					color='#00b300';
				else
					color='#e60000';				
			}
			drawCube(context,
					b_size*6+(i*b_size/5*4),
					canvas.height,
					b_size/3,
					b_size/3,
					b_size/3,
					color)									
			
		}
		
	}
	
	//Submit//////////////////////////
	function drawX(canvas, x, y) {
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		
		ctx.strokeStyle = '#e60000';
		ctx.lineWidth = 10;
		ctx.lineCap = 'round';
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
		
		ctx.strokeStyle = '#00b300';
		ctx.lineWidth = 10;
		ctx.lineCap = 'round';
		ctx.moveTo(x - 30, y);
		ctx.lineTo(x - 15, y + 30);

		ctx.moveTo(x - 15, y +30);
		ctx.lineTo(x + 30, y - 30);
		ctx.stroke();
		ctx.lineWidth = 1;
		
		ctx.font = '14pt Calibri';
		ctx.fillStyle = 'black';
		ctx.fillText('Correct', x+40,y);		
		
	}
	
	function drawO1(canvas, x, y) {
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
		var result = false;
		for(var i=0;i<tasks[0].conf[level].after.length;i++){
			if(tasks[0].conf[level].after[i]==current_task){
				result=true;
				break;
			}
				
		}
		if(result){				
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
		if(currentAttempts>=numberAttempts || result){			
			blockAndNext();
		}		
	}
	
	function submitAnswer2(){			
		if(creatingInstruction.length==0 || (creatingInstruction.length==1 && creatingInstruction[0]==' ')){
			alert("You need to write an instruction in order to submit.")
			return;
		}
							
		var string = "";
		for (var i = 0; i < creatingInstruction.length; i++) {
			string+=creatingInstruction[i];
		}
		tasks[0].conf[level].instruction=string.trim();
					
		level++;
		
		if(level<tasks[0].conf.length){			
			loadAllCanvas2();
			setVariables();	
			//showVariables();
		}else{
			level=tasks[0].conf.length-1;
			experiment=3;
			setVariables();	
			//window.open("experiment1.html","_self");			
			window.open("survey.html","_self");
		}	
	}
	  
	var index=0;
	function loop(){
		if(index>=tasks[0].conf[level].after.length)
			index=0;
		loadTask(blocksCanvas,tasks[0].conf[level].after[index],-1,pattern_separation*2);
		index++;
	
		var context = blocksCanvas.getContext('2d');        
		context.font = '14pt Calibri';
		context.fillStyle = 'black';

			
		context.fillText('Correct', 690,230);	
		context.fillText('pattern:', 690,245);	
	}
	
	function blockAndNext(){
		block_actions=1;
		done=1;
			
		saveTask();
		
		var result = false;
		for(var i=0;i<tasks[0].conf[level].after.length;i++){
			if(tasks[0].conf[level].after[i]==current_task){
				result=true;
				break;
			}
				
		}
		if(!result){
			loadTask(blocksCanvas,tasks[0].conf[level].before,-1,pattern_separation);
			loadBlocks(blocksCanvas,tasks[0].conf[level].blocks);
			// request new frame
			loop();
			animation = setInterval(loop,1000);				
			
			var context = blocksCanvas.getContext('2d');        
			context.font = '14pt Calibri';
			context.fillStyle = 'black';
			
			context.fillText('Your last', 160,230);			
			context.fillText('pattern:', 160,245);
			
			context.fillText('Start', 430,230);			
			context.fillText('pattern:', 430,245);		
			
			//progress(blocksCanvas,0);		
		}//else
		progress(blocksCanvas,-1);		
		
		if(level==tasks[0].conf.length-1){
			var context = blocksCanvas.getContext('2d');        
			context.font = '18pt Calibri';
			context.fillStyle = '#002966';
			
			context.fillText('Good job!', b_size*6,blocksCanvas.height-45);			
			context.fillText('Now for part 2!', b_size*6,blocksCanvas.height-25);	
		}
		showButton('reset',0);
		showButton('submit',0);
		showButton('next',1);
		setVariables();			
	}
	
	function saveTask(){
		var timeDiff = new Date() - startTime;
		timeDiff /= 1000;
		// get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
		var task_json = {};
		var seconds = Math.round(timeDiff % 60);
		task_json.idParent=tasks[0].id;
		task_json.task=level;
		task_json.time=seconds;
		
		var result = false;
		for(var i=0;i<tasks[0].conf[level].after.length;i++){
			if(tasks[0].conf[level].after[i]==current_task){
				result=true;
				break;
			}
				
		}
		if(result){
			task_json.result=1;	
		}else{
			task_json.result=0;
		}
		task_json.attempts=currentAttempts;
		//alert(JSON.stringify(task_json))
		
		answers.push(task_json);
		//alert(JSON.stringify(answers))
		
	}
	
	function nextLevel(){
		try{
			clearInterval(animation);
		}catch(Exception){}			
		
		//saveTask();
		
		level++;
		done=0;
		currentAttempts = 0;
		if(level<tasks[0].conf.length){			
			setVariables();	
			loadAllCanvas();
		}else{
			level=0;
			experiment=2;
			showInstructions='block';
			showAbout='none';
			setVariables();				
			window.open("experiment2.html","_self");
		}		
	}
	
	function escapeRegExp(str) {
		return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}
	function replaceAll(str, find, replace) {
		return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}
	
	function removeSpecialCharacters(str){		
		str = replaceAll(str,'"','´');
		str = replaceAll(str,"'","´");
		str = replaceAll(str,",",".");
		return str;
	}

	function submitSurvey(){	
		survey=[];
		survey.push("Gender:"+document.getElementById("gender").value);
		survey.push("Age:"+document.getElementById("age").value);
		survey.push("School:"+document.getElementById("school").value);
		survey.push("Enjoy:"+document.getElementById("enjoy").value);
		survey.push("Difficult:"+document.getElementById("difficult").value);
		survey.push("Feedback:"+removeSpecialCharacters(document.getElementById("feedback").value));
		for(var i=1;i<words.length;i++){
			survey.push(words[i].word+"("+getTranslation(words[i].word)+"):"+removeSpecialCharacters(document.getElementById("word"+i).value));
		}
						
		var game_json = {};
		game_json.answers = answers;
		game_json.tasks = tasks;
		game_json.survey = survey;
		
		//alert(JSON.stringify(game_json))						
		if(saveInServer){
		    try{
			var chunker = new ChunkWs("ws://somata.inf.ed.ac.uk/chunks/ws",function(a,b,c) {
			    console.log("Chunker callback, args: a=" + a + ", b=" + b + ", c=" + JSON.stringify(c));
			    if(b==true) {
				throw ("Error in sending websocket message, response was " + JSON.stringify(c));
			    }
			});
			  chunker.sendChunk(game_json);			
			}catch(e){
				downloadJSON=true;
			    alert(e);
			    throw e;
			}
		}
		if(downloadJSON){
			download("shrdlevo.json",JSON.stringify(game_json));
		}
		//experiment=4;
		//setVariables();	
		//window.open("done.html","_self");
	}
	
	function download(fileNameToSaveAs, textToWrite) {
	  /* Saves a text string as a blob file*/  
	  var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
		  ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
		  ieEDGE = navigator.userAgent.match(/Edge/g),
		  ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

	  if (ie && ieVer<10) {
		console.log("No blobs on IE ver<10");
		return;
	  }

	  var textFileAsBlob = new Blob([textToWrite], {
		type: 'text/plain'
	  });

	  if (ieVer>-1) {
		window.navigator.msSaveBlob(textFileAsBlob, fileNameToSaveAs);

	  } else {
		var downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = function(e) { document.body.removeChild(e.target); };
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		downloadLink.click();
	  }
	}

	////////RUN LOAD/////////////////////////		
	function loadAllCanvas(){			
		var context = blocksCanvas.getContext('2d');
		context.clearRect(0, 0, blocksCanvas.width, blocksCanvas.height);
		
		startTime = new Date();		 		 		
		 
		block_actions=0;
		showButton('reset',1);
		showButton('submit',1);
		showButton('next',0);
		loadInstruction();
		loadBlocks(blocksCanvas,tasks[0].conf[level].blocks);
		current_task = loadTask(blocksCanvas,tasks[0].conf[level].before);		
		writeMessage(blocksCanvas, numberAttempts-currentAttempts+' attempts left.');		
	}	
	
	function loadAllCanvas2(){	
		printInstruction('',-1);
		var context = blocksCanvas.getContext('2d');
		context.clearRect(0, 0, blocksCanvas.width, blocksCanvas.height);
		
		block_actions=1;
		
		startTime = new Date();
		
		loadTask(blocksCanvas,tasks[0].conf[level].before);
		loadTask(blocksCanvas,tasks[0].conf[level].after[0],-1,pattern_separation);
		loadBlocks(blocksCanvas,tasks[0].conf[level].blocks);
		
		var context = blocksCanvas.getContext('2d');        
		context.font = '14pt Calibri';
		context.fillStyle = 'black';
		context.fillText('Before:', 160,230);			
		context.fillText('After:', 460,230);		
		
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
		if(level==0){
			startTime = new Date();	
		}
		showInstructions=val;
		document.getElementById('instructions').style.display = showInstructions;				
		setVariables();
	}
	
	function showAboutPopUp(val){	
		showAbout=val;
		document.getElementById('about1').style.display = showAbout;				
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
		
		alert("VERSION: "+version
			+"\n experiment: "+experiment
			+"\n level: "+level
			+"\n done: "+done
			+"\n showInstructions: "+showInstructions
			+"\n showAbout: "+showAbout			
			+"\n block_actions: "+block_actions
			+"\n currentAttempts: "+currentAttempts
			+"\n cubes: "+ JSON.stringify(cubes)
			+"\n task_cubes: "+ JSON.stringify(task_cubes)
			+"\n click_block: "+click_block
			+"\n blocks_per_floor: "+blocks_per_floor
			+"\n current_blocks: "+current_blocks
			+"\n current_task: "+current_task
			+"\n creatingInstruction: "+creatingInstruction
			+"\n tasks: "+JSON.stringify(tasks)
			+"\n answers: "+JSON.stringify(answers)
			+"\n survey: "+survey.toString()		
			);
			
	}
	
	function setVariables(){		
		localStorage.setItem("version", version.toString());
		localStorage.setItem("experiment", experiment.toString());
		localStorage.setItem("level", level.toString());
		localStorage.setItem("done", done.toString());
		localStorage.setItem("showInstructions", showInstructions);	
		localStorage.setItem("showAbout", showAbout);			
		localStorage.setItem("block_actions", block_actions.toString());
		localStorage.setItem("currentAttempts", currentAttempts.toString());
		localStorage.setItem("cubes", JSON.stringify(cubes));
		localStorage.setItem("task_cubes", JSON.stringify(task_cubes));
		localStorage.setItem("click_block", click_block.toString());
		localStorage.setItem("blocks_per_floor", blocks_per_floor.toString());
		localStorage.setItem("current_blocks", current_blocks);
		localStorage.setItem("current_task", current_task);
		localStorage.setItem("creatingInstruction", creatingInstruction);
		localStorage.setItem("tasks",  JSON.stringify(tasks));
		localStorage.setItem("answers", JSON.stringify(answers));
		localStorage.setItem("survey", survey.toString());
		
		//document.cookie = "block_actions="+block_actions+";currentAttempts="+currentAttempts+";cubes="+JSON.stringify(cubes)+";task_cubes="+JSON.stringify(task_cubes)+";click_block="+click_block+";blocks_per_floor="+blocks_per_floor+";current_blocks="+current_blocks+";current_task="+current_task+";";		
	}
	
	function resetVariables(){
		//showVariables();
		
		localStorage.setItem("version", versionB.toString());
		localStorage.setItem("experiment", "0");
		localStorage.setItem("level", "0");
		localStorage.setItem("done", "0");
		localStorage.setItem("showInstructions", "block");		
		localStorage.setItem("showAbout", "block");				
		localStorage.setItem("block_actions", "0");
		localStorage.setItem("currentAttempts", "0");
		localStorage.setItem("cubes", "[]");
		localStorage.setItem("task_cubes", "[]");
		localStorage.setItem("click_block", "-1");
		localStorage.setItem("blocks_per_floor", "1");
		localStorage.setItem("current_blocks", "");
		localStorage.setItem("current_task", "");
		localStorage.setItem("creatingInstruction", "");
		localStorage.setItem("tasks", JSON.stringify(tasksB));	
		localStorage.setItem("answers", "[]");
		localStorage.setItem("survey", "[]");		
		location.reload();		
	}
	
	function getVariables(){
		if (localStorage.getItem("version") === null || localStorage.getItem("version")!=version.toString()){
			resetVariables();
		}		
		version = parseFloat(localStorage.getItem("version"));
		experiment = parseInt(localStorage.getItem("experiment"));
		level = parseInt(localStorage.getItem("level"));
		done = parseInt(localStorage.getItem("done"));
		showInstructions = localStorage.getItem("showInstructions");		
		showAbout = localStorage.getItem("showAbout");				
		block_actions = parseInt(localStorage.getItem("block_actions"));
		currentAttempts = parseInt(localStorage.getItem("currentAttempts"));
		cubes = JSON.parse(localStorage.getItem("cubes"));
		task_cubes = JSON.parse(localStorage.getItem("task_cubes"));
		click_block = parseInt(localStorage.getItem("click_block"));
		blocks_per_floor = parseInt(localStorage.getItem("blocks_per_floor"));
		current_blocks = localStorage.getItem("current_blocks");
		current_task = localStorage.getItem("current_task");
		creatingInstruction = localStorage.getItem("creatingInstruction").split(",");			
		tasks = JSON.parse(localStorage.getItem("tasks"));
		answers = JSON.parse(localStorage.getItem("answers"));
		survey = (localStorage.getItem("survey")).split(",");			

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

		if(experiment!=0 && experiment<3){
			showInstructionPopUp(showInstructions);
			showAboutPopUp(showAbout);
		}
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

	var text;
	function onFileSelected(event) {
	  var selectedFile = event.target.files[0];
	  var reader = new FileReader();

	  reader.onload = function(event) {
		text = event.target.result;
		json = JSON.parse(text);
		
		answers = json.answers;
		tasks = json.tasks;
		survey = json.survey;
		
		setVariables();
		location.reload();	
	  };

	  reader.readAsText(selectedFile);
	}
