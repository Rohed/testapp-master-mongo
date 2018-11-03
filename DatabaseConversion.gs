

function STERILISEDATA_productCodes(){
var PC = base.getData("References/ProductCodes");
base.removeData('References');
base.updateData('References',PC);

}

function STERILISEDATA_Machines(){
var Machines = base.getData("Machines");
var  list = Object.keys(Machines);
for(var r = 0 ; r < list.length; r++){
 Machines[list[r]].id = list[r].toString();
 delete  Machines[list[r]].sku;
}
base.removeData('Machines');
base.updateData('Machines',Machines);

}

function STERILISEDATA_recipeandcolor(){
var Recipes = base.getData("Recipes");
var recipeList = JSONtoARR(Recipes);
for(var r = 0 ; r < recipeList.length; r++){
  if(recipeList[r].Color){
    if(!recipeList[r].Color.sku){
      
    Recipes[recipeList[r].id].Color  = {name:'',sku:'', val:0 }
    }
  
  }else{
  
   Recipes[recipeList[r].id].Color  = {name:'',sku:'', val:0 }
  
  }


}
base.updateData('Recipes',Recipes);

  var sheets = ['Orders','Mixing','MixingTeam','PremixColoring'];
  for(var i = 0 ; i < sheets.length; i++){
    var data = base.getData(sheets[i]);
    var keys = Object.keys(data);
  
    for(var j = 0 ; j < keys.length; j++){
    if(!data[keys[j]].recipe){
      delete data[keys[j]];
      continue;
    }
    if(!data[keys[j]].recipe.id){
      delete data[keys[j]];
      continue;
    }
     if(!Recipes[data[keys[j]].recipe.id]){
      delete data[keys[j]];
      continue;
    }
            var colitem = Recipes[data[keys[j]].recipe.id];
            var rid= data[keys[j]].recipe.id;
            var bat =  data[keys[j]];
          
          data[keys[j]].Color=Recipes[data[keys[j]].recipe.id].Color;
          data[keys[j]].recipe=Recipes[data[keys[j]].recipe.id];
     
    }
     base.removeData(sheets[i]);
    base.updateData(sheets[i],data);
  }
  
  
  
}

