/**
 * Number.doubleDigital
 *
 * @return
 *            0->00
 *            10->10
 */
 Number.prototype.doubleDigital = function () {
    var num = this.toString();
    return /\d{2}/.test(num) ? num : "0" + num;
};

/**
 * Date.format
 *
 * @param {String}format
 *            yyyy年mm月dd week
 * @return
 *            2013年04月06 星期一
 */
Date.prototype.format = function (format) {
    var obj = {
        "yy": this.getYear() % 100,
        "YYYY": this.getFullYear(),
        "MM": (this.getMonth() + 1).doubleDigital(),
        "DD": this.getDate().doubleDigital(),
        "M": this.getMonth() + 1,
        "d": this.getDate(),
        "week": ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][this.getDay()],
        "hh": this.getHours().doubleDigital(),
        "mm": this.getMinutes().doubleDigital(),
        "ss": this.getSeconds().doubleDigital(),
        "h": this.getHours(),
        "m": this.getMinutes(),
        "s": this.getSeconds()
    };
    for (var i in obj) {
        format = format.replace(i, obj[i]);
    }
    return format;
};



export const check = () => { }


export function isEmpty(value) {
    if (value === null) {
        return true;
    } else if (value === undefined) {
        return true;
    } else if (typeof value === 'string' && value.trim().length === 0) {
        return true;
    } else if (Array.isArray(value) && value.length === 0) {
        return true;
    } else if (typeof value === 'object' && Object.keys(value).length === 0) {
        return true;
    } else {
        return false;
    }
}