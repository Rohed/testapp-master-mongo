function makeKEYSARR(){

  
  var keys=['orderdate','starttime','machineP','machineL','batch','orderID','productcode','productdescription','priority','customer','brand','recipe.name','flavour.name','bottles','stocking','btype','lid','packagingType.name','QTY','flavvalue','VGval','PGval','Nico','CBDvalue','mixing','premixed',
            'unbranded','branded','backtubed','mixing_status','production_status','printing_status','labeling_status','packaging_status','final_status','partialProduction','partialPackaging'];
  keys=keys.concat(['final_status','priority','batch','orderID','productcode','productdescription','recipe.name','flavour.name','orderdate','QTY','VGval','PGval','Nico','CBDvalue','MCTval','flavvalue','mixing','premixed','unbranded','branded','backtubed']);  
  keys=keys.concat(['row','menu','orderdate','started','batch','stocking','flavourmix.name','final_status']);
  keys=keys.concat(['Completed','priority','prodDate','batches','MIXNAME','RECIPE','FLAVOUR','orderDates','QTYTOTAL','VGval','PGval','Nico','CBDvalue','MCTval','flavvalue','Notes','Location','factory','starttime','CompletionDate','vgSupplier','pgSupplier','nicSupplier','flavSupplier']);
  keys=keys.concat(['mixing_status','orderdate','batch','orderID','productcode','productdescription','mixbatch','priority','customer','brand','recipe.name','flavour.name','bottles','btype','lid','packagingType.name','starttime','CompletionDate','Completed','Location','machineP']);
  keys=keys.concat(['production_status','orderdate','batch','numLabelsBottles','numLabelsTubes','expDate','orderID','productcode','productdescription','priority','customer','brand','recipe.name','flavour.name','bottles','btype','lid','packagingType.name','botlabel','boxname.name','starttime','CompletionDate','Completed','Location']);
  keys=keys.concat(['production_status','orderdate','batch','orderID','productcode','productdescription','priority','customer','brand','recipe.name','flavour.name','bottles','btype','lid','packagingType.name','starttime','CompletionDate','Completed','Location','machineL']);
  keys=keys.concat(['production_status','printing_status','orderdate','batch','orderID','productcode','productdescription','PRINTCODE','customer','brand','recipe.name','flavour.name','bottles','btype','lid','packagingType.name','starttime','CompletionDate','Completed','Location']);
  keys=keys.concat(['orderdate','batch','orderID','productcode','productdescription','priority','PRINTCODE','customer','brand','recipe.name','flavour.name','bottles','btype','lid','packagingType.name','final_status','shipping_status','SHIPPINGCODE','dateshipped','trackingNo','datedelivered', 'Location']);
  keys=keys.concat(['row','menu','orderdate','started','batch','stocking','flavourmix.name','final_status']);
   keys=uniq(keys);
   
   var fullKEYSARR=[];
   var numkeys=['row','QTY','VGval','PGval','Nico','CBDvalue','MCTval','flavvalue','mixing','premixed','unbranded','branded','backtubed','batch','bottles','stocking'];
   var datekeys=['orderdate','prodDate','CompletionDate','starttime'];
   var specials=['orderID'];
  for(var i=0;i<keys.length;i++){
  var typeofkey;
    var isnumb=numkeys.indexOf(keys[i]);
     var isdate=datekeys.indexOf(keys[i]);
    if( isnumb>=0){
      typeofkey='num';
    }else if(isdate>=0){
      typeofkey='date';
    }else{
      typeofkey='string';
    }
  
    fullKEYSARR.push(["'"+keys[i]+"'","'"+typeofkey+"'"]);
  
  }
  Logger.log(fullKEYSARR);
}
var keys=[['orderdate', 'date'], ['starttime', 'num'], ['machineP', 'string'], ['machineL', 'string'], ['batch', 'num'],['fill', 'num'], ['orderID', 'special'], ['productcode', 'string'],
['productdescription', 'string'], ['priority', 'num'], ['customer', 'string'], ['brand', 'string'], ['recipe.name', 'string'], ['flavour.name', 'string'], ['bottles', 'num']
, ['stocking', 'num'], ['btype', 'string'], ['lid', 'string'], ['packagingType.name', 'string'], ['QTY', 'num'], ['flavvalue', 'num'], ['VGval', 'num'], ['AGval', 'num'], ['PGval', 'num'],
['Nico', 'num'],['Nicosalts', 'num'], ['CBDvalue', 'num'], ['mixing', 'num'], ['premixed', 'num'], ['unbranded', 'num'], ['branded', 'num'], ['backtubed', 'num'], ['mixing_status', 'string'],
['production_status', 'string'], ['printing_status', 'string'], ['labeling_status', 'string'], ['packaging_status', 'string'], ['final_status', 'string'], ['partialProduction','string'],
['partialPackaging', 'string'], ['MCTval', 'num'], ['row', 'num'], ['menu', 'string'], ['started', 'string'], ['flavourmix.name', 'string'], ['Completed', 'string'],
['prodDate', 'date'], ['batches', 'string'], ['MIXNAME', 'string'], ['RECIPE', 'string'], ['FLAVOUR', 'string'], ['orderDates', 'string'], ['QTYTOTAL', 'string'], ['Notes', 'string'],
['Location', 'string'], ['factory', 'string'], ['starttime', 'date'], ['CompletionDate', 'date'], ['vgSupplier', 'string'], ['pgSupplier', 'string'], ['nicSupplier', 'string'],
['flavSupplier', 'string'], ['mixbatch', 'string'], ['numLabelsBottles', 'string'], ['numLabelsTubes', 'string'], ['expDate', 'string'], ['botlabel', 'string'], ['boxname.name', 'string'],
['PRINTCODE', 'string'], ['shipping_status', 'string'], ['SHIPPINGCODE', 'string'], ['dateshipped', 'string'], ['trackingNo', 'string'], ['datedelivered', 'string'], ['final_status', 'string']]


