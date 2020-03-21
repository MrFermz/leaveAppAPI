const bcrypt                                = require('bcryptjs')
const db                                    = require('../../db_connection')
const createApprover                        = require('./create_approver')
const { verifyToken }                       = require('../../jwt')
const { result_success, result_failed }     = require('../result')


async function createusers(req, res, body) {
    // let token       = await verifyToken(req, res)

    // if (token) {
        let data            = JSON.parse(body)
        data.username       = data.username.toLowerCase()
        let hashedpwd       = bcrypt.hashSync(data.password, 8)
        data.password       = hashedpwd
        let sql             = `INSERT INTO users (empID,                  
                                                  firstname,              
                                                  lastname,               
                                                  nickname,               
                                                  username,               
                                                  password,               
                                                  deptID,           
                                                  typeID,                 
                                                  approverID)             
                               VALUES ?`
        let values          = [[
                                data.empID,
                                data.firstname,
                                data.lastname,
                                data.nickname,
                                data.username,
                                data.password,
                                data.departmentID,
                                data.typeID,
                                data.approverID
                              ]]
        db.query(sql, [values], async function (error, result) {
            if(error) {
                result_failed['data']   =   error
                res.end(JSON.stringify(result_failed))
            } else {
                let insertId         = result.insertId
                let leavecount       = await createLeavesDays()
                let leavecountID     = leavecount.insertId
                if (data.makeAppr) {
                    await createApprover(insertId)
                }
                let sqlLeaveCount    = `UPDATE users
                                        SET    leavecountID     = ${leavecountID}
                                        WHERE  UID              = ${insertId}`
                db.query(sqlLeaveCount, function(error, result){
                    if (error) {
                        result_failed['data']   = error
                        res.end(JSON.stringify(result_failed))
                    } else {
                        res.end(JSON.stringify(result_success))
                    }
                })
            }
        })
    // } else {
    //     res.end(JSON.stringify(result_failed))
    // }
}


function createLeavesDays() {
    return new Promise(async function (resolve, reject) {
        let values  = [[0, 0, 0, 0, 0]]
        let sql     = `INSERT INTO leavecount (sick, 
                                               business, 
                                               vacation, 
                                               substitution, 
                                               substitutionMax)
                       VALUES ?`
        db.query(sql, [values], function (error, res) {
            if (error) reject(error)
            else resolve(res)
        })
    })
}


module.exports = createusers