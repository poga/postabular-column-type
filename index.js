"use strict"

let postabular = require("postabular")
let _ = require("lodash")
let moment = require("moment")

module.exports = postabular.plugin('column-type', function(tabular, result) {
    let derived = {}
    // initialized derived table
    tabular.eachColumn((col, colIdx) => { derived[colIdx] = {boolean: 0, datetime: 0, number: 0, text: 0, time: 0, date: 0} })

    tabular.eachColumn((col, colIdx) => {
        col.eachCell((cell, rowIdx) => {
            if (moment(cell.value, moment.ISO_8601, true).isValid()) {
                derived[colIdx]["datetime"] += 1
            } else if (moment(cell.value, 'YYYY-MM-DD', true).isValid()) {
                derived[colIdx]["date"] += 1
            } else if (moment(cell.value, 'HH:mm:ss', true).isValid()) {
                derived[colIdx]["time"] += 1
            } else if (!isNaN(cell.value)) {
                derived[colIdx]["number"] += 1
            } else if (cell.value === "true" || cell.value === "false") {
                derived[colIdx]["boolean"] += 1
            } else {
                derived[colIdx]["text"] += 1
            }
        })
        let result = _.sortBy(Object.keys(derived[colIdx]).map((t) => { return [t, derived[colIdx][t]] }), (x) => { return -1*x[1] })
        tabular.setMeta(`column_type_${colIdx}`, result[0][0])
    })
})