function sortByLowest(data) {
var retArr=[];
var flavGroup=new Array();
var flavArr=[];
for(var i=0;i<data.length;i++){
  flavArr.push(data[i].flavour.sku);
}

var unique = flavArr.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
})

for(var i=0;i<data.length;i++){
  if(data[i].userset==true){
  retArr.push(data[i]);
  continue;
  }

    for(var j=0;j<unique.length;j++){
      if(unique[j]==data[i].flavour.sku){
      if(flavGroup[j]){
      flavGroup[j].push(data[i]);
       break;
       }else{
        flavGroup[j]=new Array(data[i]);
        break;
       }
      }
    }
    

  }
var newFlavGroup=[];
for(var i=0;i<flavGroup.length;i++){
var type=(typeof flavGroup[i]);
if(type =='object'){

}else{
  flavGroup.splice(i,1);
  i--;
}
}

retArr.sort(sortFunction);

for(var i=18;i<flavGroup.length;i++){
if(flavGroup[i].length>1){
try{
flavGroup[i].sort(sortFunction2);
}catch(e){
Logger.log('Failed at '+i);
}
}
}

for(var i=0;i<flavGroup.length;i++){

for(var j=0;j<flavGroup[i].length;j++){

 retArr.push(flavGroup[i][j]);


}


}



return retArr

}

function sortFunction(a, b) {
if(!a.row){return -1}
if(!b.row){return -1}
try{
    if (a.row == b.row) {
        return 0;
    }
    else {
        return (a.row < b.row) ? -1 : 1;
    }

  }catch(e){return 0;}          
}

