
function getBatchesInMIXBATCH(mixbatch) {
    var mixARR = [];
    if (mixbatch.Batches) {
        var result = Object.keys(mixbatch.Batches).map(function(key) {
            return [Number(key), mixbatch.Batches[key]];
        });
        for (var i = 0; i < result.length; i++) {
            mixARR.push(result[i][1]);
        }
    }
    return mixARR;
}

function createMixOrder(data) {
    var LOGARR = [];
    try {
        var orig = {
            'recipe': data.recipe,
            'batch': data.batch,
            'flavour': data.flavour,
              'brand': data.brand,
            'orderdate': data.orderdate,
             'Color': data.Color,
            'QTY': data.QTY,
            'VGval': data.VGval,
            'PGval': data.PGval,
            'flavvalue': data.flavvalue,
            'MCTval': data.MCTval,
            'flavrecipe': data.flavrecipe,
            'VGrecipe': data.VGrecipe,
            'PGrecipe': data.PGrecipe,
            'MCTval': data.MCTval,
            'MCTrecipe': data.MCTrecipe,
            'AGval': data.AGval,
            'AGrecipe': data.AGrecipe,
            'customer': data.customer,
            'orderID': data.orderID,
            'starttime': 0,
            'CompletionDate': 0,
            'Completed': "",
            'Notes': '',
            'priority': data.priority,
            'Location': "",
            'productcode': data.productcode,
            'productdescription': data.productdescription,
            'dudpremixCode': "",
            'forpremix':0,
            'haspremix':false,
            'final_status':"Not Run"
        };
        if (data.haspremix) {
            orig.haspremix = true;
            var dudcode = data.dudpremixCode
            orig.dudpremixCode = dudcode;
            var forpremix = data.forpremix
            orig.forpremix = forpremix;
        } else {
            orig.haspremix = false;
        }
       
            orig.Nico = data.Nico;
            orig.Nicotrecipe = data.Nicotrecipe;
           orig.Nicosalts = data.Nicosalts;
            orig.Nicotrecipesalts = data.Nicotrecipesalts;
       
            orig.CBDvalue = data.CBDvalue;
            orig.CBDrecipe = data.CBDrecipe;
       
        var mixingData = base.getData('MixingTeam');
        var mixARR = [];
        if (mixingData) {
            var result = Object.keys(mixingData).map(function(key) {
                return [Number(key), mixingData[key]];
            });
            for (var i = 0; i < result.length; i++) {
                mixARR.push(result[i][1]);
            }
        }
        var SPLIT = 0;
        var splitMultiples = [];
        if (data.QTY > 25) {
            for (var i = 25; i < data.QTY;) {
                splitMultiples.push(25);
                SPLIT++;
                data.QTY = data.QTY - 25;
            }
            for (var i = 0; i < splitMultiples.length; i++) {
                var newData = {
                    'recipe': data.recipe,
                    'batch': data.batch,
                    'flavour': data.flavour,
                    'orderdate': data.orderdate,
                    'QTY': splitMultiples[i],
                    'VGval': data.VGval,
                    'PGval': data.PGval,
                    'MCTval': data.MCTval,
                    'AGval': data.AGval,
                      'brand': data.brand,
                    'MCTrecipe': data.MCTrecipe,
                    'flavvalue': data.flavvalue,
                    'flavrecipe': data.flavrecipe,
                    'VGrecipe': data.VGrecipe,
                    'PGrecipe': data.PGrecipe,
                    'AGrecipe': data.AGrecipe,
                    'customer': data.customer,
                    'orderID': data.orderID,
                    'Color': data.Color,
                    'starttime': 0,
                    'CompletionDate': 0,
                    'Completed': 0,
                    'Notes': '',
                    'priority': data.priority,
                    'Location': 0,
                    'productcode': data.productcode,
                    'productdescription': data.productdescription
                };
              
                    newData.Nico = data.Nico;
                    newData.Nicotrecipe = data.Nicotrecipe;
                    newData.Nicosalts = data.Nicosalts;
                    newData.Nicotrecipesalts = data.Nicotrecipesalts;
                    
                    newData.CBDvalue = data.CBDvalue;
                    newData.CBDrecipe = data.CBDrecipe;
             
                LOGARR.push(['Sent to Mixing Team:', newData.QTY]);
                toMixingTeam(newData, true, '');
            }
        }
        orig.split = SPLIT;
        if (data.QTY == 0) {
            return 'Success';
        }
        if (mixARR.length) {
            for (var i = 0; i < mixARR.length; i++) {
                if (data.QTY == 0) {
                    return 'Success';
                }
                var addToOld = {
                    'check': false,
                    'amount': 0
                };
                var createNew = {
                    'check': false,
                    'amount': 0
                };
                var found = false;
                if ((mixARR[i].FLAVOUR == data.flavour.name) && (mixARR[i].RECIPE == data.recipe.name) && (mixARR[i].final_status =="Not Run")) {
                    var combined = mixARR[i].QTYTOTAL + data.QTY;
                    var total = mixARR[i].QTYTOTAL;
                    if (combined <= 25) {
                        addToOld.check = true;
                        addToOld.amount = data.QTY;
                        SPLIT++;
                    } else if (total < 25) {
                        addToOld.check = true;
                        addToOld.amount = 25 - mixARR[i].QTYTOTAL;
                        createNew.check = true;
                        createNew.amount = data.QTY - (25 - mixARR[i].QTYTOTAL);
                        SPLIT += 2;
                    } else {
                        continue;
                    }
                    if (addToOld.check) {
                        data.QTY = addToOld.amount;
                        toMixingTeam(data, false, mixARR[i]);
                        found = true;
                        data.QTY = data.QTY - addToOld.amount;
                        if (createNew.check == false) {
                            break;
                        }
                    }
                    if (createNew.check) {
                        data.QTY = createNew.amount;
                        LOGARR.push(['Sent to Mixing Team:', data.QTY]);
                        toMixingTeam(data, true, '');
                        data.QTY = data.QTY - createNew.amount;
                        break;
                    }
                }
            }
            if (!found) {
                LOGARR.push(['Sent to Mixing Team:', data.QTY]);
                toMixingTeam(data, true, '');
                SPLIT++;
            }
            orig.split = SPLIT;
            LOGARR.push(['Sent to Mixing:', orig.QTY]);
            LOGARR.push(['Mixing Split(s):', SPLIT]);
            toMixing(orig);
        } else {
            SPLIT++;
            orig.split = SPLIT;
            LOGARR.push(['Sent to Mixing Team:', data.QTY]);
            LOGARR.push(['Mixing Split(s):', SPLIT]);
            toMixingTeam(data, true, '');
            toMixing(orig);
        }
        // return true;
    } catch (e) {
        LOGARR.push(['Failed at Mixing Split(s):', e.message]);
        //  return e.message;
    }
    return LOGARR;
}

