function toPremixColoring(data){

  var mixingData = base.getData('PremixColoring');
    var mixARR = [];
    if (mixingData) {
    var result = mixingData;
        var row = result.length + 1;
    } else {
        var row = 1;
    }
    var PC=base.getData('References/'+data.productcode);
      if(PC){
        data.premixSKUColored=PC.premixSKUColored;
        data.premixdescrColored=PC.premixdescrColored;
        data.premixdescr=PC.premixdescr;
        data.premixSKU=PC.premixSKU;
      }
        
        data.starttime=0;
        data.final_status="Not Run";
        data.CompletionDate=0;
        data.Completed="";
        data.Notes='';
        data.ColorQTY=data.Color.val*data.QTY*10;
        data.Location=0;
        data.row=row;
        data.userset=false;

    base.updateData('PremixColoring/' + data.batch, data);


}


function toPrinting(data) {
    var dat = base.getData('Printing');
    var mixARR = [];
    if (dat) {
        var result = Object.keys(dat).map(function(key) {
            return [Number(key), dat[key]];
        });
        var row = result.length + 1;
    } else {
        var row = 1;
    }
    var dat1 = {
        'numLabelsBottles': data.numLabelsBottles ? data.numLabelsBottles : 0,
        'numLabelsTubes': data.numLabelsTubes ? data.numLabelsTubes : 0,
        'boxname': data.boxname,
        'priority': data.priority,
        'recipe': data.recipe,
        'batch': data.batch,
        'flavour': data.flavour,
        'orderdate': data.orderdate,
        'customer': data.customer,
        'brand': data.brand,
        'bottles': data.bottles,
        'btype': data.btype,
        'lid': data.lid,
        'fill': data.fill,
        'botSKU': data.botSKU,
        'lidSKU': data.lidSKU,
        'packaging': data.packaging,
        'ProductionCompleted': data.toproduction,
        'Completed': "",
        'starttime': 0,
        'CompletionDate': 0,
        'Location': '',
        'row': row,
        'userset': false,
        'packagingType': data.packagingType,
        'final_status': "Not Run",
        'bsize': parseInt(data.btype.replace(/\D/g, ''), 10),
        'productcode': data.productcode,
        'productdescription': data.productdescription,
        botlabel: data.botlabel,
        botlabelsku: data.botlabelsku,
        packlabel: data.packlabel,
        packlabelsku: data.packlabelsku,
        ppp: data.ppp,
        ppb: data.ppb,
        customerSKU: data.customerSKU,
        brandSKU: data.brandSKU,
    };
    base.updateData('Printing/' + data.batch, dat1);
}

function toLabelling(data) {
    var dat = base.getData('Labelling');
    var mixARR = [];
    if (dat) {
        var result = Object.keys(dat).map(function(key) {
            return [Number(key), dat[key]];
        });
        var row = result.length + 1;
    } else {
        var row = 1;
    }
    var dat1 = {
        botlabel: data.botlabel,
        botlabelsku: data.botlabelsku,
        packlabel: data.packlabel,
        packlabelsku: data.packlabelsku,
        'boxname': data.boxname,
        'priority': data.priority,
        'recipe': data.recipe,
        'batch': data.batch,
        'flavour': data.flavour,
        'orderdate': data.orderdate,
        'customer': data.customer,
        'brand': data.brand,
        'bottles': data.bottles,
        'btype': data.btype,
        'lid': data.lid,
        'fill': data.fill,
        'botSKU': data.botSKU,
        'lidSKU': data.lidSKU,
        'packagingType': data.packagingType,
        'packaging': data.packaging,
        'ProductionCompleted': data.toproduction,
        'PrintingCompleted': data.toprinting,
        'Completed': "",
        'starttime': 0,
        'CompletionDate': 0,
        'Location': '',
        'row': row,
        'userset': false,
        'final_status': "Not Run",
        'bsize': parseInt(data.btype.replace(/\D/g, ''), 10),
        'machineL': data.machineL,
        'productcode': data.productcode,
        'productdescription': data.productdescription,
        ppp: data.ppp,
        ppb: data.ppb,
        customerSKU: data.customerSKU,
        brandSKU: data.brandSKU,
    };
    base.updateData('Labelling/' + data.batch, dat1);
}

function toProduction(data) {
    var dat = base.getData('Production');
    var mixARR = [];
    if (dat) {
        var result = Object.keys(dat).map(function(key) {
            return [Number(key), dat[key]];
        });
        var row = result.length + 1;
    } else {
        var row = 1;
    }
    var dat1 = {
        botlabel: data.botlabel,
        botlabelsku: data.botlabelsku,
        packlabel: data.packlabel,
        packlabelsku: data.packlabelsku,
        'boxname': data.boxname,
        'priority': data.priority,
        'recipe': data.recipe,
        'batch': data.batch,
        'flavour': data.flavour,
        'orderdate': data.orderdate,
        'customer': data.customer,
        'brand': data.brand,
        'bottles': data.bottles,
        'btype': data.btype,
        'lid': data.lid,
        'fill': data.fill,
        'botSKU': data.botSKU,
        'lidSKU': data.lidSKU,
        'packagingType': data.packagingType,
        'packaging': data.packaging,
        'mixing_status': data.mixing_status,
        'Completed': "",
        'starttime': 0,
        'CompletionDate': 0,
        'Location': '',
        'row': row,
        'userset': false,
        'final_status': "Not Run",
        'bsize': parseInt(data.btype.replace(/\D/g, ''), 10),
        'machineP': data.machineP,
        'productcode': data.productcode,
        'productdescription': data.productdescription,
        customerSKU: data.customerSKU,
        brandSKU: data.brandSKU,
    };
     
    //    if (data.recipe.name.match('Nicotine')) {
    //        dat1.nic = data.recipe.nic;
    //    } else {
    //        dat1.cbd = data.recipe.cbd;
    //    }
    base.updateData('Production/' + data.batch, dat1);
}

function toPackaging(data) {
    var dat = base.getData('Packaging');
    var mixARR = [];
    if (dat) {
        var result = Object.keys(dat).map(function(key) {
            return [Number(key), dat[key]];
        });
        var row = result.length + 1;
    } else {
        var row = 1;
    }
    var dat1 = {
        botlabel: data.botlabel,
        botlabelsku: data.botlabelsku,
        packlabel: data.packlabel,
        packlabelsku: data.packlabelsku,
        'boxname': data.boxname,
        'priority': data.priority,
        'recipe': data.recipe,
        'batch': data.batch,
        'flavour': data.flavour,
        'orderdate': data.orderdate,
        'customer': data.customer,
        'brand': data.brand,
        'bottles': data.bottles,
        'btype': data.btype,
        'lid': data.lid,
        'fill': data.fill,
        'botSKU': data.botSKU,
        'lidSKU': data.lidSKU,
        'packagingType': data.packagingType,
        'packaging': data.packaging,
        'PrintingCompleted': data.toprinting,
        'ProductionCompleted': data.toproduction,
        'PackagingCompleted': "",
        'Completed': "",
        'starttime': 0,
        'CompletionDate': 0,
        'Location': '',
        'row': row,
        'userset': false,
        'final_status': "Not Run",
        'bsize': parseInt(data.btype.replace(/\D/g, ''), 10),
        'productcode': data.productcode,
        'productdescription': data.productdescription,
        customerSKU: data.customerSKU,
        brandSKU: data.brandSKU,
    };
    base.updateData('Packaging/' + data.batch, dat1);
}

 