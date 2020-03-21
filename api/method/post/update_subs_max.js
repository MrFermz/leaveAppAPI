const db                                    = require('../../db_connection')
const { result_success, result_failed }     = require('../result')


function updateSubsMax(ID, subs) {
    return new Promise(async function (resolve, reject) {
        let sql             = `UPDATE leavecount SET substitutionMax = ${subs} WHERE leavecountID = ${ID}`
        db.query(sql, function (error, result) {
            if (error) {
                result_failed['data']   = error
                reject(result_failed)
            }
            else resolve(result_success)
        })
    })
}


module.exports = updateSubsMax