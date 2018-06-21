"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function shallowEqual(objA, objB) {
    if (objA === objB) {
        return true;
    }
    if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
    for (var idx = 0; idx < keysA.length; idx++) {
        var key = keysA[idx];
        if (!bHasOwnProperty(key) || objA[key] !== objB[key]) {
            return false;
        }
    }
    return true;
}
exports.shallowEqual = shallowEqual;
;
//# sourceMappingURL=shallowEqual.js.map