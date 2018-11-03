

function testmachinestatus(){

  var allMachines = base.getData('Machines');
  var allMachinesList = JSONtoARR(allMachines);
  if(allMachinesList.length>0 && allMachines){
    allMachinesList.map(function(item){
      if(!item.status){
        delete allMachines[item.sku];
      }
    });
    
    allMachinesList = allMachinesList.filter( function (machine){
 
    return machine.status == true})
  }
  
  return allMachinesList
}

function saveSchedule(dataPaginated, obj) {
  var LOGDATA = {
    status: true,
    msg: '',
    action: 'Schedule Saved',
    batch: obj.name,
    page: 'Schedules',
    user: Session.getActiveUser().getEmail(),
    data: new Array()
  };
  try{
  

  obj.id=obj.entryDate;
    var payload={ 
      'dataPaginated':JSON.stringify(dataPaginated),
      'obj':JSON.stringify(obj),
    };

 
    var params={
      method:"POST",
      "Content-Type":'application/json',
      muteHttpExceptions :true,
      'payload':payload,
    }
    var url=SERVER_URL+NODE_PATH+'/saveschedulepath';
    var response=UrlFetchApp.fetch(url, params).getContentText();
    
  
    Logger.log(response);
    logItem(LOGDATA);
    Utilities.sleep(5000);
    return "Schedule: " + obj.name + " has been saved.";
  } catch (e) {
    LOGDATA.status = false;
    LOGDATA.data.push(['FAILED:', e.toString()]);
    LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
    logItem(LOGDATA);
    return 'Failed. \n' + e.message;
    
  }
  
}

function updateSchedulesFor(newItem,oldItem){
  var LOGDATA = {
    status: true,
    msg: '',
    action: 'Schedule Move',
    batch: newItem.name,
    page: 'Schedules',
    user: Session.getActiveUser().getEmail(),
    data: new Array()
  };
  try{
    var payload={ 
      'newItem':JSON.stringify(newItem),
      'oldItem':JSON.stringify(oldItem),
    };
//    base.updateData('schedulingpayload/payload',payload);
//    return;
    var params={
      method:"POST",
      "Content-Type":'application/json',
      muteHttpExceptions :true,
      'payload':payload,
    }
    var url=SERVER_URL+NODE_PATH+'/updateschedulesforpath';
    var response=UrlFetchApp.fetch(url, params).getContentText();

    Logger.log(response);
    Utilities.sleep(5000);
    logItem(LOGDATA);
  } catch (e) {
    LOGDATA.status = false;
    LOGDATA.data.push(['FAILED:', e.toString()]);
    LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
    logItem(LOGDATA);
    return 'Failed. \n' + e.message;
    
  }
  
}

function DeleteSchedule(obj){

  var LOGDATA = {
    status: true,
    msg: '',
    action: 'Schedule Delete',
    batch: obj.entryDate,
    page: 'Schedules',
    user: Session.getActiveUser().getEmail(),
    data: new Array()
  };

 try{
    var payload={ 
      'obj':JSON.stringify(obj),
    };
//    base.updateData('schedulingpayload/payload',payload);
//    return;
    var params={
      method:"POST",
      "Content-Type":'application/json',
      muteHttpExceptions :true,
      'payload':payload,
    }
    var url=SERVER_URL+NODE_PATH+'/deleteschedulepath';
    var response=UrlFetchApp.fetch(url, params).getContentText();


    Utilities.sleep(5000);
    logItem(LOGDATA);
  } catch (e) {
    LOGDATA.status = false;
    LOGDATA.data.push(['FAILED:', e.toString()]);
    LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
    logItem(LOGDATA);

    
  }

}
function insertNewSchedule(dataPaginated, obj){

  var msg= saveSchedule(dataPaginated, obj);
  Utilities.sleep(5000);
  var oldItem = base.getData('SchedulesReference/'+obj.entryDate);
  var newItem = base.getData('SchedulesReference/'+obj.entryDate);
  updateSchedulesFor(newItem, oldItem)
  return msg;
}
function testSAVESCHEDYLEANDMOVE() {
//    base.removeData('Schedules');
//    base.removeData('Schedules Reference');
    var para = ['00010646','00010684','00010530','00010545','00010546','00010549','00010604','00010612','00010622','00010644','00010645','00010681','00010666','00010677'];
    var para = ['00010545','00010546','00010549','00010604','00010612'];
    var para = ['00010677'];
//    var para = ['00010519'];
    var ids = [];
    for (var i = 0; i < para.length; i++) {
        var searcharr = [];
        var params = {
            orderBy: 'final_status',
            equalTo: "Not Run",

        }
        searcharr.push(['Production', params]);
        var params = {
            orderBy: 'word',
            equalTo: para[i],

        }
        searcharr.push(['Production', params]);



        var data = searchFor(searcharr)[1];
        var obj = {
            name: para[i],
            type: 'automatic',
            entryDate: (new Date()).getTime(),
        }
        obj.date = new Date();
        obj.date = obj.date.setUTCHours(0,0,0,0);
      
        //  obj.time=180;
        ids.push(obj.entryDate.toString());


      obj.id=obj.entryDate;
      var payload={ 
        'dataPaginated':JSON.stringify([data]),
        'obj':JSON.stringify(obj),
      };

      var params={
        method:"POST",
        "Content-Type":'application/json',
        muteHttpExceptions :true,
        'payload':payload,
      }
      var url=SERVER_URL+NODE_PATH+'/saveschedulepath';
       var response=UrlFetchApp.fetch(url, params).getContentText();
     Utilities.sleep(5000);
       //saveSchedule(, obj);

    }

//    var oldItem = base.getData('Schedules Reference/' + ids[0]);
//    var newItem = base.getData('Schedules Reference/' + ids[0]);
//    newItem.date = 1524088800000;
//    newItem.time = 0;
//    updateSchedulesFor(newItem, oldItem)

}
function testslice(){
var data=[2,3,5]
data.splice(1,1);
Logger.log(data);


}

