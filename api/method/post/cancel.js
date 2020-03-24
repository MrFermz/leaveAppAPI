const db                                    = require('../../db_connection')
const { verifyToken }                       = require('../../jwt')
const { result_success, result_failed }     = require('../result')


async function cancel(req, res, body) {
    let token       = await verifyToken(req, res)

    if (token) {
        let data    = JSON.parse(body)
        let sql     = `SELECT status FROM leaves WHERE leaveID = ${data.id}`
        db.query(sql, async function (error, result) {
            if (error) {
                result_failed['data']   = error
                res.end(JSON.stringify(result_failed))
            } else {
                if (result[0].status == 0) {
                    let update  = await updateStatus(data)
                    if (update.result == 'success') {
                        res.end(JSON.stringify(result_success))
                    }
                } else {
                    result_failed['data']   = 'desync'
                    res.end(JSON.stringify(result_failed))
                }
            }
        })
    } else {
        res.end(JSON.stringify(result_failed))
    }
}


function updateStatus(data) {
    return new Promise(function (resolve, reject) {
        let sql     = `UPDATE   leaves
                        SET     status          = 3,
                                actionTimeStamp = CURRENT_TIME()
                        WHERE   leaveID         = ${data.id}`
        db.query(sql, async function (error, result) {
            if (error) {
                reject(error)
            } else {
                let response    = await restoreDays(data.leavecountID, data.leaveType)
                if (response.result == 'success') {
                    resolve(result_success)
                } else {
                    reject(result_failed)
                }
            }
        })
    })
}


function restoreDays(leavecountID, leaveType) {
    return new Promise(function (resolve, reject) {
        let sql     = `SELECT ${leaveType} FROM leavecount WHERE leavecountID = ${leavecountID}`
        db.query(sql, function (error, result) {
            if (error) reject(error)
            else {
                let remain          = result[0]
                let key             = Object.keys(remain)[0]
                let value           = remain[key] - 1
                let sql     = `UPDATE leavecount SET ${key} = ${value} WHERE leavecountID = ${leavecountID}`
                db.query(sql, function (error, result) {
                    if (error) reject(error)
                    else resolve(result_success)
                })
            }
        })
    })
}


module.exports = cancel