const widgets = require("widget");
const tabs = require("tabs");
const panels = require("panel");
const data = require('self').data;
var {Cc, Ci} = require("chrome");
var pageWorkers = require("page-worker");	
var pageMod = require("page-mod");
var ss = require("simple-storage"); //Storage
var sidebarOpen = false;
var scrappy;
var NEWLINE = "\n";
//TODO find a bette way to do this
//https://jetpack.mozillalabs.com/sdk/1.0b5/docs/packages/addon-kit/docs/tabs.html#attach(options)
var pageModWorker;
var DEBUG = true;
var addonIsEnabled = false;
function toggleActivation()
{
	addonIsEnabled = !addonIsEnabled;
	return addonIsEnabled;
}
Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};

function toggle() {
		if(!addonIsEnabled)
		{
			toggleActivation();
			enableAddon();
		}	
		else
		{
			toggleActivation();
			disableAddon();
	}
}

function displayAddon(){
	if(addonIsEnabled)
		enableAddon();
}

var widget = widgets.Widget({
	id: "scrappyToggle",
	label: "Open Scrappy",
	contentURL: "http://www.stanford.edu/~sholbert/scrappy/scrappy.ico",
	onClick: toggle,

});

tabs.on('ready', displayAddon);


function enableAddon()
{
	pageModWorker = tabs.activeTab.attach({
			contentScriptFile: [data.url('jquery-1.7.1.js'),
						data.url('jquery-ui-1.8.17.progressbar.min.js'),
						data.url('scrappyhtml.js'),
						data.url('datamgr.js'),
						data.url('scrapemgr.js'),
						data.url('scrappyview.js'),
						data.url('scrappy.js'),
						data.url('scrappyCss.js')
						],
			//Event handler 
			onMessage: function(data){
				
				console.log('[enableAddon]' + data);
				var message = eval(data);
		
				//unwrap from json array - stringify hack!!
				message = message[0];			
				if(message.type=='show'){					
					addonIsEnabled = true;
				}
				//when the user clicks save on selecting links
				else if(message.type == 'link')
				{
					storeLinkData(message.data);
					this.postMessage('Saved Links!');
				}
				else if(message.type == 'state')
				{
					storeState(message.data);
				}
				//when the user clicks save after selecting content
				else if(message.type == 'content')
				{
					storeContentTemplate(message.data);
					this.postMessage('Saved Content Template!');
				}
				else if(message.type == 'scrape')
				{
					
					ss.storage.file_type =message.data;
					commenceScraping();
				}
				else if(message.type == 'disabledAddon')
				{
					console.log('[main.js] disable addon message recieved from scrappy.js');					
					toggleActivation();
					pageModWorker.destroy();
				}
				else
					{
					console.log('[pagemodworker onMessage] Unknown message seen:' + message.type);
					error();
					}
				}

		});
		if(getState()==null || getState()==undefined) pageModWorker.postMessage('0');		
		else pageModWorker.postMessage(getState());	
}

function disableAddon()
{
	console.log('[main.js] disableAddon');
	pageModWorker.postMessage('disable');
	pageModWorker.destroy();
}
function storeLinkData(data)
{
	ss.storage.linkData = data;
}
function storeState(data){
	ss.storage.state = data;
}
function storeContentTemplate(data)
{
	ss.storage.contentTemplate = data;
}

function commenceScraping()
{
	//make sure we have this data
	if(!hasContentTemplate()) pageModWorker.postMessage('Need content template!');
	else if(!hasLinkData()) pageModWorker.postMessage('Need Links to Scrape!');
	else scrape();
}

//Assume we have to data here
function getLinkData()
{
	return ss.storage.linkData;
}
function getState(){
	return ss.storage.state;
}
function getContentTemplate()
{
	return ss.storage.contentTemplate;
}

function hasLinkData(){return 'linkData' in ss.storage;}
function hasContentTemplate(){return 'contentTemplate' in ss.storage;}

//storeContentTemplate(jsonArray);
function writeToFile(text,dialog){
	var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
	                   .getService(Ci.nsIWindowMediator);
	var window = wm.getMostRecentWindow(null);
	const nsIFilePicker = Ci.nsIFilePicker;
	var fp = Cc["@mozilla.org/filepicker;1"]
	           .createInstance(nsIFilePicker);
	fp.init(window, dialog, nsIFilePicker.modeSave);
	fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);
	var file;
	var path;
	var rv = fp.show();
	if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
  	file = fp.file;
 	 // Get the path as string. Note that you usually won't 
  	// need to work with the string paths.
  	path = fp.file.path;
	  // work with returned nsILocalFile...
	}

	var dirService = Cc["@mozilla.org/file/directory_service;1"].
	                 getService(Ci.nsIProperties);
	var homeDirFile = dirService.get("Home", Ci.nsIFile); // returns an nsIFile object
	var homeDir = homeDirFile.path;
