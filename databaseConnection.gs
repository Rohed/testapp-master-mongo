function Base(SERVERURL) {

    this.url = SERVERURL;

    this.getData = function(path, options) {
        var params = {
            method: "GET",
            "Content-Type": 'application/json',
            muteHttpExceptions: true,
             
        }

        var url =  this.url + '?'+formQueryFromPath(path)+formQueryFromParams(options) ;
        var response = UrlFetchApp.fetch(url, params).getContentText();
        // Logger.log("GET: "+response);
         try{
         JSON.parse(response)
         return JSON.parse(response);
         }catch(e){
         var msg = e;
         return response
         }
      
    }

    this.setData = function(path, data) {
        var payload = {
            data: JSON.stringify(data)
        }
        var params = {
            method: "POST",
            "Content-Type": 'application/json',
            muteHttpExceptions: true,
            'payload': payload
        }

        var url =  this.url + '?'+formQueryFromPath(path)
        var response = UrlFetchApp.fetch(url, params).getContentText();
       // Logger.log("SET: "+response);
    }

    this.updateData = function(path, data) {
        var payload = {
            data: JSON.stringify(data)
        }
        var params = {
            method: "PUT",
            "Content-Type": 'application/json',
            muteHttpExceptions: true,
            'payload': payload
        }
        var url =  this.url + '?'+formQueryFromPath(path)
        var response = UrlFetchApp.fetch(url, params).getContentText();
    Logger.log("Update: "+response);
    }
    this.removeData = function(path) {
        var params = {
            method: "DELETE",
            "Content-Type": 'application/json',
            muteHttpExceptions: true,

        }
                var url =  this.url + '?'+formQueryFromPath(path)
        var response = UrlFetchApp.fetch(url, params).getContentText();
       // Logger.log("Remove: "+response);
    }

}


function formQueryFromPath(path) {
    var splitPath = path.split('/');
    var id = '';

    var query = 'path='+splitPath[0];

    if (splitPath[1]) {
        query += '&id=' + splitPath[1];
    }
 if (splitPath[2]) {
        query += '&id2=' + splitPath[2];
    }
    return query;
}

function formQueryFromParams(params) {
    var query = '';
    if (params) {
        if (params.orderBy) {

            query += '&orderBy='+params.orderBy
        }

       if (params.equalTo) {

            query += '&equalTo='+params.equalTo
        }



    }

    return query;
}