function sortFunction2(a, b) {
try{
if(!a.recipe){
return -1;
}
if(!a.recipe.name){
return -1;
}
if(!b.recipe){
return -1;
}
if(!b.recipe.name){
return -1;
}
  if(a.recipe.name.match('Nicotine')){
    if(!a.recipe.nic){
      return -1;
    }
    if(!b.recipe.nic){
      return 1;
    }
  }else{
        if(!a.recipe.cbd){
      return -1;
    }
    if(!b.recipe.cbd){
      return 1;
    }
    
    
    
  }
if(a.recipe.name.match('Nicotine')){
    if (a.recipe.nic === b.recipe.nic) {
        return 0;
    }
    else {
        return (parseInt(a.recipe.nic,10) > parseInt(b.recipe.nic,10)) ? -1 : 1;
    }
}else{
       if (a.recipe.cbd === b.recipe.cbd) {
        return 0;
    }
    else {
        return (parseInt(a.recipe.cbd,10) > parseInt(b.recipe.cbd,10)) ? -1 : 1;
    }

    }
      }catch(e){return 0;}  
}

function rearange(sheet){

var data=getSheetData(sheet);
var rawData=base.getData(sheet);
for(var i=0;i<data.length;i++){
if(sheet=='MixingTeam'){
rawData[data[i].MIXNAME].row=i+1;
}else{
rawData[data[i].batch].row=i+1;


}
}




base.updateData(sheet,rawData);
}


function sortBY(data,type,key,page){
var sortindex=keys.getIndex(key);
var sorttype=keys[sortindex][1];
var rett;
if(type=='HL'){ 
if(sorttype=='num'){
rett=data.sort(sortNUMHL(key));
}else if(sorttype=='string'){
rett=data.sort(sortSTRINGHL(key));
}else if(sorttype=='date'){
rett=data.sort(sortDATEHL(key));
}else if(key=='orderID'){
rett=data.sort(sortOrderIDsHL);
}else{
rett=data.sort(superSort2(key));
}

}else{
if(sorttype=='num'){
rett=data.sort(sortNUMLH(key));
}else if(sorttype=='string'){
rett=data.sort(sortSTRINGLH(key));
}else if(sorttype=='date'){
rett=data.sort(sortDATELH(key));
}else if(key=='orderID'){
rett=data.sort(sortOrderIDs);
}else{
rett=data.sort(superSort1(key));
}

}
return [page,rett];

}

function superSort1(key){

   return function(a, b) {
             if(!a[key]){return 1;}
        if(!b[key]){return -1;}
       var x = a[key].toString().toLowerCase().replace(/[^0-9a-z]/gi, '');
       var y = b[key].toString().toLowerCase().replace(/[^0-9a-z]/gi, '');
      
        return x-(y);
        
        //return 0;

       
     };
     
}

function superSort2(key){

   return function(a, b) {
       if(!a[key]){return -1;}
        if(!b[key]){return 1;}
       var x = a[key].toString().toLowerCase().replace(/[^0-9a-z]/gi, '');
       var y = b[key].toString().toLowerCase().replace(/[^0-9a-z]/gi, '');
       
               return y-(x);
        
     //   return 0;
       
     };
     
}


function sortOrderIDs(a,b){

var x=a.orderID.substr(4,a.orderID.length);
var y=b.orderID.substr(4,b.orderID.length);
if(!y){return 1};
if(!x){return -1};
return parseInt(x,10)-parseInt(y,10);


}
function sortOrderIDsHL(a,b){

var x=a.orderID.substr(4,a.orderID.length);
var y=b.orderID.substr(4,b.orderID.length);
if(!y){return -1};
if(!x){return 1};
return parseInt(y,10)-parseInt(x,10);


}
function sortNUMLH(key){
  return function(a, b) {

var x = parseFloat(a[key]);
    var y = parseFloat(b[key]);
    if(isNaN(x)){
      x=Infinity;
    }
    if(isNaN(y)){
      y=Infinity;
    }
    return x-y;
    

  
//  return (parseFloat(a[key])===null)-(parseFloat(b[key])===null) || -(parseFloat(a[key])>parseFloat(b[key])||+(parseFloat(a[key]))<parseFloat(b[key]));
  };
}
function TESTFLOAT(){
var x;
Logger.log(parseFloat(x));
Logger.log(isNaN(parseFloat(x)));

}
function sortNUMHL(key){

  return function(a, b) {
    
    var x = parseFloat(a[key]);
    var y = parseFloat(b[key]);
    if(isNaN(x)){
      x=Infinity;
    }
    if(isNaN(y)){
      y=Infinity;
    }
    return y-x;
//      return (parseFloat(b[key])===null)-(parseFloat(a[key])===null) || -(parseFloat(b[key])>parseFloat(a[key])||+(parseFloat(b[key]))<parseFloat(a[key]));

  };
}