function toMixingTeam(data, createNew, old) {
    if (createNew) {
        var mixingData = base.getData('MixingTeam');
        var mixARR = [];
        if (mixingData) {
            var result = Object.keys(mixingData).map(function(key) {
                return [Number(key), mixingData[key]];
            });
            var row = result.length + 1;
            if (result[result.length - 1][1].MIXNAME) {
                var mix = result[result.length - 1][1].MIXNAME;
            } else {
                var mix = result[result.length - 2][1].MIXNAME;
            }
            var batchNo = parseInt(mix.substring(6), 10) + 1;
        } else {
            var row = 1;
            var batchNo = 1;
        }
        var mixingData = {
            'recipe': data.recipe,
            'batch': data.batch,
            'flavour': data.flavour,
            'orderdate': data.orderdate,
            'QTY': data.QTY,
            'mixbatch': 'GBVCO' + (30000 + batchNo),
            'VGval': data.VGval,
            'PGval': data.PGval,
            'customer': data.customer,
            'orderID': data.orderID,
              'brand': data.brand,
            'MCTval': data.MCTval,
            'MCTrecipe': data.MCTrecipe,
            'AGval': data.AGval,
            'AGrecipe': data.AGrecipe,
            'flavvalue': data.flavvalue,
            'flavrecipe': data.flavrecipe,
            'VGrecipe': data.VGrecipe,
            'PGrecipe': data.PGrecipe,
            'starttime': 0,
            'CompletionDate': 0,
            'Completed': 0,
            'Notes': '',
            'priority': data.priority,
            'Location': 0
        };
        if (data.haspremix) {
            mixingData.haspremix = true;
            var dudcode = data.dudpremixCode
            mixingData.dudpremixCode = dudcode;
            var forpremix = data.forpremix
            mixingData.forpremix = forpremix;
        } else {
            mixingData.haspremix = false;
        }
    
            mixingData.Nico = data.Nico;
            mixingData.Nicotrecipe = data.Nicotrecipe;
            mixingData.Nicosalts = data.Nicosalts;
            mixingData.Nicotrecipesalts = data.Nicotrecipesalts;
            
      
            mixingData.CBDvalue = data.CBDvalue;
            mixingData.CBDrecipe = data.CBDrecipe;
        
        var MIXBATCH = {
            orderdate: Utilities.formatDate(new Date(), "GMT", "dd-MM-yyyy"),
            QTYTOTAL: data.QTY,
            Batches:[],
            MIXNAME: mixingData.mixbatch,
            FLAVOUR: data.flavour.name,
            RECIPE: data.recipe.name,
            VGval: data.VGval,
            PGval: data.PGval,
            'flavour': data.flavour,
            flavvalue: data.flavvalue,
            recipe: data.recipe,
            'Completed': "",
            'Location': "",
            'starttime': 0,
            'Notes': '',
            'row': row,
            'userset': false,
            'CompletionDate': 0,
            'customer': data.customer,
            'orderID': data.orderID,
            'final_status':"Not Run"
        };
      
            MIXBATCH.Nico = data.Nico;
            MIXBATCH.nic = data.recipe.nic;
            MIXBATCH.Nicosalts = data.Nicosalts;
            MIXBATCH.nicsalts = data.recipe.nicsalts;
        
            MIXBATCH.CBDvalue = data.CBDvalue;
            MIXBATCH.cbd = data.recipe.cbd;
           MIXBATCH.Batches.push(mixingData);
        base.updateData('MixingTeam/' + mixingData.mixbatch, MIXBATCH);
    } else {
        var MIXBATCH = base.getData('MixingTeam/' + old.MIXNAME);
        MIXBATCH.QTYTOTAL = MIXBATCH.QTYTOTAL + data.QTY;
      //  base.updateData('MixingTeam/' + old.MIXNAME, MIXBATCH);
        var mixingData = {
            'recipe': data.recipe,
            'batch': data.batch,
            'flavour': data.flavour,
            'orderdate': data.orderdate,
            'QTY': data.QTY,
            'mixbatch': old.mixbatch,
            'VGval': data.VGval,
            'PGval': data.PGval,
            'MCTval': data.MCTval,
            'MCTrecipe': data.MCTrecipe,
            'AGval': data.AGval,
            'AGrecipe': data.AGrecipe,
            'customer': data.customer,
            'orderID': data.orderID,
              'brand': data.brand,
            'flavvalue': data.flavvalue,
            'flavrecipe': data.flavrecipe,
            'VGrecipe': data.VGrecipe,
            'PGrecipe': data.PGrecipe,
            'customer': data.customer,
            'orderID': data.orderID,
            'starttime': 0,
            'CompletionDate': 0,
            'Completed': "",
            'Notes': '',
            'priority': data.priority,
            'Location': "",
            
        };
        if (data.haspremix) {
            mixingData.haspremix = true;
            var dudcode = data.dudpremixCode
            mixingData.dudpremixCode = dudcode;
            var forpremix = data.forpremix
            mixingData.forpremix = forpremix;
        } else {
            mixingData.haspremix = false;
        }
       
            mixingData.Nico = data.Nico;
            mixingData.Nicotrecipe = data.Nicotrecipe;
            mixingData.Nicosalts = data.Nicosalts;
            mixingData.Nicotrecipesalts = data.Nicotrecipesalts;
       
            mixingData.CBDvalue = data.CBDvalue;
            mixingData.CBDrecipe = data.CBDrecipe;
        MIXBATCH.Batches.push(mixingData);
        base.updateData('MixingTeam/' + old.MIXNAME, MIXBATCH);
    }
    
    var iscolored=base.getData('PremixColoring/'+data.batch);
    if(iscolored){
    
    var dat={
    mixbatch:MIXBATCH.MIXNAME,
    };
    base.updateData('PremixColoring/'+data.batch,dat);
    }
  var iscolored=base.getData('Production/'+data.batch);
  if(iscolored){
    var dat={
      mixbatch:MIXBATCH.MIXNAME,
    };
    base.updateData('Production/'+data.batch,dat);
  }
}

