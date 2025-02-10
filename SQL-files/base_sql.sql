CREATE TABLE VBOOK(
    id int PRIMARY KEY IDENTITY,
    vbookName NVARCHAR(MAX),
    vbookContent NVARCHAR(MAX),
    vbookCoverBase64 NVARCHAR(MAX),
    vbookFullName NVARCHAR(MAX),    
    vbookStyle int
)

