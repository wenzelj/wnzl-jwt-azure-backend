
exports.advertInLocation = advertInLocation;
exports.advertDateValid = advertDateValid;
exports.setAdverts = setAdverts;
exports.getAdverts = getAdverts;

var adverts = [];

function setAdverts(adverts){
    this.adverts = adverts;
}

function getAdverts(){
    return this.adverts;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function advertInLocation(userLongitude, userLattitude, advertLongitude, advertLatitude) {
    if (advertLongitude == 0 && advertLatitude == 0) {
        return true;
    }

    var distance = getDistanceFromLatLonInKm(userLattitude, userLongitude, advertLatitude, advertLongitude)
    console.log("Distance from add:" + distance)
    if (distance < 1) {
        return true;
    }
    return false
}

function advertDateValid(startdate, enddate) {
    var date = new Date();
    var dateformat = date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear();
    var todayDate = date.getTime();
    var start = Date.parse(startdate);
    var end = Date.parse(enddate);

    if (todayDate < start) {
        return false;
    }

    if (todayDate > end) {
        return false;
    }
    return true;
}
