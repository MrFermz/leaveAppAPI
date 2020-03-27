const db                                    = require('../../db_connection')
const { verifyToken }                       = require('../../jwt')
const { result_success, result_failed }     = require('../result')


async function createleaves(req, res, body) {
    let token       = await verifyToken(req, res)

    if (token) {
        let data        = JSON.parse(body)
        let sql         = `INSERT INTO leaves (leaveType, 
                                               timeStamp,
                                               dateStart, 
                                               dateEnd, 
                                               reasons, 
                                               status, 
                                               UID,
                                               uploadID) 
                           VALUES ?`
        let values      = [[
                            data.leaveType,
                            new Date(),
                            data.dateStart,
                            data.dateEnd,
                            data.reasons,
                            data.status,
                            token.id,
                            data.uploadid
                          ]]
        db.query(sql, [values], async function (error, result) {
            if (error) {
                result_failed['data']   = error
                res.end(JSON.stringify(result_failed))
            } else {
                await usedleavedays(data)
                res.end(JSON.stringify(result_success))
            }
        })
    } else {
        res.end(JSON.stringify(result_failed))
    }
}


function usedleavedays(data) {
    return new Promise(async function (resolve, reject) {
        let sql     = `SELECT * FROM leavecount WHERE leavecountID = ${data.leavecountID}`
        db.query(sql, function (error, result) {
            if (error) reject(error)
            else {
                let value           = 0
                let rawResult       = result[0]
                let sick            = rawResult.sick
                let vacation        = rawResult.vacation
                let business        = rawResult.business
                let substitution    = rawResult.substitution
                switch (data.leaveType) {
                    case 'sick': {
                        value   = sick + data.days
                    } break
                    case 'vacation': {
                        value   = vacation + data.days
                    } break
                    case 'business': {
                        value   = business + data.days
                    } break
                    case 'substitution': {
                        value   = substitution + data.days
                    } break
                    default:
                        break
                }
                let sql     = `UPDATE leavecount SET ${data.leaveType} = ${value} WHERE leavecountID = ${data.leavecountID}`
                db.query(sql, function (error, result) {
                    if (error) reject(error)
                    else resolve(result_success)
                })
            }
        })
    })
}


module.exports = createleaves