function getMachineType(item) {
    if (item.fill == 10 && !item.CBDrecipe) {
        return ['10ml'];
    } else if (item.CBDrecipe) {
        return ['Semi-auto'];
    } else {
        return ['0mg', 'Semi-auto'];
    }

}

function removeItemFromARR(arr, index1, index2, amount) {
    var tempARR = []
    for (var i = 0; i < arr.length; i++) {

        if (i != index1) {
            tempARR.push(arr[i]);

        } else {
            var helper1 = [];
            for (var j = 0; j < arr[i][2].length; j++) {
                var helper2 = [];
                if (j != index2) {
                    helper1.push(arr[i][2][j]);
                } else {
                    for (var k = amount; k < arr[i][2][j].length; k++) {
                        helper2.push(arr[i][2][j][k]);
                    }
                    helper1.push(helper2);
                    break;
                }

            }
            tempARR.push([arr[i][0], arr[i][1], helper1]);
        }

    }

    return tempARR;
}



function getTimesWithBrakes(id){

  var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var day=new Date(parseInt(id,10)).getDay();
  var existingTimes = [];
  var timeArr=[];
  var now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  
  for (var i = 0; i < 288; i++) {
    existingTimes.push(i * 5);
    timeArr.push(formatAMPM4(now))
    now = new Date(now.getTime() + 5 * 60 * 1000);
  }
  var t1= timeArr[0];
   var t2= timeArr[timeArr.length-1];
  var dayofWeek=base.getData('SchedulesBreaks/'+days[day]);
  if(dayofWeek){
    if(dayofWeek.status){
    
        var shiftTimes=dayofWeek.shiftTimes;
        var timesSplit=shiftTimes.split(', ');
        var shifts = [];
        var shiftTimes = [];
        for(var i=0;i<timesSplit.length;i++){
          var item=timesSplit[i].split(' - ');
          
          var index1=timeArr.indexOf(item[0]);
          var index2=timeArr.indexOf(item[1]);
          
         shifts=shifts.concat(existingTimes.splice(index1, index2-index1));
           shiftTimes=shiftTimes.concat(timeArr.splice(index1, index2-index1));
        }
        var breakTimes=dayofWeek.breakTimes;
        var timesSplit=breakTimes.split(', ');
        for(var i=0;i<timesSplit.length;i++){
          var item=timesSplit[i].split(' - ');
          
          var index1=shiftTimes.indexOf(item[0]);
          var index2=shiftTimes.indexOf(item[1]);
          
          shifts.splice(index1, index2-index1);
          shiftTimes.splice(index1, index2-index1);
        }
    
        return shifts;
    }else{
      return [];
    }
    
  }else{
    return existingTimes;
  }
}

function formatAMPM2(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes;
    return strTime;
}

