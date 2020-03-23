const MYSQL         =   require('mysql')
const CONFIG        =   require('./config.json')
const CONN          =   MYSQL.createPool({
                            connectionLimit : 10,
                            host        : CONFIG.SQL.HOST,
                            port        : CONFIG.SQL.PORT,
                            user        : CONFIG.SQL.USER,
                            password    : CONFIG.SQL.PASS,
                            database    : CONFIG.SQL.DB
                        })


function connection() {
    CONN.getConnection( async function (error) {
        console.log('MySQL Connected.')
        
        await createTableUsers()
        await createTableLeaves()
        await createTableApprover()
        await createTableLeaveCount()
        await createTableLeaveCapacity()
        await createTableUploads()
        await createTableDepartments()
        await createTableUserType()

        await createFK()
    })
}


// users
function createTableUsers() {
    let sql             = `CREATE TABLE IF NOT EXISTS users (                         
                            UID                 INT                 AUTO_INCREMENT,         
                            empID               VARCHAR(20),                                    
                            firstname           VARCHAR(255),                                   
                            lastname            VARCHAR(255),                                   
                            nickname            VARCHAR(255),                                   
                            username            VARCHAR(255)        NOT NULL,               
                            password            VARCHAR(255)        NOT NULL,               
                            deptID              INT,                                            
                            typeID              INT,                                            
                            approverID          INT,                                            
                            leavecountID        INT,                                   
                            PRIMARY KEY         (UID),                                          
                            UNIQUE              (username)                                      
                            )ENGINE=InnoDB DEFAULT CHARSET=utf8`
    CONN.query(sql, function (error, result) {
        if (error) throw error
        console.log('users created.')
    })
}


// leave
function createTableLeaves() {
    let sql             = `CREATE TABLE IF NOT EXISTS leaves (                        
                            leaveID             INT                 AUTO_INCREMENT,
                            leaveType           VARCHAR(255),
                            timeStamp           TIMESTAMP,
                            dateStart           TIMESTAMP,                                           
                            dateEnd             TIMESTAMP,                                           
                            reasons             VARCHAR(255),                                   
                            status              VARCHAR(255),                                   
                            actionTimeStamp     TIMESTAMP,
                            dateApprove         TIMESTAMP,                                           
                            dateReject          TIMESTAMP,                                           
                            rejectReasons       VARCHAR(255),                                   
                            UID                 INT,                                            
                            uploadID            INT,                                            
                            PRIMARY KEY         (leaveID)                                       
                            )ENGINE=InnoDB DEFAULT CHARSET=utf8`
    CONN.query(sql, function (error, result) {
        if (error) throw error
        console.log('leave created.')
    })
}



// approver
function createTableApprover() {
    let sql             = `CREATE TABLE IF NOT EXISTS approver (                          
                            approverID              INT             AUTO_INCREMENT,         
                            UID                     INT,                                            
                            PRIMARY KEY             (approverID)                                    
                            )ENGINE=InnoDB DEFAULT CHARSET=utf8`
    CONN.query(sql, function (error, result) {
        if (error) throw error
        console.log('approver created.')
    })
}



// leavedays
function createTableLeaveCount() {
    let sql             = `CREATE TABLE IF NOT EXISTS leavecount (                          
                            leavecountID             INT            AUTO_INCREMENT,         
                            sick                     INT,                                            
                            business                 INT,                                            
                            vacation                 INT,                                            
                            substitution             INT,                                            
                            substitutionMax          INT,                                            
                            PRIMARY KEY             (leavecountID)                                    
                            )ENGINE=InnoDB DEFAULT CHARSET=utf8`
    CONN.query(sql, function (error, result) {
        if (error) throw error
        console.log('leavecount created.')
    })
}



// leavemax
function createTableLeaveCapacity() {
    let sql             = `CREATE TABLE IF NOT EXISTS leavecapacity (                          
                            leavecapacityID         INT            AUTO_INCREMENT,
                            sick                    INT,
                            business                INT,
                            vacation                INT,
                            PRIMARY KEY             (leavecapacityID)                                    
                            )ENGINE=InnoDB DEFAULT CHARSET=utf8`
    CONN.query(sql, function (error, result) {
        if (error) throw error
        console.log('leavecapacity created.')
    })
}



// uploads
function createTableUploads() {
    let sql             = `CREATE TABLE IF NOT EXISTS uploads (                           
                            uploadID                INT             AUTO_INCREMENT,         
                            URL                     VARCHAR(259),                                   
                            PRIMARY KEY             (uploadID)                                      
                            )ENGINE=InnoDB DEFAULT CHARSET=utf8`
    CONN.query(sql, function (error, result) {
        if (error) throw error
        console.log('uploads created.')
    })
}



// departments
function createTableDepartments() {
    let sql             = `CREATE TABLE IF NOT EXISTS departments (                        
                            deptID              INT                 AUTO_INCREMENT,             
                            deptName            VARCHAR(250),                                      
                            PRIMARY KEY         (deptID)                                            
                            )ENGINE=InnoDB DEFAULT CHARSET=utf8`
    CONN.query(sql, function (error, result) {
        if (error) throw error
        console.log('departments created.')
    })
}



// usertype
function createTableUserType() {
    let sql             = `CREATE TABLE IF NOT EXISTS usertypes (                         
                            typeID              INT                 AUTO_INCREMENT,             
                            typeName            VARCHAR(250),                                       
                            PRIMARY KEY         (typeID)                                            
                            )ENGINE=InnoDB DEFAULT CHARSET=utf8`
    CONN.query(sql, function (error, result) {
        if (error) throw error
        console.log('usertype created.')
    })
}



// FK create
function createFK() {
    // FK users
    let sqlUSERS        = `ALTER TABLE users
                           ADD FOREIGN KEY (deptID)         REFERENCES departments(deptID),
                           ADD FOREIGN KEY (typeID)         REFERENCES usertypes(typeID),
                           ADD FOREIGN KEY (approverID)     REFERENCES approver(approverID),
                           ADD FOREIGN KEY (leavecountID)   REFERENCES leavecount(leavecountID); 
                          `
    CONN.query(sqlUSERS, function (error, result) {
        if (error) throw error
        console.log('Added FK users.')
    })

    // FK leaves
    let sqlLEAVES        = `ALTER TABLE leaves
                            ADD FOREIGN KEY (UID)           REFERENCES users(UID),
                            ADD FOREIGN KEY (uploadID)      REFERENCES uploads(uploadID);
                           `
    CONN.query(sqlLEAVES, function (error, result) {
        if (error) throw error
        console.log('Added FK leaves.')
    })
}

connection()

module.exports = CONN