function sortSTRINGLH(key){
  return function(a, b) {
    if(!a[key]){return -1;}
    if(!b[key]){return -1;}
  return a[key].toString().toLowerCase().localeCompare(b[key].toString().toLowerCase())

  };

}
function sortSTRINGHL(key){

  return function(a, b) {
    if(!a[key]){return -1;}
    if(!b[key]){return -1;}
  return b[key].toString().toLowerCase().localeCompare(a[key].toString().toLowerCase())
    
  };
}


function sortDATELH(key){
  return function(a, b) {
    if(!a[key]){return -1;}
    if(!b[key]){return 1;}
 
    var logitema=new Date(a[key]);
    if(logitema.getTime()){}else{
      var from=a[key].toString().replace(/\//g,'-').split("-");
      logitema= new Date(from[2], from[1] , from[0]);
    }
    var logitemb=new Date(b[key]);
    if(logitemb.getTime()){}else{
      var from=b[key].toString().replace(/\//g,'-').split("-");
      logitemb= new Date(from[2], from[1] , from[0]);
    }

    
     return logitema.getTime()-logitemb.getTime();
  };
  
 

}
function sortDATEHL(key){

  return function(a, b) {
    if(!a[key]){return -1;}
    if(!b[key]){return 1;}
 
    var logitema=new Date(a[key]);
    if(logitema.getTime()){}else{
      var from=a[key].toString().replace(/\//g,'-').split("-");
      logitema= new Date(from[2], from[1] , from[0]);
    }
    var logitemb=new Date(b[key]);
    if(logitemb.getTime()){}else{
      var from=b[key].toString().replace(/\//g,'-').split("-");
      logitemb= new Date(from[2], from[1] , from[0]);
    }

    
     return logitemb.getTime()-logitema.getTime();
  };
}


function sortgetOrderIDsPRIORTY(a,b){
  if(!a[2]){return 1;}
    if(!b[2]){return -1;}
    var x = parseFloat(a[2]);
    var y = parseFloat(b[2]);
    
    return y-x;

}
function sortPrioritySpecialHL(a,b){
 if(!a.priority == 0){return -9999;}
    if(!b.priority == 0){return -9999;}
    var x = a.priority
    var y = b.priority
    
    return y-x;


}

function sortPrioritySpecialLH(a,b){
 if(!a.priority == 0){return -9999;}
    if(!b.priority == 0){return -9999;}
    var x = a.priority
    var y = b.priority
    
    return x-y;


}
function sortgetOrderIDsDATE(a,b){
   if(!a[0]){return -1;}
    if(!b[0]){return 1;}
 
    var logitema=new Date(a[0]);
    if(logitema.getTime()){}else{
      var from=a[0].replace(/\//g,'-').split("-");
      logitema= new Date(from[2], from[1] , from[0]);
    }
    var logitemb=new Date(b[0]);
    if(logitemb.getTime()){}else{
      var from=b[0].replace(/\//g,'-').split("-");
      logitemb= new Date(from[2], from[1] , from[0]);
    }

    
     return logitemb.getTime()-logitema.getTime();

}