function formatAMPM4(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
//    var ampm = hours >= 12 ? 'pm' : 'am';
//    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes;
    return strTime;
}
function formatAMPM3(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
function sortMachinesGrade(a, b) {

    return a[1] - b[1];
}
function sortSchedulesArr(a, b) {

    return a[0] - b[0];
}
function getEmptySchedule(date) {
   date = new Date(date).setUTCHours(0,0,0,0).toString();
   return getTimesWithBrakes(date);
}

function getSchedulesAvailable() {
    var raw = base.getData('Schedules');
    var available = [];
    if (raw) {
        var today = (new Date()).getTime();

        var keys = Object.keys(raw);
        var schedulesList = JSONtoARR(raw);

        schedulesList.map(function(item, index) {
            item.id = keys[index];
           if (parseInt(item.id, 10) < parseInt(today, 10)) {

                available.push(item);
            }
            if (parseInt(item.id, 10) < (parseInt(today, 10) - (1000 * 60 * 60 * 48))) {
                base.removeData('Schedules/' + item.id);
                base.updateData('ScheduleArchive/' + item.id, item);
            }
        });
    }
    return available;
}

function getSchedulesForDate(date) {

    var available = getSchedulesAvailable();
    var ret = [];
    available.map(function(item) {
        if (parseInt(item.id, 10) >= parseInt(date, 10)) {
            ret.push(item);
        }

    });
    return ret;

}




function getMachines() {
    var data = JSONtoARR(base.getData('Machines')).sort(sortSTRINGLH('name'));
    return [data, 'Machines'];
}

function getFillLevels() {
    var data = JSONtoARR(base.getData('FillLevels'));
    return [data, 'FillLevels'];
}

function changeFillLevelTime(obj) {

    base.updateData('FillLevels/' + obj.sku, obj)
    return "Changed."
}

function changeMachineLogic(machine1, machine2) {

    var obj = {
        follow: machine2,
    }
    base.updateData('Machines/' + machine1, obj);
    return "Updated."
}

function testrREMEVEO() {
    var arr = [
        [1, 2, 3, 4],
        [5, 6],
        [7]
    ];
    var arr2 = [
        [1, 2, 3, 8],
        [5, 8],
        [8]
    ];
    arr = arr.concat(arr2);

    arr.splice(2, 1);
    Logger.log(arr);


}


function getScheduleDropdown() {
    var data = base.getData('SchedulesReference');
    var list = JSONtoARR(data);
    var resp = [];
    list.map(function(item) {
        resp.push([item.id, item.name]);

    });
    return resp;

}

function getScheduleData(id, page) {
    var ret = [];
    var data = base.getData('SchedulesReference/' + id);

    var orders = data.Batches;
    var pageData = base.getData(page);

    for (var i = 0; i < orders.length; i++) {
        if (pageData[orders[i].batch]) {
            ret.push(pageData[orders[i].batch]);
        }

    }
    return [page, ret];
}
function TESTGETDATANEAREST(){

getScheduleDataNearest('Production');
}
function getScheduleDataNearest(page) {
    var now = new Date();
    now = now.setUTCHours(0,0,0,0).toString();

    var ret = [];
    var schedules = base.getData('Schedules');
    var data = {};
    var list = JSONtoARR(data);
    if (schedules) {
        var keys = Object.keys(schedules);
        for (var i = 0; i < list.length; i++) {
            if (parseInt(keys[i], 10) >= (parseInt(now, 10)-(60*60*1000*5))) {

                data = list[i];
                break;
            }

        }
        if(data){

          var orders = data.Batches;
          var pageData = base.getData(page);
          
          var now2 = new Date();
          var hours = now2.getHours() + 10;
          var minutes = now2.getMinutes();
          
          var time = Math.floor((((hours / 12) * 60) + minutes) / 5) * 30;
          time=time.toString();
          for (var i = 0; i < orders.length; i++) {
            var slots = orders[i].slots;
            slots = slots.split(',');
            if (slots.indexOf(time) >= 0) {
              if (pageData[orders[i].batch]) {
                ret.push(pageData[orders[i].batch]);
              }
            }
            
          }
          
        }

    }
    
     return [page, ret];
}


function getScheduleView() {
    var breaks = base.getData('SchedulesBreaks');
    if (!breaks) {
        breaks = [];
    }
    var data = base.getData('SchedulesReference');
    var list = JSONtoARR(data);
    var resp = [];
    list.map(function(item) {
        var Batches = item.Batches;
        var batchList = '';
        if (Batches) {
            batchList = Object.keys(Batches);
            batchList = batchList.join(', ');
        }
        resp.push([item, item.id, (item.date ? item.date : 'auto'), item.name, item.type, batchList]);

    });
    return [
        [resp, breaks], 'ScheduleManage'
    ];

}

function saveBreaks(breaks) {
 
        base.updateData('SchedulesBreaks', JSON.parse(breaks));

}

function testTIME() {
    var existingTimes = [];
    for (var i = 0; i<288; i++) {
        existingTimes.push(i * 5);
    }
    var now2 = new Date();
    var hours = now2.getHours() + 10;
    var minutes = now2.getMinutes();

    var time = Math.floor((((hours / 2) * 5) + minutes) / 5) * 5;
    var index = existingTimes.indexOf(time);

    Logger.log(time);
}


function editSchedule(newItem, oldItem) {
    if (newItem.name != oldItem.name) {
        var name = {
            name: newItem.name,
        }
        base.updateData('SchedulesReference/' + oldItem.id, name);
    }
    if (oldItem.date != newItem.date) {
        updateSchedulesFor(newItem, oldItem);
    }
    if (oldItem.date == newItem.date) {
        if (oldItem.type == 'automatic') {
            if (newItem.time != 0) {
                updateSchedulesFor(newItem, oldItem);
            }
        } else if (oldItem.type == 'manual') {
            if (newItem.time != oldItem.time) {
                updateSchedulesFor(newItem, oldItem);
            }
        }
    }
}



function jsonConcat(o1, o2) {
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
}

function TESTUPDATESCH() {
    var oldItem = base.getData('Schedules Reference/1523882950163');
    var newItem = base.getData('Schedules Reference/1523882950163');
    newItem.date = 1524088800000;
    newItem.time = 0;
    updateSchedulesFor(newItem, oldItem)

}


function updateSchedulesFor2(newItem, oldItem) {
    var schedRef = base.getData('Schedules Reference');
    var schedRefList = JSONtoARR(schedRef);
    newItem.type = 'manual';
    var schedules = [];
    if(oldItem){
    if (newItem.date >= oldItem.date) {
        schedules = getSchedulesForDate(oldItem.date)
    } else {
        schedules = getSchedulesForDate(newItem.date)
    }
  }else{
   schedules = getSchedulesForDate(newItem.date);
  }
    //REMOVE BATCHES
    var toBeSet = [];
    var allArray = [];
    var allMachines = [];
if(oldItem){
    var batchList = Object.keys(oldItem.Batches);
}else{

 var batchList = newItem.Batches;
 delete newItem.Batches;
}
    for (var i = 0; i < schedules.length; i++) {
        var machines = JSONtoARR(schedules[i].Machines);
        var machineL1Keys = Object.keys(schedules[i].Machines);
        allMachines = allMachines.concat(machineL1Keys);
        for (var m = 0; m < machines.length; m++) {
            var machineL2Keys = Object.keys(machines[m]);
            for (var ms = 0; ms < machineL2Keys.length; ms++) {
                var item = machines[m][machineL2Keys[ms]];
                var batchesInItem = Object.keys(item);
                for (var b = 0; b < batchesInItem.length; b++) {
                    if (batchList.indexOf(item[batchesInItem[b]].batch) >= 0) {
                        toBeSet.push([new Date(parseInt(schedules[i].id, 10)), parseInt(schedules[i].id, 10), machineL1Keys[m], machineL2Keys[ms], item[batchesInItem[b]].batch, item[batchesInItem[b]].bottles, item[batchesInItem[b]].timeTotal]);
                         
                    } else {
                        if (parseInt(schedules[i].id, 10) >= parseInt(newItem.date, 10)) {
                            allArray.push([new Date(parseInt(schedules[i].id, 10)), parseInt(schedules[i].id, 10), machineL1Keys[m], machineL2Keys[ms], item[batchesInItem[b]].batch, item[batchesInItem[b]].bottles, item[batchesInItem[b]].timeTotal]);
                        }
                    }
                }

            }
        }
       base.removeData('Schedules/'+schedules[i].id);  //WARNING REMOVEING SCHEDULES    
    }

    allMachines = uniq(allMachines);
    var oneDay = 60 * 60 * 1000 * 24;
//    var sheet = SpreadsheetApp.openById('1fLnZBXIwWBtbiLAdmX4TufslfSJeFE0BELySeEDN6Jk');
//    var sheet1 = sheet.getSheets()[0];
//    var sheet2 = sheet.getSheets()[1];
//    var sheet3 = sheet.getSheets()[2];
//    var sheet4 = sheet.getSheets()[3];
//    sheet1.clear();
//    sheet2.clear();
//    sheet3.clear();
//    sheet4.clear();
//    sheet1.getRange(1, 1, toBeSet.length, toBeSet[0].length).setValues(toBeSet);
//    sheet2.getRange(1, 1, allArray.length, allArray[0].length).setValues(allArray);
    //SET BATCHES
    var moveDown = 0;
    var startDate = toBeSet[0][1];
    var diff = (startDate - newItem.date) / (oneDay);
    var j = 0;
    var k = diff;
    var timeDiff = 0;
    if(oldItem){
    if (oldItem.time) {
        timeDiff = parseInt(toBeSet[0][3],10) - newItem.time;
    }
    }
    var allMachines2 = [];
    var lastShiftTime = 420;
    for (var i = 0; i < toBeSet.length; i++) {
        allMachines2.push(toBeSet[i][2]);
        toBeSet[i][1] = (toBeSet[i][1] + (k * oneDay));
        var added = parseInt(toBeSet[i][3],10) + timeDiff;
        if (added < 0) {
            toBeSet[i][1] = (toBeSet[i][1] + ((k - 1) * oneDay));
            toBeSet[i][3] = Math.abs(added);
        } else if (added > lastShiftTime) {
            toBeSet[i][1] = (toBeSet[i][1] + ((k + 1) * oneDay));
            toBeSet[i][3] = Math.abs(added);
        } else {
            toBeSet[i][3] = Math.abs(added);
        }
    }
    allMachines2 = uniq(allMachines2);
  //  sheet3.getRange(1, 1, toBeSet.length, toBeSet[0].length).setValues(toBeSet);

    var timeDiff = 0;
    if(oldItem){
    if (oldItem.time) {
        timeDiff = parseInt(allArray[0][3],10) - newItem.time;
    }
  }
    for (var i = 0; i < allArray.length; i++) {
        if (allMachines2.indexOf(allArray[i][2]) >= 0) {

            allArray[i][1] = (allArray[i][1] + (k * oneDay));
            var added = parseInt(allArray[i][3],10) + timeDiff;
            if (added < 0) {
                allArray[i][1] = (allArray[i][1] + ((k - 1) * oneDay));
                allArray[i][3] = Math.abs(added);
            } else if (added > 420) {
                allArray[i][1] = (allArray[i][1] + ((k + 1) * oneDay));
                allArray[i][3] = Math.abs(added);
            } else {
                allArray[i][3] = Math.abs(added);
            }

        }
    }

 //   sheet4.getRange(1, 1, allArray.length, allArray[0].length).setValues(allArray);

    var itemArr = [toBeSet, allArray];
    for (var it = 0; it < itemArr.length; i++) {
        var options = '{';
        var exists = {};

        for (var i = 0; i < itemArr[it].length; i++) {

            var batch = {
                batch: itemArr[it][i][4],
                bottles: itemArr[it][i][5],
                schedule_ID: itemArr[it][i][1].toString(),
                timeTotal: itemArr[it][i][6],
                machine_ID: itemArr[it][i][2],
                slots: [itemArr[it][i][3]].join(','),

            }
            if (exists) {
                if (exists.batch != batch.batch) {
                    if (it != 0) {
                        for (var s = 0; s < schedRefList.length; s++) {
                            if (schedRefList[s].Batches[batch.batch]) {
                                base.updateData('Schedules Reference/' + schedRefList[s].id + '/Batches/' + batch.batch, exists);
                            }
                        }
                    } else {
                        options += '"' + exists.batch + '":' + JSON.stringify(exists) + ',';
                    }
                }
            }

            exists = base.getData('Schedules/' + batch.schedule_ID + '/Batches/' + batch.batch);
            if (exists) {
                exists.bottles += batch.bottles;
                exists.timeTotal += batch.timeTotal;
                var slots = exists.slots.split(',');
                slots.push(batch.slots);
                var Ids = exists.schedule_ID.split(',');
                Ids.push(batch.schedule_ID);
                Ids = uniq(Ids);
                exists.schedule_ID = Ids.join(',');
                exists.slots = slots.join(',');
                base.updateData('Schedules/' + batch.schedule_ID + '/Batches/' + batch.batch, exists);
            } else {
                base.updateData('Schedules/' + batch.schedule_ID + '/Batches/' + batch.batch, batch);
                exists = batch;
            }
            if (i == itemArr[it].length - 1) {
                if (it != 0) {
                    for (var s = 0; s < schedRefList.length; s++) {
                        if (schedRefList[s].Batches[batch.batch]) {
                            base.updateData('Schedules Reference/' + schedRefList[s].id + '/Batches/' + batch.batch, exists);
                        }
                    }
                } else {
                    options += '"' + exists.batch + '":' + JSON.stringify(exists) + ',';
                }
            }
            var machineItem = {
                batch: itemArr[it][i][4],
                bottles: itemArr[it][i][5],
                timeTotal: itemArr[it][i][6],
            }
            //   for(var j=0;j<allocatedData[i][5].length;j++){

            base.updateData('Schedules/' + batch.schedule_ID + '/Machines/' + batch.machine_ID + '/' + itemArr[it][i][3] + '/' + batch.batch, machineItem);
            //   }
            //  allocatedData.push([data[j].batch,data[j].bottles,schedules[i].id,timeTotal,machinesGraded[m][0],taken]);



        }
        options += '}';

        var upload = JSON.parse(options);
        var ScheduleReference = newItem;
        ScheduleReference.id = newItem.entryDate.toString();
        ScheduleReference.Batches = upload;
        if (it == 0) {
            base.updateData('Schedules Reference/' + ScheduleReference.id, ScheduleReference);
        }
    }
    /*
         base.updateData('Schedules/'+batch.schedule_ID+'/Batches/'+batch.batch,batch);

        base.updateData('Schedules/'+batch.schedule_ID+'/Machines/'+batch.machine_ID+'/'+allocatedData[i][5]+'/'+batch.batch,machineItem);

      base.updateData('Schedules Reference/'+ScheduleReference.id,ScheduleReference);
    */
}

function testegetval(){
var sheet= SpreadsheetApp.openById('1V2M6v8DdJoasaeNpk2TyNFKoEDiyEsNgRjv03sutYHk').getSheets()[0];
var val  = sheet.getDataRange().getValues();
Logger.log(val);
}
function getLastShiftTime(id){
var times = getTimesWithBrakes(id);
if(times.length>0){
return times[times.length-1];
}else{
return 0;
}

}


function testPrint(){
var type='Today';
var obj={
from:new Date('06/19/2018').setHours(0,0,0,0),
to:new Date('06/30/2018').setHours(0,0,0,0),
selected:['1527148292000'],
};

printSchedules(obj,type);
}
function printSchedules(opt,type){
var item={};
try{
  //Today
  //FromTo
  //scheduleSelect
  var allMachines = base.getData('Machines');
  var allMachinesList = JSONtoARR(allMachines);
  var printData=[];
  var name='';
  
  if(type=='Today'){
    var printData=getTodaySchedule();
    name=formatDateDisplay(new Date().getTime());
  }else if(type=='FromTo'){
   name=formatDateDisplay(new Date(opt.from).getTime())+' - '+formatDateDisplay(new Date(opt.to).getTime())
    var printData=getFromToSchedule(opt.from,opt.to);
  }else{
  var names=[];
   for(var i=0;i<opt.selected.length;i++){
   names.push(base.getData('SchedulesReference/'+opt.selected[i].toString()+'/name'));
   }
   if(names.length>1){
   name=names.join(', ');
   }else{
   name=names[0];
   }
    var printData=getSelectedSchedules(opt.selected);
    
  }
  var toPrint=getToPrint(printData[0]);
  var startRow=3;
  var startCol=3;
  
  var folder=DriveApp.getFolderById(SCHEDULES_FOLDER);
  var create=DriveApp.getFileById(SCHEDULE_TEMPLATE).makeCopy(name+' - Schedule',folder);


  var SS=SpreadsheetApp.openById(create.getId());
  Logger.log(SS.getUrl());
  var template=SS.getSheets()[0];
  var sheet=SS.getSheets()[1];
  sheet.setName('Schedule');
  var initRange= template.getRange(1, 1, template.getLastRow(), 2);
  var initCol= template.getRange(1, 3, template.getLastRow(), 1);
  var initSplit= template.getRange(1, 4, template.getLastRow(), 1);
  var toDoRange= template.getRange(294, 2);
  initRange.copyTo(sheet.getRange(1, 1, template.getLastRow(), 2));
  sheet.getRange(2, 2).setValue(name);
  var prev='';
    var BGColors = ['#d3d3d3','#ffffff'];
    var colindex = 0;
  for(var i=0;i<printData[0].length;i++){
  if(prev==''){
  prev=printData[0][i][0];
  }
  if(prev!=printData[0][i][0]){
    initSplit.copyTo(sheet.getRange(1, startCol, template.getLastRow(), 1));
    prev=printData[0][i][0];
    startCol++;
    toDoRange.copyTo(sheet.getRange(294, startCol-1));

  }
  var machineName=allMachines[printData[0][i][1]].name;
  printData[0][i][0]=formatDateDisplay(parseInt(printData[0][i][0],10));
  printData[0][i][1]=machineName;
   initCol.copyTo(sheet.getRange(1, startCol,template.getLastRow(), 1));
   var values=[];
   var batchandbot=[];
   
   for(var j =0;j<printData[0][i].length;j++){
    values.push([printData[0][i][j]]);
     batchandbot.push(printData[1][i][j]);
   }
   printData[0][i].map(function(item){
  
   });
 //  sheet.getRange(startRow, startCol, printData[i].length,1).setValues(values);
   var v1 = 0;
    while(values.length>0){

      var v2=1;
      var totalBot = 0;
      var val = batchandbot[0][0];
      var type = typeof batchandbot[v2];
      if( type !== "undefined"){
     
      for(;val == batchandbot[v2][0] ;){
        v2++
        if(v2>=batchandbot.length){
        break;
        }
      }
      var arrtoSet =values.splice(0, v2); 
      var arrtoCombine =batchandbot.splice(0, v2); 
      if(val != "" && arrtoCombine[0][0]){
      var botcount = 0;
      arrtoCombine.map(function(item){
        botcount+=item[1];
      });
      }else{
      var botcount = 0;
      }
        //sheet.getRange(startRow+v1, startCol,v2,1).setValues(arrtoSet);
        if(v1>1 && botcount!=0){
         sheet.getRange(startRow+v1, startCol,v2,1).merge().setValue(arrtoSet[0]+' X '+botcount).setBackground(BGColors[colindex]);
        }else if(v1>1){
          sheet.getRange(startRow+v1, startCol,v2,1).merge().setValue(arrtoSet[0]).setBackground(BGColors[colindex]);
        }else{
          sheet.getRange(startRow+v1, startCol,v2,1).merge().setValue(arrtoSet[0]).setBackground(BGColors[colindex]);
        }
      }else{
        if(batchandbot.splice(0, 1)[0]){
          sheet.getRange(startRow+v1, startCol).setValue(values.splice(0, 1)+' X '+batchandbot.splice(0, 1)[1]).setBackground(BGColors[colindex]); 
          // values=[];
        }else{
          sheet.getRange(startRow+v1, startCol).setValue(values.splice(0, 1)).setBackground(BGColors[colindex]);
        }
      }
      v1+=v2;
      if(colindex==1){
      colindex=0;
      }else{
      colindex++;
      }
    }
   startCol++;
  }

  var values = sheet.getDataRange().getValues();
  var c=0;
  for(var j=4;j<values.length;j++) {
    var foundval = false;
    for(var k=2;k<values[j].length;k++){
      if(values[j][k]){
        foundval=true;
        break;
      }
    }
    if(foundval){
      break;
    }else{
    c++;
    }
  };
  if(foundval && c > 0){
    sheet.deleteRows(5,c);
  }
  var SS=SpreadsheetApp.openById(create.getId());
  var sheet=SS.getSheets()[1];
  var values = sheet.getDataRange().getValues();
  var c=0;
  for(var j=values.length-4;j>0;j--) {
    var foundval = false;
    for(var k=2;k<values[j].length;k++){
      if(values[j][k]){
        foundval=true;
        break;
      }
    }
    if(foundval){
      break;
    }else{
      c++;
    }
  }
  var from =values.length-c;
  var to= values.length-1;
  sheet.deleteRows(from,to-from)
  
SS.deleteSheet(template);
item.name=SS.getName();
item.url=SS.getUrl();

}catch(e){
Logger.log(e.toString());
item.error=e.toString();
}
Logger.log(item);
return item
}

function settimes(){

var id ='15TNbb-9bhTcmSGbNQQ9bisHrSQG2D0NUoGvF_ehgWrs';
  var existingTimes = [];
  var timeArr=[];
  var now = new Date();
  now.setUTCHours(0,0,0,0);
  
  for (var i = 0; i < 288; i++) {
    existingTimes.push(i * 5);
    timeArr.push([formatAMPM4(now)])
    now = new Date(now.getTime() + 5 * 60 * 1000);
  }
  
 var SS=SpreadsheetApp.openById(id).getSheets()[0];
 SS.getRange(5, 2, timeArr.length, 1).setValues(timeArr);
}
function getToPrint(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i][0] !== prev ) {
            a.push(arr[i][0]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i][0];
    }

    return [a, b];
}
function getTodaySchedule(){
  var orders=base.getData('Production');
  var arr=[];
  var existingTimes = [];
  for (var i = 0; i <288; i++) {
    existingTimes.push(i * 5);
  }
  var botandbatchLarge = [];
  var date= new Date().setUTCHours(0,0,0,0);
  var dateSTR = date.toString();
  var schedules = base.getData('Schedules/'+date);
  if(schedules){
        var item=schedules;
     
          var machines= item.Machines;
          for(var j=0;j<machines.length;j++){
            var machineTimes=ARRtoJSON(machines[j].times,'times');
            var machineTimesKeys=Object.keys(machineTimes);  
            var arrToPush=[date,machines[j].id];
            var botandbatch = [[1],[2]];
            for(var mt=0;mt<existingTimes.length;mt++){
              if(machineTimes[mt*5]){
                var batch=machineTimes[mt*5].Batch;
                arrToPush.push(orders[batch.batch].orderID+'/'+batch.batch+' '+orders[batch.batch].productdescription);
                botandbatch.push([batch.batch,batch.bottles]);
              }else{
                arrToPush.push('');
                botandbatch.push([]);
              }
            }
            arr.push(arrToPush);
            botandbatchLarge.push(botandbatch)
          }
         
    
  }
  

   return [arr,botandbatchLarge];
}
function getFromToSchedule(from,to){
  var orders=base.getData('Production');
  var arr=[];
  var existingTimes = [];
  for (var i = 0; i <288; i++) {
    existingTimes.push(i * 5);
  }
    var botandbatchLarge = [];

  var one_day=60*60*1000*24;
  var schedules = base.getData('Schedules');
  if(schedules){
  var keys=Object.keys(schedules);
  schedules = {};
  for(var i=0;i<keys.length;i++){
    var searchSTR  = keys[i];
    if(parseInt(searchSTR,10)>=from && parseInt(searchSTR,10)<=to){
    var item=schedules[searchSTR];
    if(item){
    
      var machines= item.Machines;
      for(var j=0;j<machines.length;j++){
      var machineTimes=ARRtoJSON(machines[j],'times');
      var machineTimesKeys=Object.keys(machineTimes);  
       var arrToPush=[ keys[i],machines[j].id];
       var botandbatch = [[1],[2]]; 
        for(var mt=0;mt<existingTimes.length;mt++){
          if(machineTimes[mt*5]){
            var batch=machineTimes[mt*5].Batch;
            arrToPush.push(orders[batch.batch].orderID+'/'+batch.batch+' '+orders[batch.batch].productdescription);
            botandbatch.push([batch.batch,batch.bottles]);
          }else{
            arrToPush.push('');
            botandbatch.push([]);
          }
        }
      arr.push(arrToPush);
        botandbatchLarge.push(botandbatch);
      }
    }
    }
  }
    }
  
    return [arr,botandbatchLarge];
  
}

