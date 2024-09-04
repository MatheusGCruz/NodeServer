const { dataAccess } = require('./../dataFunctions/dataAccess')



module.exports = {

    searchBook: async function (req){
        console.log("book:"+ req.params.bookname);

        const command = "SELECT vbookContent FROM [NODE_SERVER].[dbo].[VBOOK] where vbookName = '"+req.params.bookname+"'";

        //const searched = (await dataAccess.query(command)).recordSet;

        const bookContent = (await req.app.locals.db.vbook.query(command)).recordset;
        
        //console.log(searched);
        console.log(bookContent);
        if(bookContent[0] && bookContent[0].vbookContent){
            return bookContent[0].vbookContent;
        }
        return "Error when searching for book";
        
    }    
}