function toMixing(data) {
    var mixingData = base.getData('Mixing');
    var mixARR = [];
    if (mixingData) {
        var result = Object.keys(mixingData).map(function(key) {
            return [Number(key), mixingData[key]];
        });
        var row = result.length + 1;
    } else {
        var row = 1;
    }
    var mixingData = {
        'recipe': data.recipe,
        'batch': data.batch,
        'flavour': data.flavour,
        'orderdate': data.orderdate,
        'QTY': data.QTY,
        'VGval': data.VGval,
        'PGval': data.PGval,
        'MCTval': data.MCTval,
        'MCTrecipe': data.MCTrecipe,
        'AGval': data.AGval,
        'AGrecipe': data.AGrecipe,
        'flavvalue': data.flavvalue,
        'flavrecipe': data.flavrecipe,
        'VGrecipe': data.VGrecipe,
        'PGrecipe': data.PGrecipe,
         'brand': data.brand,
        'customer': data.customer,
        'orderID': data.orderID,
        'starttime': 0,
        'CompletionDate': 0,
        'Completed': "",
        'Notes': '',
        'priority': data.priority,
        'Location': "",
        'split': data.split,
        'row': row,
        'userset': false,
        'productcode': data.productcode,
        'productdescription': data.productdescription,
    };
    if (data.haspremix) {
        mixingData.haspremix = true;
        mixingData.markedPremix = false;
        var dudcode = data.dudpremixCode
        mixingData.dudpremixCode = dudcode;
        var forpremix = data.forpremix;
        mixingData.forpremix = forpremix;
    } else {
        mixingData.haspremix = false;
    }
 
        mixingData.Nico = data.Nico;
        mixingData.Nicotrecipe = data.Nicotrecipe;
        mixingData.nic = data.Nicotrecipe;
        
        mixingData.Nicosalts = data.Nicosalts;
        mixingData.Nicotrecipesalts = data.Nicotrecipesalts;
        mixingData.nicsalts = data.Nicotrecipesalts;
   
        mixingData.CBDvalue = data.CBDvalue;
        mixingData.CBDrecipe = data.CBDrecipe;
        mixingData.cbd = data.CBDrecipe;
 
    if(data.Color.sku){
     mixingData.Color = data.Color;
    }
    base.updateData('Mixing/' + data.batch, mixingData);
    var mixing = {
        mixing: data.QTY,
        split: data.split
    }
    base.updateData('Orders/' + data.batch, mixing)
}
