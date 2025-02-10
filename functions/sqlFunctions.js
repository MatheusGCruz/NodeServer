const { dataAccess } = require('./../dataFunctions/dataAccess')



module.exports = {

    searchBook: async function (req){
        console.log("book:"+ req.params.bookname);

        const command = "SELECT vbookContent FROM [NODE_SERVER].[dbo].[VBOOK] where vbookName = '"+req.params.bookname+"'";

        const bookContent = (await req.app.locals.db.vbook.query(command)).recordset;
        
        if(bookContent[0] && bookContent[0].vbookContent){
            return bookContent[0].vbookContent;
        }
        return "Error when searching for book";
        
    }  , 
    
    searchCover: async function (req){
        console.log("book:"+ req.params.bookname);

        const command = "SELECT vbookCoverBase64 FROM [NODE_SERVER].[dbo].[VBOOK] where vbookName = '"+req.params.bookname+"'";

        const bookContent = (await req.app.locals.db.vbook.query(command)).recordset;

        if(bookContent[0] && bookContent[0].vbookCoverBase64){
            return bookContent[0].vbookCoverBase64;
        }
        return "Error when searching for book";
        
    } ,

    searchFullName: async function (req){
        console.log("book:"+ req.params.bookname);

        const command = "SELECT vbookFullName FROM [NODE_SERVER].[dbo].[VBOOK] where vbookName = '"+req.params.bookname+"'";

        const bookContent = (await req.app.locals.db.vbook.query(command)).recordset;

        if(bookContent[0] && bookContent[0].vbookFullName){
            return bookContent[0].vbookFullName;
        }
        return "Error when searching for book";
        
    },

    searchStyle: async function (req){
        console.log("book:"+ req.params.bookname);

        const command = "SELECT vbookStyle FROM [NODE_SERVER].[dbo].[VBOOK] where vbookName = '"+req.params.bookname+"'";

        const bookContent = (await req.app.locals.db.vbook.query(command)).recordset;

        if(bookContent[0] && bookContent[0].vbookStyle){
            return bookContent[0].vbookStyle;
        }
        return "Error when searching for book";
        
    } 
}

