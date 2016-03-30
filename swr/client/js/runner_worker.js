var eventFunc 			= {};

var taskList 		= [];
var taskOne 		= null;
var remainingStr 	= "";

onmessage = function(event){
	
	var task_data = event.data;
	
	if( !eventFunc[task_data.cmd] ){
		console.log( "ERR unknow cmd - [" + task_data.cmd + "]" );
		return ;
	}
	
	eventFunc[task_data.cmd]( task_data.params );
	RunTask();
	
// 워커를 호출한 곳으로 결과 메시지를 전송한다
//	var sendData = receiveData + "OK~ I'm Worker"
//	postMessage(sendData);
//	count++;
//	self.postMessage( "hellow2" );

}

var waitPromptTask = function( params ){
	console.log( "CALL runner_worker - waitPromptTask() : params = ", params  );
	
	// 현재까지 받은 문자열안에 있는가?	
	var index = remainingStr.indexOf( params.str );
	if( index < 0 ){
		// 없다면 마지막 개행문자 이후만 남긴다. 
		var index = remainingStr.lastIndexOf( '\n' );
		if( index > -1 ){ 
			remainingStr = remainingStr.substring(index+1);
		}
//		console.log( "this.remainingStr(after-return) = ", this.remainingStr );
		return;
	} 
		
	// 발견했다면 	
	console.log( "Found index =============================== ", index );
	console.log( "checkString : [" + params.str + "]" );
	
	// 검사 대상 문자열과 같은 위치까지 제거하고 다음번으로 넘긴다. 
	var last  = index + params.str.length;
	remainingStr = remainingStr.substring(last);
		
	taskOne = null;
	RunTask();
	
}

var inputCommandTask = function( params ){
	console.log( "CALL runner_worker - inputCommandTask() : params = ", params  );
	taskOne = null;
	RunTask();
}

var doTask = function(){

	if( !taskOne ){
		if( taskList.length === 0 ) {
			return;
		}
		taskOne = taskList.shift();
	}
	
	taskOne.func( taskOne.params );
	
}

var RunTask = function(){
	setTimeout( doTask, 0 );
}

var init = function(){
//	console.log( "CALL runner_worker - init()" );
	taskList 		= [];
	taskOne 		= null;
	remainingStr 	= "";
}
eventFunc['init'] 	= init;

var wait_prompt = function(str){
	
//	console.log( "CALL runner_worker - wait_prompt() : str = [" + str + "]" );
	taskList.push( { func : waitPromptTask, params : { str : str } } );
	
}
eventFunc['wait_prompt'] 	= wait_prompt;

var input_command = function(str){
	
//	console.log( "CALL runner_worker - input_command() : str = [" + str + "]" );
	taskList.push( { func : inputCommandTask, params : { str : str } } );
	
}
eventFunc['input_command'] 	= input_command;

var fn_stdout = function(str){
	
//	console.log( "CALL runner_worker - fn_stdout() : str = [" + str + "]" );
	remainingStr += str;

}
eventFunc['stdout'] = fn_stdout;

