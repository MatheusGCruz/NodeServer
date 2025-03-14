const { dataAccess } = require('./../dataFunctions/dataAccess')
const getDataConfig = require('./../dataFunctions/dataConfig')
const sql = require('mssql');

const dataConfig = getDataConfig()

module.exports = {

    searchBookList: async function (req){
        console.log("book:"+ req.params.bookname);

        const command = "SELECT vbookName, vbookFullName FROM [NODE_SERVER].[dbo].[VBOOK]";

        const vbook = (await req.app.locals.db.vbook.query(command)).recordset;
        
        if(vbook != null){
            return vbook;
        }
        return "Error when searching for book";
        
    }  , 

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

        const command = "SELECT CONVERT(NVARCHAR(10),vbookStyle) AS vbookStyle FROM [NODE_SERVER].[dbo].[VBOOK] where vbookName = '"+req.params.bookname+"'";

        const bookContent = (await req.app.locals.db.vbook.query(command)).recordset;

        if(bookContent[0] && bookContent[0].vbookStyle){
            return bookContent[0].vbookStyle;
        }
        return "Error when searching for book";
        
    },
    
    insertNewDownload: async function (chatId, downloadName) {
        try {
            const pool = await sql.connect(dataConfig.youtubeDownload.config);
            const result = await pool.request()
                .input('chatId', sql.VarChar, chatId.toString())
                .input('downloadName', sql.VarChar, downloadName)
                .query('INSERT INTO YOUTUBE_DOWNLOAD (chatId, downloadName, createdAt) VALUES (@chatId, @downloadName, GETDATE())');
    
           // console.log('Insert successful, rows affected:', result.rowsAffected[0]);
        } catch (error) {
            console.error('Error inserting data:', error);
        } finally {
            await sql.close();
        }

    }


}

