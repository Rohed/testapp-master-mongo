function createBackup() {
  
  var params={
    method:"GET",
    "Content-Type":'application/json',
    muteHttpExceptions :true,
  }
  var url=SERVER_URL+NODE_PATH+'/createbackup?path='+NODE_PATH;
  var response=UrlFetchApp.fetch(url, params).getContentText();
  Utilities.sleep(30000);
  return 'Created';
}
function deleteBackup(filename) {

   var params={
    method:"GET",
    "Content-Type":'application/json',
    muteHttpExceptions :true,
   
  }
  var url=SERVER_URL+NODE_PATH+'/deletebackup?path='+NODE_PATH+"&name="+filename;
  var response=UrlFetchApp.fetch(url, params).getContentText();
   Utilities.sleep(10000);
  return 'Deleted';
}
function getFileList() {

 var params={
    method:"GET",
    "Content-Type":'application/json',
    muteHttpExceptions :true,
   
  }
  var url=SERVER_URL+NODE_PATH+'/filelist?path='+NODE_PATH;
  var response=UrlFetchApp.fetch(url, params).getContentText();
  
  var arr = JSON.parse(response);

  return [arr,'backupAndRestore'];
}

function restorePoint(filename) {
   base.removeData('restorepoint');

   var params={
    method:"GET",
    "Content-Type":'application/json',
    muteHttpExceptions :true,
   
  }
  var url=SERVER_URL+NODE_PATH+'/restorepoint?path='+NODE_PATH+"&name="+filename;
  var response=UrlFetchApp.fetch(url, params).getContentText();
  
   return [false,'restorePoint'];
}
function restorePointPing(){
//Utilities.sleep(20000);
var restore = base.getData('restorepoint/1');
if(!restore){
return [false,'restorePoint'];
}
if(restore.status){
  return [true,'restorePoint', 'Restored.'];
}
return [false,'restorePoint'];
}
function verifyUser(pass,page){
if(pass == RESTORE_PASSWORD){
return [true,page];
}
return [false,page];
}