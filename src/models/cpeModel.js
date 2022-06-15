// const { Schema } = require("mongoose");
// const { deviceConnection } = require("../dbConnections/connections").default;

const { Schema } = require("mongoose");
const { deviceConnection } = require("../dbConnections/connections");

const CpeScheme = new Schema(
  {
    // _id: new Schema.Types.ObjectId(),
    _deviceInfo: {
      serialNumber: {
        type: String,
        required: true,
        minlength: 13,
        maxlength: 26,
        unique: true,
      },
      macAddress: {
        type: String,
        required: true,
        minlength: 17,
        maxlength: 17,
        unique: true,
      },
      manufacturer: {
        type: String,
        required: true,
        maxlength: 15,
      },
      modelName: {
        type: String,
        required: true,
        maxlength: 26,
      },
    },
    wifi: {
      ssid2: {
        _value: {
          type: String,
          required: true,
          maxlength: 15,
        },
        _timestamp: {
          type: Date,
          required: true,
        },
      },
      ssid5: {
        _value: {
          type: String,
          // required: true,
          maxlength: 18,
        },
        _timestamp: {
          type: Date,
          // required: true
        },
      },
      keyPassphrase: {
        _value: {
          type: String,
          required: true,
          minlength: 8,
          maxlength: 12,
        },
        _timestamp: {
          type: Date,
          required: true,
        },
      },
    },
    configMode: {
      _value: {
        type: String,
        required: true,
        maxlength: 12,
      },
      _timestamp: {
        type: Date,
        required: true,
      },
    },
    createDateTime: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false }
  // { collection: "devices" }
);

const CpeModel = deviceConnection.model("CPE", CpeScheme, "devices");
module.exports = { CpeModel };
