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
                    let update  = await updateStatus(data.id)
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


function updateStatus(id) {
    return new Promise(function (resolve, reject) {
        let sql     = `UPDATE   leaves
                        SET     status      = 3
                        WHERE   leaveID     = ${id}`
        db.query(sql, function (error, result) {
            if (error) {
                reject(error)
            } else {
                resolve(result_success)
            }
        })
    })
}


module.exports = cancel