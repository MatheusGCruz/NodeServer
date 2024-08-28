var Connection = require('tedious').Connection;  

var sqlConfig = require('../config')



function executeStatement() {  
    var request = new Request("SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;", function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    var result = "";  
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            result+= column.value + " ";  
          }  
        });  
        console.log(result);  
        result ="";  
    });  

    request.on('done', function(rowCount, more) {  
    console.log(rowCount + ' rows returned');  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
        connection.close();
    });
    connection.execSql(request);  
}  


module.exports = {

    searchBook: function (bookName){
        console.log(sqlConfig.sqlConfig);

        var connection = new Connection(sqlConfig.sqlConfig);  
        connection.on('connect', function(err) {  
            // If no error, then good to proceed.  
            console.log("Connected");  
        executeStatement();  
        });  

        connection.connect();

    var Request = require('tedious').Request;  
    var TYPES = require('tedious').TYPES;  


        return "return"+bookName;
    }

    
}

