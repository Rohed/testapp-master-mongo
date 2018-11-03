var sheets=['MixingTeam','Production','Printing','Labelling','Packaging','Shipping'];
var QTYSHEETS=['Misc','Packages','Flavours','Labels','Lids','Boxes','PremixesTypes','UnbrandedTypes','BrandedTypes'];
 
var RESTORE_PASSWORD = "123";
var PASSWORD='PASSWORD';
var SLSHEETPASSWORD="SLSHEET";
var PREMIX_STOCK_SUFFIX='S';
var UNBRANDED_STOCK_SUFFIX='U';
var UNBRANDED_STOCK_SUFFIX2='OV';
var BRANDED_STOCK_SUFFIX='B';

function getRecipeDropdown1(){


var list=[['VG/PG : 50 / 50 Nicotine : 3MG',5050,3,428,434,53,200],
['VG/PG : 50 / 50 Nicotine : 6MG',5050,6,375,434,106,200],
['VG/PG : 50 / 50 Nicotine : 12MG',5050,12,269,434,212,200],
['VG/PG : 50 / 50 Nicotine : 18MG',5050,18,163,434,318,200],
['VG/PG : 50 / 50 Nicotine : 0MG',5050,0,481,434,0,200],
['VG/PG : 40 / 60 Nicotine : 0MG',4060,0,527,404,0,200],
['VG/PG : 40 / 60 Nicotine : 6MG',4060,6,422,404,105,200],
['VG/PG : 40 / 60 Nicotine : 12MG',4060,12,317,404,210,200],
['VG/PG : 40 / 60 Nicotine : 18MG',4060,18,212,404,315,200],
['VG/PG : 70 / 30 Nicotine : 0MG',7030,0,652,274,0,220],
['VG/PG : 70 / 30 Nicotine : 3MG',7030,3,548,274,53,220],
['VG/PG : 70 / 30 Nicotine : 6MG',7030,6,773,274,104,220],
['VG/PG : 80 / 20 Nicotine : 0MG',8020,0,720,198,0,220],
['VG/PG : 80 / 20 Nicotine : 3MG',8020,3,863,198,53,220],
['VG/PG : 90 / 10 Nicotine : 0MG',9010,0,810,79,0,240],
['VG/PG : 90 / 10 Nicotine : 3MG',9010,3,428,79,53,240],
['VG/PG : 90 / 10 Nicotine : 6MG',9010,6,757,79,106,240]];


return list;
}


var IDENTIFIERS = {
  BottleTypes : "sku",
 Boxes : "sku",
 BrandedTypes : "sku",
 Brands : "sku",
 Color : "sku",
 Customers : "sku",
 FillLevels : "sku",
 FlavourMixes :"sku",
 FlavourMixOrders : "batch",
 Flavours : "sku",
 highestBatch :"batch",
 Inventory : "key",
 Labelling : "batch",
 Labels : "sku",
 Lids : "sku",
 Log : "id",
 Machines : "id",
 Misc : "name",
 Mixing : "batch",
 MixingTeam : "batch",
 Orders : "batch",
 Packages : "sku",
 Packaging : "batch",
 PremixColoring : "batch",
 PremixesTypes : "sku",
 Printing : "batch",
 Production : "batch",
 Recipes : "id",
 References : "productcode",
 SchedulesBreaks : "day",
 SchedulesReference : "id",
 Schedules : "id",
 Shipping : "batch",
 UnbrandedTypes : "sku",
 importBlankPCPD : "key",
 times : "id",
};

function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}
function JSONtoARR(data) {
  
  
  if (data) {
    
    if(Array.isArray(data)){
      data=data.filter(function(item){
        return item !== null;
      });
      
      return data;
    }else{
      
      var result = Object.keys(data).map(function(key) {
      
        return data[key];
      });
          result=result.filter(function(item){
        return item !== null;
      });
      return result;
      
    }
  } else {
    return [];
  }
  
}

function ARRtoJSON(data, page) {
  if (data) {
    var obj = {};
 if (data.length > 0) {
    data.map(function(item) {
      if (item[IDENTIFIERS[page]]) {
        obj[item[IDENTIFIERS[page]]] = item;
      }
    });

    return obj;
    } else {
      return {};
    }
  } else {
    return {};
  }
};

function getBrandName(data,BB){
  if(BB){
  var fullProd =base.getData('References/'+data.productcode);
  var dat = fullProd.linkedBB;
  if(dat){
  return dat;
  }else{
  return data.productcode;
  }
   
  }else{
  return data.productcode;
  }
}