//	var file = Cc["@mozilla.org/file/local;1"].
	        //   createInstance(Ci.nsILocalFile);
//	file.initWithPath(homeDir+"/scrape.json");


// file is nsIFile, data is a string
	var foStream = Cc["@mozilla.org/network/file-output-stream;1"].
	               createInstance(Ci.nsIFileOutputStream);
	 
	// use 0x02 | 0x10 to open file for appending.
	foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);
	// write, create, truncate
	// In a c file operation, we have no need to set file mode with or operation,
	// directly using "r" or "w" usually.
	 
	// if you are sure there will never ever be any non-ascii text in data you can
	// also call foStream.writeData directly
	var converter = Cc["@mozilla.org/intl/converter-output-stream;1"].
	                createInstance(Ci.nsIConverterOutputStream);
	converter.init(foStream, "UTF-8", 0, 0);
	converter.writeString(text);
	converter.close(); // this closes foStream
	console.log(converter);

}

/*  function getContent()
	Input: JSON array of "data" objects
	Action: Scapes the given list of web pages and augments the objects with this content	
	Data objects have the following fields at this point: name, path	
*/
var numThreadsReturned;
var allScrapedData;
//Number of threads to spawn at a time
var THREAD_BLOCK_SIZE = 50;
function scrape()
{
	numThreadsReturned = 0;
	allScrapedData = "";
	startWorkers();
}

function startWorkers()
{

	var linkData = getLinkData();
		
	//Case 1, we have finished all of the scraping
	if(numThreadsReturned == linkData.length)
	{
		saveFile(allScrapedData);
	}
	//By now we have waited for a block of threads to return (so none are currently running <- double check)
	else if(numThreadsReturned % THREAD_BLOCK_SIZE == 0)
	{
				
		//Start at the next spot (1 -> 0 indexing implicitly adds 1)
		var currBaseIndex = numThreadsReturned;
		
		//Figure out how many links to scrape now
		var numScrapesLeft = linkData.length - currBaseIndex;
		var numThreadsToCreate = Math.min(THREAD_BLOCK_SIZE, numScrapesLeft);
	
		console.log("Number of threads to create: " + numThreadsToCreate);
		//Get the content tepmlate
		var contentTemplate = getContentTemplate();

		console.log('Starting a new block of threads: currIndex ' + currBaseIndex + '    numThreadsCreating ' + numThreadsToCreate);
		for(var i=0; i< numThreadsToCreate ; i++)
		{		
			//For each link get the requested data
			console.log("Spawning thread " + i);
			createWorker(linkData[currBaseIndex + i].url, contentTemplate);
		}
	}
	//If we haven't finished a block, continue;
	else
	{
		console.log("Thread finished, waiting for block.");
	}
}


function createWorker(url, contentTemplate)
{		
		//Spawn off a new page worker
		var worker = pageWorkers.Page({
		  contentURL: url,
		  contentScriptFile: [data.url('jquery-1.6.1.min.js'),
								data.url('getContent.js')],
		});
				
		//Talking with the content script
		//Send arguments
		worker.port.emit("receiveArguments",contentTemplate.clone());
		
		//Receive results
		worker.port.on("return", function(currScrapeData){
			
			//Log
			if(DEBUG) console.log("JSON returned from mining: " + currScrapeData);
			
			//TODO: Fix race condition
			//Increment the nubmer of threads that have finished (mark this thread as having finished)
			numThreadsReturned++;
			
			//Save data
			allScrapedData = appendData(allScrapedData, currScrapeData);			
			
			//Update visualization
			updateProgressVisualization();
			
			//Tell the master thread controller that this thread is done
			startWorkers();
			
			//Self Destruct
			worker.destroy();
		});

		
}

//Update finished
function updateProgressVisualization()
{
	var numFinished = numThreadsReturned;
	var numTotal = getLinkData().length;
	
	var percentComplete = (Math.floor((numFinished/numTotal)* 100) ).toString();
	var scrapeProgressMessage = 'scrape_progress_' + percentComplete;
	
	//if the user hasn't closed the addon
	if(pageModWorker != null) pageModWorker.postMessage(scrapeProgressMessage);
	else console.log('[updateProgressVisualization] User closed the addon so the sending progress bar message canceled');
	
}
//Makes a copy of the object
function copy(object)
{
	return eval(JSON.stringify(object));
}
//Takes in the results from one thread to append current data of the scrape
function appendData(allScrapedData, currScrapeData)
{
	//if it is the first element dont put a comma before
	if(allScrapedData == "") 
		return currScrapeData;
	else 
		return allScrapedData + " , \n" + currScrapeData;
}

