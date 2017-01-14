

    
function formateDate(mill) {

    var dd = (mill==null) ? new Date() : new Date(mill);
    return dd.getFullYear() + "年" + (dd.getMonth()+1) + "月" + dd.getDate() + "日";
}

function formatDura(mill) {
    var d3 = new Date(parseInt(mill));
    return ((d3.getDate()-1)*24 + (d3.getHours()-8)) + ":"
        + ((d3.getMinutes()<10)?("0"+d3.getMinutes()):d3.getMinutes()) + ":"
        + ((d3.getSeconds()<10)?("0"+d3.getSeconds()):d3.getSeconds())
}


module.exports = {
    formateDate:formateDate,
    formatDura: formatDura
};