function STERILISEDATA(){
  

  
//var sheets=['Orders','Mixing','MixingTeam','Production','Printing','Labelling','Packaging','Shipping','References'];
 var sheets=['References']

 var mainrun = false;
  var onerun = true; 
 if(mainrun){
  for(var i=0;i<sheets.length;i++){
   
      
      var data=base.getData(sheets[i]);
      var keys = Object.keys(data);
      var list=JSONtoARR(data);
      for(var j=0;j<list.length;j++){
        if(keys[j]=='undefined'){
          delete data[keys[j]];
          continue;
        }
      if(sheets[i]!='References'){
        if(!data[keys[j]].batch){
        delete data[keys[j]];
        continue;
        }
         if(!data[keys[j]].flavour.sku){
        delete data[keys[j]];
        continue;
        }
      }
       if(sheets[i]=='MixingTeam'){
       
         var innerBatches = list[j].Batches;
         if(!innerBatches){
         delete data[list[j].batch];
         continue;
         
         }
         var batchKeys= Object.keys(innerBatches);
         
         for(var b = 0 ; b < batchKeys.length; b++){
           var ddate = new Date(list[j].Batches[batchKeys[b]].orderdate);
           if(!ddate.getTime() && list[j].Batches[batchKeys[b]].orderdate){
             list[j].Batches[batchKeys[b]].orderdate = list[j].Batches[batchKeys[b]].orderdate.replace('T',' ').replace('Z','');
             var datesplit = list[j].Batches[batchKeys[b]].orderdate.split(' ');
             
             var dmy = datesplit[0].split('-');
             if(datesplit[1]){
               var hms = datesplit[1].split(':');
             }else{
               var hms = [0,0,0]
               }
             list[j].Batches[batchKeys[b]].orderdate = new Date(dmy[2],dmy[1],dmy[0],hms[0],hms[1],hms[2]);
           }
           
           
           if(list[j].Batches[batchKeys[b]].orderdate == 0 || !list[j].Batches[batchKeys[b]].orderdate){
             list[j].Batches[batchKeys[b]].orderdate= 0;
           }else{
             list[j].Batches[batchKeys[b]].orderdate= new Date(list[j].orderdate).getTime();
           }
           
         }
         var ddate = new Date(list[j].orderdate);
         if(!ddate.getTime() && list[j].orderdate){
           list[j].orderdate = list[j].orderdate.replace('T',' ').replace('Z','');
           var datesplit = list[j].orderdate.split(' ');
           
           var dmy = datesplit[0].split('-');
           if(datesplit[1]){
             var hms = datesplit[1].split(':');
           }else{
             var hms = [0,0,0]
             }
           list[j].orderdate = new Date(dmy[2],dmy[1],dmy[0],hms[0],hms[1],hms[2]);
         }
         
         
         if(list[j].orderdate == 0 || !list[j].orderdate){
           data[list[j].batch].orderdate= 0;
         }else{
           data[list[j].batch].orderdate= new Date(list[j].prodDate).getTime();
         }
         
          
       
       }
      
        if(sheets[i]!='Orders' && sheets[i]!='References' && sheets[i]!='Shipping'){
           var ddate = new Date(list[j].prodDate);
          if(!ddate.getTime() && list[j].prodDate){
            list[j].prodDate = list[j].prodDate.replace('T',' ').replace('Z','');
            var datesplit = list[j].prodDate.split(' ');
            
            var dmy = datesplit[0].split('-');
            if(datesplit[1]){
              var hms = datesplit[1].split(':');
            }else{
              var hms = [0,0,0]
              }
            list[j].prodDate = new Date(dmy[2],dmy[1],dmy[0],hms[0],hms[1],hms[2]);
          }
          
        
          if(list[j].prodDate == 0 || !list[j].prodDate){
            data[list[j].batch].prodDate= 0;
          }else{
            data[list[j].batch].prodDate= new Date(list[j].prodDate).getTime();
          }
          
          
          
          
        }
        
         

         if(sheets[i]=='Shipping'){
         
           data[list[j].batch].partialPackaging = isNaN( data[list[j].batch].partialPackaging) ? (isNaN(parseInt( data[list[j].batch].partialPackaging,10)) ? 0:  parseInt( data[list[j].batch].partialPackaging,10)):  data[list[j].batch].partialPackaging;
           data[list[j].batch].partialProduction = isNaN( data[list[j].batch].partialProduction) ? (isNaN(parseInt( data[list[j].batch].partialProduction,10)) ? 0:  parseInt( data[list[j].batch].partialProduction,10)):  data[list[j].batch].partialProduction;

         var sdate=new Date(list[j].dateshipped);
         var ddate = new Date(list[j].datedelivered);
         if(!sdate.getTime() && list[j].dateshipped){
         //"dd-MM-yyyy' 'HH:mm:ss"
           list[j].dateshipped = list[j].dateshipped.replace('T',' ').replace('Z','');
         var datesplit = list[j].dateshipped.split(' ');
        
         var dmy = datesplit[0].split('-');
         if(datesplit[1]){
          var hms = datesplit[1].split(':');
          }else{
           var hms = [0,0,0]
         }
        
             list[j].dateshipped = new Date(dmy[2],dmy[1],dmy[0],hms[0],hms[1],hms[2]);
         }
         
          if(!ddate.getTime() && list[j].datedelivered){
           list[j].datedelivered = list[j].datedelivered.replace('T',' ').replace('Z','');
          var datesplit = list[j].datedelivered.split(' ');
        
         var dmy = datesplit[0].split('-');
           if(datesplit[1]){
          var hms = datesplit[1].split(':');
          }else{
           var hms = [0,0,0]
         }
             list[j].datedelivered = new Date(dmy[2],dmy[1],dmy[0],hms[0],hms[1],hms[2]);
         }
                  var sdate=new Date(list[j].dateshipped);
         var ddate = new Date(list[j].datedelivered);
          data[list[j].batch].datedelivered  = new Date(list[j].datedelivered).getTime() ? new Date(list[j].datedelivered).getTime() : 0; 
           data[list[j].batch].dateshipped  = new Date(list[j].dateshipped).getTime() ? new Date(list[j].dateshipped).getTime() : 0; 
         
         }
        if(list[j].packagingType == "" ||!list[j].packagingType ){
        list[j].packagingType = {}
          if(list[j].packagingType.sku=='' || !list[j].packagingType.sku){
            if(sheets[i]=='References'){
            data[list[j].prod].packagingType={
              name:'',
              sku:'',
              
            };
          }else{
            data[list[j].batch].packagingType={
              name:'',
              sku:'',
              
            };
          }
          }
          
        } 
        if(!list[j].boxname || list[j].boxname == 0){
          var boxname={
            name:'',
            sku:'',
            
          };
          
       
          if(sheets[i]=='References'){
            data[list[j].prod].boxname= boxname;
          }else{
            data[list[j].batch].boxname= boxname;
          }
        }else if(!list[j].boxname.sku || list[j].boxname.sku == 0) {
          var boxname={
            name:'',
            sku:'',
            
          };
          if(sheets[i]=='References'){
            data[list[j].prod].boxname= boxname;
          }else{
            data[list[j].batch].boxname= boxname;
          }
        
        }
        
        if(sheets[i]!='References'){
        
          
          var ddate = new Date(list[j].CompletionDate);
          if(!ddate.getTime() && list[j].CompletionDate){
            list[j].CompletionDate = list[j].CompletionDate.replace('T',' ').replace('Z','');
            var datesplit = list[j].CompletionDate.split(' ');
            
            var dmy = datesplit[0].split('-');
            if(datesplit[1]){
              var hms = datesplit[1].split(':');
            }else{
              var hms = [0,0,0]
              }
            data[list[j].batch].CompletionDate = new Date(dmy[2],dmy[1],dmy[0],hms[0],hms[1],hms[2]);
          }else{
            
            data[list[j].batch].CompletionDate = new Date(list[j].CompletionDate).getTime();
          }
      data[list[j].batch].CompletionDate =   new Date(data[list[j].batch].CompletionDate).getTime() ?  new Date(data[list[j].batch].CompletionDate).getTime() : 0;   
      
        if(list[j].final_status == 0 || !list[j].final_status){
          data[list[j].batch].final_status= "Not Run";
        }else if(list[j].final_status == 'started' || list[j].movedtoNext == 'Busy'){
          data[list[j].batch].final_status= "Busy";
        }else{
          data[list[j].batch].final_status= "Completed";
        } 
          if(data[list[j].batch].movedtoNext ){
            if( data[list[j].batch].movedtoNext == 1){
              data[list[j].batch].final_status= "Completed";
            }else if(data[list[j].batch].movedtoNext == "Busy"){
              data[list[j].batch].final_status= "Busy";
            }else{
              data[list[j].batch].final_status= "Not Run";
            }
            
            
            
            
          }
        if(sheets[i]=='Orders'){
        
          list[j].starttime= data[list[j].batch].runtime;
            var ddate = new Date(list[j].starttime);
            if(!ddate.getTime() && list[j].starttime){
              list[j].starttime = list[j].starttime.replace('T',' ').replace('Z','');
              var datesplit = list[j].starttime.split(' ');
              
              var dmy = datesplit[0].split('-');
              if(datesplit[1]){
                var hms = datesplit[1].split(':');
              }else{
                var hms = [0,0,0]
                }
              data[list[j].batch].starttime  = new Date(dmy[2],dmy[1],dmy[0],hms[0],hms[1],hms[2]);
            }else{
            
                  data[list[j].batch].starttime = new Date(list[j].starttime).getTime();
            }
        }
        
          if((list[j].runtime == 0 || !list[j].runtime) && !list[j].starttime){
            data[list[j].batch].starttime= 0;
          }else if((list[j].runtime == 0 || !list[j].runtime) &&  list[j].starttime){
             data[list[j].batch].starttime= new Date(list[j].starttime).getTime();
          }else{
                data[list[j].batch].starttime= new Date(list[j].runtime).getTime();
            
          }
          delete  data[list[j].batch].runtime
    
            var ddate = new Date(list[j].starttime);
            if(!ddate.getTime() && list[j].starttime){
              list[j].starttime = list[j].starttime.replace('T',' ').replace('Z','');
              var datesplit = list[j].starttime.split(' ');
              
              var dmy = datesplit[0].split('-');
              if(datesplit[1]){
                var hms = datesplit[1].split(':');
              }else{
                var hms = [0,0,0]
                }
              data[list[j].batch].starttime = new Date(dmy[2],dmy[1],dmy[0],hms[0],hms[1],hms[2]);
            }else{
            
                  data[list[j].batch].starttime = new Date(list[j].starttime).getTime();
            }
            
       
        if(sheets[i]=='Printing' || sheets[i]=='Labelling'){
         data[list[j].batch].numLabelsBottles =   list[j].numLabelsBottles ? list[j].numLabelsBottles : 0;
          data[list[j].batch].numLabelsTubes =   list[j].numLabelsTubes ? list[j].numLabelsTubes : 0;
        
        }
        
        
         data[list[j].batch].priority =   list[j].priority ? parseInt(list[j].priority,10) : 0;
         data[list[j].batch].Location =   list[j].Location ? list[j].Location : "";
         
        if(isNaN(data[list[j].batch].starttime)){
          Logger.log(list[j].batch);
        } 
         if(isNaN(data[list[j].batch].CompletionDate)){
          Logger.log(list[j].batch);
        } 
    
        
        }
        
         if(sheets[i]=='References'){
            data[list[j].prod].barcode= isNaN(parseInt(data[list[j].prod].barcode,10)) ? 0 :parseInt(data[list[j].prod].barcode,10);
          }
      }
      
     
       base.removeData(sheets[i]);
      base.updateData(sheets[i],data);
      
      
 
    
  }
  }
if(onerun){  
  var Boxes = base.getData('Boxes');
  var boxList = Object.keys(Boxes);
  for(var i = 0; i < boxList.length; i++){
    if(isNaN(Boxes[boxList[i]].divTubesForBox)){
      Boxes[boxList[i]].divTubesForBox = 0;
    }
  }
  
  base.updateData('Boxes',Boxes);
  
  var FlavourMixes = base.getData('FlavourMixes');
  var FlavourMixesList = Object.keys(FlavourMixes);
  for(var i = 0; i < FlavourMixesList.length; i++){
    var flavours = FlavourMixes[FlavourMixesList[i]].flavours;
    var flavKeys = Object.keys(flavours);
    for(var f = 0 ; f < flavKeys.length; f++){
      FlavourMixes[FlavourMixesList[i]].flavours[flavKeys[f]].val = parseFloat( FlavourMixes[FlavourMixesList[i]].flavours[flavKeys[f]].val);
    }
  }
  
  base.updateData('FlavourMixes',FlavourMixes);
  
    var sheets = [['Misc','Misc','FLAV','float'],['Flavours','Flavours','FLAV','float'],['Packages','Packages','PAC','int'],['Boxes','Boxes','BOX','int'],['Labels','Labels','LAB','int'],
    ['Colors','Color','COL','float'],['Premix','PremixesTypes','GBMIX','float'],['Unbranded','UnbrandedTypes','UB','int'],['Branded','BrandedTypes','BRA','int'],['Bottles','BottleTypes','BOT','int'],['Caps','Lids','CAP','int']];
  sheets = [['Packages','Packages','PAC','int']]
  //clear qty
  for(var s = 0; s < sheets.length; s++){
  
    var Misc = base.getData(sheets[s][1]);
    var MiscList = Object.keys(Misc);
    for(var i = 0; i < MiscList.length; i++){
      if(!Misc[MiscList[i]].sku){
        delete Misc[MiscList[i]]
        continue;
      }
      if(MiscList[i]=='undefined'){
       delete Misc[MiscList[i]]
        continue;
      }
      if(sheets[s][3]=='float'){
        Misc[MiscList[i]].Running =  parseFloat(Misc[MiscList[i]].Running);
        Misc[MiscList[i]].Reserved =  parseFloat(Misc[MiscList[i]].Reserved);
        Misc[MiscList[i]].Completed =  parseFloat(Misc[MiscList[i]].Completed);
      }else{
       Misc[MiscList[i]].Running =  parseInt(Misc[MiscList[i]].Running,10);
        Misc[MiscList[i]].Reserved =  parseInt(Misc[MiscList[i]].Reserved,10);
        Misc[MiscList[i]].Completed =  parseInt(Misc[MiscList[i]].Completed,10);
      
      }
      if(sheets[s][1] == 'Packages'){
       Misc[MiscList[i]].botperPack = isNaN(Misc[MiscList[i]].botperPack) ? Misc[MiscList[i]].botperPack: 1;
       if(!Misc[MiscList[i]].botperPack ||  Misc[MiscList[i]].botperPack == 'undefined'){
       Logger.log( Misc[MiscList[i]] +' '+MiscList[i]);
       }
      }
    }
    base.removeData(sheets[s][1])
    base.updateData(sheets[s][1],Misc);
    
  
  }


  var Logs = base.getData('Log');
  var LogList = Object.keys(Logs);
  for(var i = 0; i < LogList.length; i++){
    if(!Logs[LogList[i]].batch ){
      
      delete Logs[LogList[i]];
      continue;
    }
    Logs[LogList[i]].time = new Date(Logs[LogList[i]].time).getTime() ? new Date(Logs[LogList[i]].time).getTime() : 0;
    Logs[LogList[i]].key = LogList[i].toString();
    Logs[LogList[i]].batch =Logs[LogList[i]].batch.toString();
    if(isNaN(Logs[LogList[i]].time)){
      delete Logs[LogList[i]];
    }
  }
  base.removeData('Log');
  base.updateData('Log',Logs);
  }
}