function getUnbrandName(data){
 var dat=base.getData('References/'+data.productcode);
 generateForSingleUnbrand2(dat.unbrandSKU, dat.unbranddescr);
return dat.unbrandSKU;
}

function getPremixSKU(data,colored){
 var dat=base.getData('References/'+data.productcode);

   
 
  if(colored){
    generateForSinglePremix2(dat.premixSKUColored, dat.premixdescrColored);
    return dat.premixSKUColored;
  }else{
    
    generateForSinglePremix2(dat.premixSKU, dat.premixdescr);
    return dat.premixSKU;
    
    
  }
}

function setRecipesJSON(){
var recipes=getRecipeDropdown1();

var options='{';
for(var i=0;i<recipes.length;i++){
    var item={
    "nic":recipes[i][2],
    "ratio":recipes[i][1],
    "name":recipes[i][0],
    "VGrec":recipes[i][3],
    "PGrec":recipes[i][4],
    "Nicorec":recipes[i][5],
    'Flavrec':recipes[i][6],

  };
  var str=JSON.stringify(item);
  options+='"'+recipes[i][0].replace(/\//g,'')+'":'+str+',';
  }
 options+='}';
 Logger.log(options);
 var obj=JSON.parse(options);

  base.updateData('Recipes',obj);
 


}

function getBrandDropdown(){
var data=base.getData('Brands');

return JSONtoARR(data).sort(sortSTRINGLH('name'));//.sort(superSort1('name'));
}



function getCustomerDropdown(){

var data=JSONtoARR(base.getData('Customers')).sort(sortSTRINGLH('name'));
return data;//.sort(superSort1('name'));



}


function getPackagingDropdown(){

var data=JSONtoARR(base.getData('Packages'));


return data.filter(function(item){return item.name }).sort(sortSTRINGLH('name'));




}


function getLidDropdown(){
var data=JSONtoARR(base.getData('Lids')).sort(sortSTRINGLH('name'));
return data;//.sort(superSort1('name'));

}


function getLidDropdown2(){
var data=JSONtoARR(base.getData('Lids')).sort(sortSTRINGLH('name'));
return data;//.sort(superSort1('name'));
}
function getBottlesDropdown2(){

var data=JSONtoARR(base.getData('BottleTypes')).sort(sortSTRINGLH('name'));
return data;//.sort(superSort1('name'));

}
function getBottlesDropdown(){

var data=JSONtoARR(base.getData('BottleTypes')).sort(sortSTRINGLH('name'));
return data;//.sort(superSort1('name'));
}


function getFlavourDropdown(){


var data=JSONtoARR(base.getData('Flavours'));
if (data) {
        var result = data.sort(sortSTRINGLH('name'));

      
return result;

}else {return [];}







}

function getRecipeDropdown(){


var data=JSONtoARR(base.getData('Recipes'));
  if (data) {
    var result = data.sort(sortSTRINGLH('name'));
    var retArr = [];
    for (var i = 0; i < result.length; i++) {
      
      retArr.push([result[i].name,result[i].id]);
      
      
    }
    
  }

return retArr;




}
/*
id: String,
  action: String,
  batch: String,
  data: String,
  msg: String,
  page: String,
  status: Boolean,
  time: String,
  type: String,
  user: String
*/


function testLog(){

    var LOGDATA = {
        status: true,
        msg: '',
        action: 'New Order',
        batch: 'testbatchh',
        page: 'Orders',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };

 
 logItem(LOGDATA);
}
function logItem(item){
  
  item.time=(new Date()).getTime();
  if(item.data){
    item.data=item.data.join(';');
  }else{
    item.data='';
  }
  item.batch=item.batch.toString();
  item.key= item.time.toString();
  base.setData('Log/'+item.key,item); 
  //  }
}


function logUser(page,app){
  var LOGDATA = {
    status: true,
    msg: '',
    action: 'App Opened',
    batch:app,
    page: page,
    user: Session.getActiveUser().getEmail(),
    data: new Array()
  };
  logItem(LOGDATA)
  
} 


function getStatus(){
  var status=base.getData('LogStatus/1');
  if(status.status == 'On'){
    return true;
  }else{
    return false;
  }
  
  
}

function setStatusinDB(attr){
 
  Logger.log(attr);
  if(attr=='Off'){
    var data={
      status:'On',
    }
    base.updateData('LogStatus/1',data);
    return true;
  }else{
     var data={
      status:'Off',
    }
     base.updateData('LogStatus/1',data);
    return false;
  }
  
}