function getSelectedSchedules(selected){
  var active=[];
  var batches=[];
  var existingTimes = [];
  for (var i = 0; i < 288; i++) {
    existingTimes.push(i * 5);
  }
  //sortSchedulesArr
  var orders=base.getData('Production');
  var schedules=base.getData('Schedules');
  for(var s=0;s<selected.length;s++){
    var item=base.getData('SchedulesReference/'+selected[s]);
    var Batches= item.Batches;
    for(var b=0;b<Batches.length;b++){
      var BatchItem=Batches[b];
      var scheduleIDs=BatchItem.schedule_ID;
      scheduleIDs=scheduleIDs.split(',');
      for(var i=0;i<scheduleIDs.length;i++){
        active.push(parseInt(scheduleIDs[i],10))
       
      }
     batches.push(BatchItem.batch);
    }
    
  }
  active=uniq(active);
  active=active.sort();
 
  batches=uniq(batches);
  var arr=[];
    var botandbatchLarge = [];
  for(var a=0;a<active.length;a++){
  var item=schedules[active[a].toString()];
    if(item){
    item.id=active[a];
    var machines=item.Machines;
    for(var j=0;j<machines.length;j++){
      var machineTimes=ARRtoJSON(machines[j].times,'times');
      var machineTimesKeys=Object.keys(machineTimes);  
      var arrToPush=[active[a],machines[j].id];
      var botandbatch = [[1],[2]]; 
      for(var mt=0;mt<existingTimes.length;mt++){
        if(machineTimes[mt*5]){
          var batch= machineTimes[mt*5].Batch;
          if(batches.indexOf(batch.batch)>=0){
          arrToPush.push(orders[batch.batch].orderID+'/'+batch.batch+' '+orders[batch.batch].productdescription);
           botandbatch.push([batch.batch,batch.bottles]);
          }else{
           arrToPush.push('');
           botandbatch.push([]);
          }
        }else{
          arrToPush.push('');
          botandbatch.push([]);
        }
      }
      arr.push(arrToPush);
       botandbatchLarge.push(botandbatch);
    }
  }
  }
  
  
  return [arr,botandbatchLarge];
  
}
function fillArray(len) {
    var rows = new Array(len);
    while (--len >= 0) {
        rows[len] = '';
    }
    return rows;
}
function testgetPREV(){

GetSchedulePreview(1539129600000);
}
function GetSchedulePreview(date){
  var ID = new Date(date).setUTCHours(0,0,0,0).toString();

  var schedule = [];
  var allMachines = base.getData('Machines');
  if(allMachines){
    
    
  var allMachinesList = JSONtoARR(allMachines);


  var printData = FormatScheduleForDate(ID);
  if(printData.length>0){
  for(var i=0;i<printData.length;i++){

    
    var machineName=allMachines[printData[i][0]].name;
    delete allMachines[printData[i][0]];
    printData[i][0]=machineName;
  

  }
  var machineKeys=Object.keys(allMachines);
  machineKeys.map(function(item){
  var row =fillArray(printData[0].length);
  row[0] = allMachines[item].name;
  printData.push(row);
  })
    var existingTimes = [''];
    var now = new Date();
    now.setUTCHours(0,0,0,0);
    
    for (var i = 0; i <288; i++) {
      existingTimes.push(formatAMPM4(now));

      now = new Date(now.getTime() + 5 * 60 * 1000);
    }
  schedule = printData;
  schedule.unshift(existingTimes);
  schedule= transposeArray(schedule, schedule[0].length)
  }
  }
  return schedule;
}
function transposeArray(array, arrayLength){
    var newArray = [];
    for(var i = 0; i < arrayLength; i++){
        newArray.push([]);
    };

    for(var i = 0; i < array.length; i++){
        for(var j = 0; j < arrayLength; j++){
            newArray[j].push(array[i][j]);
        };
    };

    return newArray;
}
function FormatScheduleForDate(date){
 var arr=[];
  var existingTimes = [];
  for (var i = 0; i <288; i++) {
    existingTimes.push(i * 5);
  }

  var item=base.getData('Schedules/'+date);
  if(item){
    
    var machines= item.Machines;
    for(var j=0;j<machines.length;j++){
      var machineTimes=ARRtoJSON(machines[j].times,'times');
      var machineTimesKeys=Object.keys(machineTimes);  
      var arrToPush=[machines[j].id];
      for(var mt=0;mt<existingTimes.length;mt++){
        if(machineTimes[mt*5]){
          var batch=machineTimes[mt*5].Batch;
          arrToPush.push(batch.batch)
        }else{
          arrToPush.push('');
        }
      }
      arr.push(arrToPush);
    }
  }
  
  return arr;
}
function DeleteSchedule2(obj){
  var data=base.getData('Schedules Reference/'+obj.entryDate);
  var batches = Object.keys(data.Batches);
  for(var b=0;b<batches.length;b++){
    var machine=data.Batches[batches[b]].machine_ID
    var IDs=data.Batches[batches[b]].schedule_ID;
    var IDList=IDs.split(',');
     var usedSlots=[];
    for(var i=0;i<IDList.length;i++){
      var slots=data.Batches[batches[b]].slots;
    
       if(usedSlots[0]){

        var slotList=slots.split(',');
        for(var us=0;us<usedSlots.length;us++){
          var index = slotList.indexOf(usedSlots[us]);
          if (index > -1) {
            slotList.splice(index, 1);
          }
        }

       }else{
         usedSlots=[];
         var slotList=slots.split(',');
       }
      for(var s=0;s<slotList.length;s++){
      if(usedSlots.indexOf(slotList[s])==-1){
        usedSlots.push(slotList[s]);
        base.removeData('Schedules/'+IDList[i]+'/Machines/'+machine+'/'+slotList[s]);
        }else{
        break;
        }
      }
      base.removeData('Schedules/'+IDList[i]+'/Batches/'+batches[b]);
    }
    
  }
  
  base.removeData('Schedules Reference/'+obj.entryDate);
}