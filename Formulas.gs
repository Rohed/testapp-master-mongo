function calcQTY(stocking,numBottles,fill,suffix,cust,suf2){
if(suffix=='S'||suf2=='RU'){
return stocking;

}else{
 

return fill*numBottles/1000;
}

}
function calcNic(nico,QTY){

return nico*QTY/1000;


}
function calcVG(vg,QTY){

return vg*QTY/1000;


}
function calcPG(pg,QTY){
if(!pg){
pg=0;
}
return pg*QTY/1000;


}

function calcFlav(flv,QTY){

return flv*QTY/1000;


}


function getRecipe(recipeID){

var item=base.getData('Recipes/'+recipeID);
return item;
}