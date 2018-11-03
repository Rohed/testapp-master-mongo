

function testmove() {
    MoveItem('914932', 'Production')
}




function MoveItem(batch, sheet) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Line Item Move',
        batch: batch,
        page: sheet,
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    var data = base.getData(sheet + '/' + batch);
    data.current = sheet;
    var result = [];
    try {
        var data = moveMain(data);
        LOGDATA.data = LOGDATA.data.concat(data);
        LOGDATA.data.push(['SUCCESS:', "Line Item has been moved."]);
        logItem(LOGDATA);
        result.push(batch+' Success');
    } catch (e) {
        LOGDATA.status = false;
        result.push(batch+' Failed ' + e.message);
        LOGDATA.data.push(['Failed:', 'Failed ' + e.message]);
        logItem(LOGDATA);
    }
    return [result, sheet];
}

function moveMain(item) {
    var LOGARR = [];
    
        var order = base.getData('Orders/' + item.batch);
        var sheet_name = item.current;
        var next_sheet = sheets[sheets.indexOf(sheet_name) + 1];
        if (sheet_name == 'MixingTeam') {
            var batches = getBatchesInMIXBATCH(item);
            for (var i = 0; i < batches.length; i++) {
                fromReservedtoCompleted("Flavours/" + batches[i].flavour.sku, batches[i].flavvalue * batches[i].QTY / 1000);
                LOGARR.push(['Flavour:', batches[i].flavvalue * batches[i].QTY / 1000]);
                fromReservedtoCompleted("Misc/VG", batches[i].VGval * batches[i].QTY);
                LOGARR.push(['VG:', batches[i].VGval * batches[i].QTY]);
                if (isNaN(batches[i].AGval)) {
                    batches[i].AGval = 0;
                }
                fromReservedtoCompleted("Misc/AG", batches[i].AGval * batches[i].QTY);
                LOGARR.push(['AG:', batches[i].AGval * batches[i].QTY]);
                fromReservedtoCompleted("Misc/PG", batches[i].PGval * batches[i].QTY);
                LOGARR.push(['PG:', batches[i].PGval * batches[i].QTY]);
                if (isNaN(batches[i].MCTval)) {
                    batches[i].MCTval = 0;
                }
                fromReservedtoCompleted("Misc/MCT", batches[i].MCTval * batches[i].QTY);
                LOGARR.push(['MCT:', batches[i].MCTval * batches[i].QTY]);
                if (batches[i].Nico) {
                    fromReservedtoCompleted("Misc/Nicotine", batches[i].Nico * batches[i].QTY);
                    LOGARR.push(['Nicotine:', batches[i].Nico * batches[i].QTY]);
                }
                if (batches[i].Nicosalts) {
                    fromReservedtoCompleted("Misc/Nicotine Salts", batches[i].Nicosalts * batches[i].QTY);
                    LOGARR.push(['Nicotine Salts:', batches[i].Nicosalts * batches[i].QTY]);
                }
                if(batches[i].CBDvalue){
                    fromReservedtoCompleted("Misc/CBD", batches[i].CBDvalue * batches[i].QTY);
                    LOGARR.push(['CBD:', batches[i].CBDvalue * batches[i].QTY]);
                }
                var order = base.getData('Orders/' + batches[i].batch);
                var item = base.getData('Mixing/' + batches[i].batch);
                var dat1 = {
                    split: item.split - 1
                };
                LOGARR.push(['Splits Left:', dat1.split]);
                base.updateData('Mixing/' + batches[i].batch, dat1);
                item.split-= 1;
                var suffix = item.batch.substr(-1);
                var for_premixed_stock = suffix == PREMIX_STOCK_SUFFIX ? true : false;
                var premix = getPremixSKU(order,false);
                if (for_premixed_stock) {
                
                  if(item.recipe.Color.sku){
                    PtoComplete(premix, batches[i].QTY);

                  }else{
                    
                    PtoRunning(premix, batches[i].QTY);
                    var dat1 = {
                      mixing_status: 'Completed',
                      final_status: 'Completed',
                      CompletionDate: new Date().getTime()
                    };
                    base.updateData('Orders/' + batches[i].batch, dat1);
                    
                  }
                  var dat3 = {
                    CompletionDate: new Date().getTime(),
                    final_status: 'Completed',
                    
                  };
                  base.updateData('Mixing/' + batches[i].batch, dat3);
                  
                  
                    
                    
                   
                } else {
                  if(item.split==0){
                    if(item.recipe.Color.sku){
                       var tomix = base.getData('Orders/' + batches[i].batch + '/mixing');
                       batches[i].QTY = batches[i].QTY - tomix;
                       if(item.POMARKED){
                      batches[i].QTY-=1;
                      }
                       LOGARR.push(['Premix to Running:', batches[i].QTY]);
                       PtoComplete(premix, batches[i].QTY);
                       if (item.haspremix) {
                         if (!item.markedPremix) {
                           var dmix = base.getData('Orders/' + item.dudpremixCode);
                           dmix.mixing_status = 'Completed';
                           dmix.final_status = 'Completed';
                           dmix.CompletionDate = new Date().getTime();
                           LOGARR.push(['Premix to Running RU:', item.forpremix]);
                           PtoRunning(premix, item.forpremix);
                           base.updateData('Orders/' + item.dudpremixCode, dmix);
                           var dat3 = {
                             markedPremix: true,
                           };
                           base.updateData('Mixing/' + batches[i].batch, dat3);
                         }
                       }

                    }else{
                      var tomix = base.getData('Orders/' + batches[i].batch + '/mixing');
                      
                      batches[i].QTY = batches[i].QTY - tomix;
                      if(item.POMARKED){
                      batches[i].QTY-=1;
                      }
                    
                      LOGARR.push(['Premix to Running:', batches[i].QTY]);
                      PtoRunning(premix, batches[i].QTY);
                        if (item.haspremix) {
                        if (!item.markedPremix) {
                          var dmix = base.getData('Orders/' + item.dudpremixCode);
                          dmix.mixing_status = 'Completed';
                          dmix.final_status = 'Completed';
                          dmix.CompletionDate = new Date().getTime();
                          LOGARR.push(['Premix to Running RU:', item.forpremix]);
                          PtoRunning(premix, item.forpremix);
                          base.updateData('Orders/' + item.dudpremixCode, dmix);
                          var dat3 = {
                            markedPremix: true,
                          };
                          base.updateData('Mixing/' + batches[i].batch, dat3);
                        }
                      }
                 
                    }
                    
                    var dat2 = {
                        final_status: 'Completed',
                        
                    };
                    base.updateData('Mixing/' + batches[i].batch, dat2);
                    if(item.POMARKED){
                        PtoRunning(premix, item.POvolume);
                    }
                  }
                }
                
                updateAllTabs(batches[i].batch);
            }
        } else if (sheet_name == 'Production') {
            fromReservedtoCompleted('Lids/' + item.lidSKU, item.bottles);
            LOGARR.push([item.lidSKU, item.bottles]);
            fromReservedtoCompleted('BottleTypes/' + item.botSKU, item.bottles);
            LOGARR.push([item.botSKU, item.bottles]);
          if(order.Color.sku){
          var premix = getPremixSKU(order,true);
          }else{
          var premix = getPremixSKU(order,false);
          }
            
            var unbrand = getUnbrandName(order);
            LOGARR.push(['Premix SKU:', premix]);
            LOGARR.push(['Unbranded SKU:', unbrand]);
            var suffix = item.batch.substr(-1);
            var for_unbranded_stock = suffix == UNBRANDED_STOCK_SUFFIX ? true : false;
          if(!for_unbranded_stock){
            suffix = item.batch.substr(-2);
            for_unbranded_stock = suffix == UNBRANDED_STOCK_SUFFIX2 ? true : false;
          }
            var volume = parseInt(item.btype.replace(/\D/g, ''), 10) * item.bottles / 1000;
            if (for_unbranded_stock) {
                var dat1 = {
                    production_status: 'Completed',
                    CompletionDate: new Date().getTime(),
                };
                base.updateData('Orders/' + item.batch, dat1);
                var dat2 = {
                    final_status: 'Completed',
                    CompletionDate: new Date().getTime(),
                };
                base.updateData('Orders/' + item.batch, dat2);
                var tomix = order.mixing;
                if (tomix > 0) {
                    PtoComplete(premix, tomix);
                    LOGARR.push(['Premix to Completed:', tomix]);
                }
                UtoRunning(unbrand, item.bottles);
                LOGARR.push(['Unbranded to Running:', item.bottles]);
            } else {
                var dat1 = {
                    production_status: 'Completed'
                };
                base.updateData('Orders/' + item.batch, dat1);
                var tomix = order.mixing;
                var tominusP = order.premixed;
                var tominusU = order.unbranded;
                volume = volume - tomix - (tominusU / 1000 * order.fill);
                if (tominusP > 0) {
                    PtoComplete(premix, tominusP);
                    LOGARR.push(['Premix to Complete:', tomix]);
                }
                updateAllTabs(item.batch);
            }
            if (item.hasoverprod) {
                var overprodvol = item.overprod * order.fill / 1000;
                LOGARR.push(['Premix to Completed from Overprod:', overprodvol]);
                PtoComplete(premix, overprodvol);
                UtoRunning(unbrand, item.overprod);
                LOGARR.push(['Unbranded to Running from Overprod:', item.overprod]);
                var dat1 = {
                    production_status: 'Completed',
                    final_status: 'Completed',
                    Completed: item.Completed,
                    CompletionDate: new Date().getTime()
                };
                base.updateData('Orders/' + item.overprodbatch, dat1);
                base.updateData('Production/' + item.overprodbatch, dat1);
            }
            var dat3 = {
                final_status: 'Completed',
                 
            };
            base.updateData('Production/' + item.batch, dat3);
            updateAllTabs(item.batch);
        } else if (sheet_name == 'Printing') {
            var volume = parseInt(item.btype.replace(/\D/g, ''), 10) * item.bottles / 1000;
            var packData = getPackagingData(item.packagingType, item.bottles + order.branded, order.boxname.sku)
                //   var packlabel = packData.packlabel;
            var packink = packData.ink;
            var tube = packData.botperPack;
            var tubes = item.bottles / tube;
            var ink = 0;
            if (!item.ppb) {
                ink = item.bottles * 0.001;
            }
            if (!item.ppp) {
                ink += packink;
            }
            fromReservedtoCompleted("Misc/printing ink", ink);
            LOGARR.push(['Printing ink:', ink]);
            var dat1 = {
                final_status: 'Completed',
                 
            };
            base.updateData('Printing/' + item.batch, dat1);
            var dat2 = {
                printing_status: 'Completed',
            };
            base.updateData('Orders/' + item.batch, dat2);
            item.printing_status = 'Completed';
            item.ProductionCompleted = 'Completed';
            toLabelling(item);
            LOGARR.push(['Sent to Labelling', item.bottles]);
            updateAllTabs(item.batch);
        } else if (sheet_name == 'Labelling') {
            var unbrand = getUnbrandName(order);
            LOGARR.push(['Unbranded SKU:', unbrand]);
            var volume = parseInt(item.btype.replace(/\D/g, ''), 10) * item.bottles / 1000;
            var origbots = order.bottles;
            var tomix = order.mixing;
            var tominusP = order.premixed;
            var tominusU = order.unbranded;
            var tominusTUBE = order.backtubed;
            var leftoverbots = order.branded;
            var botQ2 = item.bottles + leftoverbots;
            var label = order.botlabelsku;
            Logger.log("THE LABEL IS " + label);
            var packData = getPackagingData(item.packagingType, item.bottles, order.boxname.sku)
                // var packlabel = packData.packlabel;
            var packink = packData.ink;
            var tube = packData.botperPack;
            var boxname = order.boxname.sku;
            var tubes = botQ2 / tube;
            var box = tubes / packData.divTubesForBox;
            if(tube){
            if (item.packlabelsku != ""  && item.packlabelsku != undefined  ) {
                LOGARR.push([item.packlabelsku, tubes]);
                fromReservedtoCompleted('Labels/' + item.packlabelsku, tubes);
            }
            }
            LOGARR.push([label, item.bottles]);
            fromReservedtoCompleted('Labels/' + label, item.bottles);
            var suffix = item.batch.substr(-1);
            var for_branded_stock = suffix == BRANDED_STOCK_SUFFIX ? true : false;
            if (for_branded_stock) {
                LOGARR.push(['Unbranded to Completed', tominusU]);
                UtoComplete(unbrand, tominusU);
                if (tube != 0) {
                    toPackaging(item);
                    LOGARR.push(['Sent to Packaging', item.bottles]);
                } else {
                    var brandname = getBrandName(item, false);
                    LOGARR.push(['Branded SKU', item.bottles]);
                    BtoRunning(brandname, item.bottles);
                    LOGARR.push(['Branded to Running', item.bottles]);
                    var dat2 = {
                        final_status: 'Completed',
                        CompletionDate: new Date().getTime(),
                    };
                    base.updateData('Orders/' + item.batch, dat2);
                }
            } else {
                LOGARR.push(['Unbranded to Completed', tominusU]);
                UtoComplete(unbrand, tominusU);
                updateShippingInformation2(item.batch);
            }
            var dat1 = {
                final_status: 'Completed',
            
                CompletionDate: new Date().getTime(),
            };
            base.updateData('Labelling/' + item.batch, dat1);
            var dat2 = {
                labeling_status: 'Completed',
            };
            base.updateData('Orders/' + item.batch, dat2);
            updateAllTabs(item.batch);
        } else if (sheet_name == 'Packaging') {
            var volume = parseInt(item.btype.substr(0, 2), 10) * item.bottles / 1000;
            var brandname = getBrandName(order, false);
            LOGARR.push(['Branded SKU:', brandname]);
            var packData = getPackagingData(item.packagingType, item.bottles, order.boxname.sku)
                //var packlabel = packData.packlabel;
            var packink = packData.ink;
            var tube = packData.botperPack;
            var boxname = order.boxname.sku;
            var suffix = item.batch.substr(-1);
            var for_branded_stock = suffix == BRANDED_STOCK_SUFFIX ? true : false;
            var tubes = item.bottles / tube;
          var tomix = order.mixing;
          var tominusP = order.premixed;
          var tominusU = order.unbranded;
          var tominusB = order.branded;
          var tominBPack = order.backtubed;
          tubes = tubes - tominBPack;
            if (tube != 0) {
                //WITH PACKAGING
                if (for_branded_stock) {
                    fromReservedtoCompleted('Packages/' + item.packagingType.sku, tubes);
                    LOGARR.push([item.packagingType.sku, tubes]);
                    BtoRunningX(brandname, tubes);
                    LOGARR.push(['Branded to Running:', tubes]);
                } else {
                    var box = tubes / packData.divTubesForBox;
                    if (boxname) {
                        fromReservedtoCompleted('Boxes/' + boxname, box);
                        LOGARR.push([boxname, box]);
                    }
               
                    fromReservedtoCompleted('Packages/' + item.packagingType.sku, tubes);
                    LOGARR.push([item.packagingType.sku, tubes]);
                    var brandname2 = getBrandName(item, true);
                    if (brandname2 != order.productcode) {
                        BtoCompleteX(brandname2, tominusB);
                        LOGARR.push([brandname2 + 'to Completed:', tominusB]);
                    }
                    BtoCompleteX(brandname, tominBPack);
                    LOGARR.push([brandname + 'to Completed:', tominBPack / tube]);
                }
            } else {
                //NO PACKAGING
                if (for_branded_stock) {
                    BtoRunningX(brandname, item.bottles);
                    LOGARR.push([brandname + 'to Completed:', item.bottles]);
                } else {
                    var box = 0;
                    if (boxname) {
                        fromReservedtoCompleted('Boxes/' + boxname, box);
                        LOGARR.push([boxname, box]);
                    }
                    BtoCompleteX(brandname, tominusB);
                    LOGARR.push([brandname + 'to Completed:', tominusB]);
                }
            }
            var dat1 = {
                final_status: 'Completed',
                
                CompletionDate: new Date().getTime(),
            };
            base.updateData('Packaging/' + item.batch, dat1);
            var dat2 = {
                packaging_status: 'Completed',
                final_status: 'Completed',
                CompletionDate: new Date().getTime(),
            };
            base.updateData('Orders/' + item.batch, dat2);
            updateAllTabs(item.batch);
            updateShippingInformation2(item.batch);
        } else if (sheet_name == 'FlavourMixMixingTeam') {
            var flavourMix = base.getData('FlavourMixes/' + item.flavourmix.sku);
            item.fullMix = flavourMix;
            var flavours = flavourMix.flavours;
            for (var i = 0; i < flavours.length; i++) {
                LOGARR.push(['Flavour:', flavours[i].val * item.stocking / 10]);
                fromReservedToRunning('Flavours/' + flavours[i].sku, flavours[i].val * item.stocking / 10);
            }
            toRunning('Flavours/' + item.flavourmix.sku, item.stocking);
            LOGARR.push(['Mover To Running:' + item.batch + ' ' + item.flavourmix.sku, item.stocking]);
            item.final_status = 'Completed';
          
            item.CompletionDate = new Date().getTime();
            base.updateData('FlavourMixOrders/' + item.batch, item);
            base.updateData('FlavourMixMixingTeam/' + item.batch, item);
        } else if (sheet_name == 'PremixColoring') {
          var suffix = item.batch.substr(-1);
          var for_premixed_stock = suffix == PREMIX_STOCK_SUFFIX ? true : false;
          var premix = getPremixSKU(order,true);
    
          fromReservedtoCompleted("Color/"+item.Color.sku, item.QTY*10*item.Color.val);
          
          if (for_premixed_stock) {
            
            
            PtoRunning(premix, item.QTY);
            var dat1 = {
              mixing_status: 'Completed',
              final_status: 'Completed',
              CompletionDate: new Date().getTime()
            };
            base.updateData('Orders/' + item.batch, dat1);
            
       
          var dat3 = {
            CompletionDate: new Date().getTime(),
            final_status: 'Completed',
      
          };
          base.updateData('Mixing/' + item.batch, dat3);
          
          base.updateData('PremixColoring/' + item.batch, dat3);
           if(item.checkUncolored){
              var premix2 = getPremixSKU(order,false);
             PtoComplete(premix2, order.premixed);
           } 
            
          } else {
            
         
              var tomix = base.getData('Orders/' + item.batch + '/mixing');
          
              LOGARR.push(['Premix to Completed:', order.coloredpremix]);
              PtoComplete(premix, order.coloredpremix);

                
              
              
            var dat2 = {
              final_status: 'Completed',
            
            };
            base.updateData('Mixing/' + item.batch, dat2);
               base.updateData('PremixColoring/' + item.batch, dat2);
            
          }
          
          updateAllTabs(item.batch);
          
        } else {
            LOGARR.push(["Wrong Sheet", '']);
        }
        return LOGARR;
    
}