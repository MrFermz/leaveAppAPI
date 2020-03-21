const db                                    = require('../../db_connection')
const { verifyToken }                       = require('../../jwt')
const { result_success, result_failed }     = require('../result')


async function historyrequest(req, res) {
    let token   = await verifyToken(req, res)

    if (token) {
        let sql     = `SELECT   leaves.leaveID,
                                leaves.leaveType,
                                leaves.timeStamp,
                                leaves.dateStart,
                                leaves.dateEnd,
                                leaves.reasons,
                                leaves.status,
                                leaves.dateApprove,
                                leaves.dateReject,
                                leaves.rejectReasons,
                                leaves.UID,
                                uploads.URL
                        FROM    leaves
                        INNER JOIN uploads ON leaves.uploadID = uploads.uploadID
                        WHERE   UID = ${token.id} AND leaves.status = 0
                        ORDER BY leaves.timeStamp DESC`
        db.query(sql, function (error, result) {
            if (error) {
                result_failed['data']   = error
                res.end(JSON.stringify(result_failed))
            } else {
                result_success['data']  = result
                res.end(JSON.stringify(result_success))
            }
        })
    } else {
        res.end(JSON.stringify(result_failed))
    }
}


module.exports = historyrequest