//Save to file (open save file dialog box) (user chooses file name)
function saveFile(data)
{
	var scrapeCSV = ss.storage.file_type.indexOf("csv")>=0;
	var scrapeJSON =ss.storage.file_type.indexOf("json")>=0;
	console.log(ss.storage.file_type);
	if(scrapeJSON){
  	jsondata = "scrape = [ " + data + " ];";
		if(scrapeJSON) writeToFile(jsondata, "Save JSON File");
	}
	if(scrapeCSV){
		csvData = convertToCSV(eval("[ " + data + " ]"));
		storeState('0');
		for (var i = 0; i < csvData.length; i++){ 
 			if(csvData[i]!=null)
 				writeToFile(csvData[i],"Save CSV File");
  	} 
  }
}




//CSV CONVERSION:
function convertToCSV(scrapedData)
	{
		var headerRow = getHeaderRow(scrapedData);
		var files = displayDataRows(scrapedData, headerRow);
		return files;
	}
	
	function getHeaderRow(scrapedData)
	{
		var headers = new Array();
		var dataRow = scrapedData[0];
		for(var i=0; i < dataRow.length; i++)
		{
			headers[i] = dataRow[i].name;
		}
		
		return headers;
	}
	
	function displayDataRows(scrapedData, headerRow)
	{
		var files = new Array();
		
		var mainFile = "";
		
		var tableCols = new Array();
		
		for(var i=0; i < scrapedData.length; i++)
		{
			mainFile += '"' + (i+1) + '"';
			var data = scrapedData[i];
			for(var j=0; j < data.length; j++)
			{
				var value = data[j].data;
				
				if(isArray(value)){
					//alert(j);
					if(files[j+1] == null){
						var headers = value[0];
						var headerString = '"key",';
						tableCols[j] = "exists";
						for(var k = 0; k < headers.length; k++){
							headerString += encloseInQuotes(headers[k]);
							if(k < headers.length - 1) headerString += ',';
						}
						files[j+1] = headerString + NEWLINE;
					} else {
						files[j+1] += NEWLINE;
					}
					for(var k=1; k < value.length; k++){
						var row = value[k];
						files[j+1] += '"' + (i+1) + '",';
						for (var l = 0; l < row.length; l++){
							files[j+1] += encloseInQuotes(row[l]);
							if(l < row.length - 1) files[j+1] += ",";	
						}
						if(k < value.length - 1) files[j+1] += NEWLINE;
					}
				} else if(value.length > 0) {
					mainFile += ',' + encloseInQuotes(value);
				}
				
			}
			
			//newline for all lines except for the last
			if(i < scrapedData.length - 1) mainFile += NEWLINE;			
		}	
		
		var mainHeaderString = '"id"';
		for(var i = 0; i < headerRow.length; i++){
			if(tableCols[i] == null){
				mainHeaderString += ',' + encloseInQuotes(headerRow[i]);
			}
		}
		mainHeaderString += NEWLINE;
		
		mainFile = mainHeaderString + mainFile;
		files[0] = mainFile;
		return files;
	}
	
	function isArray(obj){
		if (obj instanceof Array) {
			return true;
		} else {
			return false;
		}
	}
	
	function encloseInQuotes(str)
	{
		if(str == null) return '"' + str + '"';
		return '"'+ str.replace(/\"/g, '""') +'"';
	}
/* backup
var widget = widgets.Widget({
	id: "divShower",

	label: "Show divs",
	contentURL: "http://www.stanford.edu/~sholbert/scrappy/scrappy.ico",
	onClick: function(clickedItem) {
		pageModWorker = tabs.activeTab.attach({
			contentScriptFile: [data.url('jquery-1.6.1.min.js'),
						data.url('scrappy.js'),
						data.url('scrappyCss.js')],
			
			//Event handler 
			onMessage: function(data){
				
				console.log(data);
				var message = eval(data);
		
				//unwrap from json array - stringify hack!!
				message = message[0];				
				
				//when the user clicks save on selecting links
				if(message.type == 'link')
				{
					storeLinkData(message.data);
					this.postMessage('Saved Links!');
				}
				//when the user clicks save after selecting content
				else if(message.type == 'content')
				{
					storeContentTemplate(message.data);
					this.postMessage('Saved Content Template!');
					
				}
				else if(message.type == 'scrape')
				{
					commenceScraping();
				}
				else
					error();
				}
		});
		
	},

});
*/