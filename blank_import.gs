

//IMPORT BLANK PCPD
function importBlankPCPC(id) {
  var premixARR = [];
  var unbrandedARR = [];
  var linkedBBARR = [];
  var sheet = SpreadsheetApp.openById(id).getSheets()[0];
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
  }
  
}

function testIMPORTVlank() {
//  base.removeData('References/AllItems');
//  return
  var id = '1bemCwUzgEr3AMc3pfQSIMwdL7ohD5RYO59b7PPAFpsc';
  return importBlankPCPC2Ping(id);
  
}
function importBlankPCPC2(id) {

    var key = new Date().getTime().toString();
  var sheet = SpreadsheetApp.openById(id).getSheets()[0];
  var data = sheet.getDataRange().getValues();
  //    var dataToSend = "";
  //      data.map(function(item) {
  //        dataToSend += item.join(",") + "\n";
  //      });
  var payload={ 
    'data':JSON.stringify(data),
    'key':key
    
  };
  var params={
    method:"POST",
    "Content-Type":'application/json',
    muteHttpExceptions :true,
    'payload':payload
  }
  base.removeData('importBlankPCPD');
  var url=SERVER_URL+NODE_PATH+'/importblankpcpdpath';
  var response=UrlFetchApp.fetch(url, params).getContentText();
  Logger.log(response);
  return [false,'importBlankPCPC2',key];
  
}

function importBlankPCPC2Ping(id){
//id = '10HWKXSHkzQkuXcyOp8YY6cddaVGdj71c-frRabL9Obw';
 
  Utilities.sleep(20000);
  try {
    var statusRaw=base.getData('importBlankPCPD');
    if(!statusRaw){
          return [false,'importBlankPCPC2'];
    }
    var keys = Object.keys(statusRaw)
    var status = statusRaw[keys[0]].status;
    if(!status){
      return [false,'importBlankPCPC2'];
    }
    
    var sheet = SpreadsheetApp.openById(id).getSheets()[0];
    var key =[keys[0]]
    
    var params={
      method:"GET",
      "Content-Type":'application/json',
      muteHttpExceptions :true,
     
    }
  
    var url=SERVER_URL+NODE_PATH+'/importblankpcpdpathping?key='+key;
    var response=UrlFetchApp.fetch(url, params).getContentText();
  
    response =JSON.parse(response);
    
    var LOGDATA = {
      status: true,
      msg: '',
      action: 'Import Blank PC/PD',
      batch: 'Spreadsheet',
      page: 'PC/PD',
      user: Session.getActiveUser().getEmail(),
      data: new Array()
    };
    
    var values=[];
    var resp=[[],[],[],[],'',[],[]];
    resp = response.data;
    
    for(var i=0;i<resp[6].length;i++){
      if(i>0){
        if(resp[6][i].length!=resp[6][i-1].length){
          resp[6].splice(i,1,['','','','','','','']);
          
        }
      }
      for(var j=0;j<resp[6][i].length;j++){
        if(resp[6][i][j]){
          
          if(resp[6][i][j].match(' GEN')){
            resp[6][i][j] = resp[6][i][j].replace(' GEN','');
            sheet.getRange(i+2,j+3).setBackground('#D9A744');
            //values.push([i+1,j+1]);
          }
        }
      }
    }
    sheet.getRange(2, 3, resp[6].length, resp[6][0].length).setValues(resp[6]);
    Logger.log('here1');
    logItem(LOGDATA);
    base.removeData('importBlankPCPD');
    return  [true,'importBlankPCPC2',[ resp ,"createAutoPUB"]];
  } catch (e) {
    Logger.log(e);
    LOGDATA.status = false;
    LOGDATA.data.push(['FAILED:', e.toString()]);
    LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
    logItem(LOGDATA);
    return 'Failed. \n' + e.message;
  }
}


function updateGeneratedData(items, id) {

  var LOGDATA = {
    status: true,
    msg: '',
    action: 'Generate PUB Items',
    batch: 'Spreadsheet',
    page: 'PC/PD',
    user: Session.getActiveUser().getEmail(),
    data: new Array()
  };
  try{
    var sheet = SpreadsheetApp.openById(id).getSheets()[0];
    var data = sheet.getDataRange().getValues();
    
    var payload={ 
      'data':JSON.stringify(data),
      'items':JSON.stringify(items),
      'id':id.toString(),
   
    };
    
    var params={
      method:"POST",
      "Content-Type":'application/json',
      muteHttpExceptions :true,
      'payload':payload,
    }
    var url=SERVER_URL+NODE_PATH+'/updategenerateddatapath';
    var response=UrlFetchApp.fetch(url, params).getContentText();
    
    logItem(LOGDATA);
    
    return [false,'updateGeneratedData'];
  } catch (e) {
    LOGDATA.status = false;
    LOGDATA.data.push(['FAILED:', e.toString()]);
    LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
    logItem(LOGDATA);
    return 'Failed. \n' + e.message;
    
  }
}
function updateGeneratedDataPing() {

  Utilities.sleep(20000);
  var LOGDATA = {
    status: true,
    msg: '',
    action: 'Generate Blank PC/PD',
    batch: 'Spreadsheet',
    page: 'PC/PD',
    user: Session.getActiveUser().getEmail(),
    data: new Array()
  };
  
  try {
    var statusRaw=base.getData('importBlankPCPD');
    if(!statusRaw[0]){
          return [false,'importBlankPCPC2'];
    }
    var status = statusRaw.status;
    
     
    if(!status){
      return [false,'updateGeneratedData'];
    }
    var resp =base.getData('importBlankPCPD');
    
    LOGDATA.data=resp.LOGDATA;
    LOGDATA.batch=resp.id;
    
    var sheet = SpreadsheetApp.openById(resp.id).getSheets()[0];
    var data = sheet.getDataRange().getValues();
    
    logItem(LOGDATA);
    base.removeData('importBlankPCPD');
  //  var resp2=createRefferenceDB2(resp.id,data)
    return  [true,'updateGeneratedData',"Creating Refference DB"];
  } catch (e) {
    Logger.log(e);
    LOGDATA.status = false;
    LOGDATA.data.push(['FAILED:', e.toString()]);
    LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
    logItem(LOGDATA);
    return 'Failed. \n' + e.message;
  }
}