function STERILISE_Schedules(){
var breaks = base.getData("Schedules Breaks");
base.removeData("Schedules Breaks");
var arr = Object.keys(breaks);
for(var i = 0 ; i < arr.length;i++){
breaks[arr[i]].day=arr[i];
}
base.updateData("SchedulesBreaks",breaks);
 
var Reference = base.getData("Schedules Reference");
base.removeData("Schedules Reference");
base.updateData("SchedulesReference",Reference);

var schedules =  base.getData("Schedules");
var newSCheduleObj = {};
var list = Object.keys(schedules);
for(var i = 0 ; i < list.length;i++){
schedules[list[i]].id = list[i].toString();
newSCheduleObj[list[i]] = {
  id:list[i].toString(),
  Machines: {},
  Batches:schedules[list[i]].Batches,
};

  var machines = schedules[list[i]].Machines
  var MachList = Object.keys(machines);
  for(var m = 0 ; m < MachList.length; m++){

    newSCheduleObj[list[i]].Machines[MachList[m]] = {
    id:MachList[m],
    times:{}
  }
      var times= machines[MachList[m]];
    var timesList = Object.keys(times);
    for(var t = 0 ; t< timesList.length;t++){
    var batch = Object.keys(times[timesList[t]])[0];
    newSCheduleObj[list[i]].Machines[MachList[m]].times[timesList[t]]={
      id:timesList[t],
      Batch:times[timesList[t]][batch]
    
    }
    
    
    }
  
  }



}
base.removeData('Schedules');
base.updateData('Schedules',newSCheduleObj);


}




function STERILISE_highest(){
var largest = base.getData("highestBatch");
largest = parseInt('largest');

var obj={
batch:largest,
id:'1'
};
base.removeData("highestBatch");

base.updateData('highestBatch',obj);


 

var obj={
status:"On",
id:'1'
};
base.removeData("LogStatus");

base.updateData('LogStatus',obj);

var obj={
status:"On",
id:'1',
nic:5,
cbd:1
};
base.removeData("Roundups");

base.updateData('Roundups',obj);
}






