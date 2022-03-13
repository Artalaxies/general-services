"use strict";
exports.__esModule = true;
exports.DataSnapshot = void 0;
var DataSnapshot = /** @class */ (function () {
    function DataSnapshot(data, exists) {
        var _this = this;
        if (exists === void 0) { exists = false; }
        /** True if the document exists. */
        /** True if the document exists. */
        this.exists = false;
        this.exists = exists;
        if (data !== undefined) {
            this.data = function () {
                _this.readTime = Date.now();
                return data();
            };
        }
        this.createTime = Date.now();
    }
    return DataSnapshot;
}());
exports.DataSnapshot = DataSnapshot;
