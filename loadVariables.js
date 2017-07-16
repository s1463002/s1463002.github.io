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
		if (text === null) {
			//Error
		}
		else {
			tasks = JSON.parse(text);
		}
	});
	getFileFromServer("json/tokens.json", function(text) {
		if (text === null) {
			//Error
		}
		else {
			tokens = JSON.parse(text);
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