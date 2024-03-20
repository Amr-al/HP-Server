const mongoose = require("mongoose");
const { Schema } = mongoose;

const propertySchema = Schema(
  {
    refNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    employee: {
      type: mongoose.Schema.Types.String,
      ref: "Employee",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    propertyType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "propertyType",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    titleAr: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
      required: true,
    },
    isResidential: {
      type: String,
      required: true,
    },
    isCommercial: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: String,
      required: false,
    },
    mainimage: {
      image: {
        type: String,
      },
      placeholder: {
        type: String,
      },
    },
    images: [
      {
        image: {
          type: String,
        },
        placeholder: {
          type: String,
        },
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    renewNumber: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      required: true,
    },
    tagsAr: {
      type: [String],
      required: true,
    },
    youtubeLink: {
      type: String,
      // required: true,
    },
    beds: {
      type: Number,
      required: true,
    },

    baths: {
      type: Number,
      required: true,
    },
    floorNumber: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 5,
    },
    propertyArea: {
      type: Number,
      required: true,
    },
    furnitureStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "furnitureSetting",
      required: true,
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },
    subarea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subarea",
      required: true,
    },
    // dashboard only
    ownerName: {
      type: String,
      required: true,
    },
    ownerPhone: {
      type: Number,
      required: true,
    },
    ownerAddress: {
      type: String,
      required: true,
    },

    // Property Amenities
    ceramics: {
      type: Boolean,
      required: false,
      default: false,
    },
    officeRoom: {
      type: Boolean,
      required: false,
      default: false,
    },
    builtinWardrobe: {
      type: Boolean,
      required: false,
      default: false,
    },
    internetAccess: {
      type: Boolean,
      required: false,
      default: false,
    },
    elevator: {
      type: Boolean,
      required: false,
      default: false,
    },
    studyroom: {
      type: Boolean,
      required: false,
      default: false,
    },
    terrace: {
      type: Boolean,
      required: false,
      default: false,
    },
    surveillance: {
      type: Boolean,
      required: false,
      default: false,
    },
    coveredParking: {
      type: Boolean,
      required: false,
      default: false,
    },
    storage: {
      type: Boolean,
      required: false,
      default: false,
    },
    sharedSwimmingPool: {
      type: Boolean,
      required: false,
      default: false,
    },
    petsAllowed: {
      type: Boolean,
      required: false,
      default: false,
    },
    parquet: {
      type: Boolean,
      required: false,
      default: false,
    },

    HDF: {
      type: Boolean,
      required: false,
      default: false,
    },

    marble: {
      type: Boolean,
      required: false,
      default: false,
    },

    porcelain: {
      type: Boolean,
      required: false,
      default: false,
    },

    others: {
      type: Boolean,
      required: false,
      default: false,
    },

    airConditioning: {
      type: Boolean,
      required: false,
      default: false,
    },

    centralAirCondition: {
      type: Boolean,
      required: false,
      default: false,
    },

    oneBalconyView: {
      type: Boolean,
      required: false,
      default: false,
    },

    twoBalconyView: {
      type: Boolean,
      required: false,
      default: false,
    },

    oneMasterBedroom: {
      type: Boolean,
      required: false,
      default: false,
    },

    twoMasterBedroom: {
      type: Boolean,
      required: false,
      default: false,
    },

    threeMasterBedroom: {
      type: Boolean,
      required: false,
      default: false,
    },

    fourMasterBedroom: {
      type: Boolean,
      required: false,
      default: false,
    },

    internet: {
      type: Boolean,
      required: false,
      default: false,
    },

    maidsRoom: {
      type: Boolean,
      required: false,
      default: false,
    },

    laundryRoom: {
      type: Boolean,
      required: false,
      default: false,
    },

    jacuzzi: {
      type: Boolean,
      required: false,
      default: false,
    },

    privateEntrance: {
      type: Boolean,
      required: false,
      default: false,
    },

    privateGarden: {
      type: Boolean,
      required: false,
      default: false,
    },

    privateSwimmingPool: {
      type: Boolean,
      required: false,
      default: false,
    },

    swimmingpoolUse: {
      type: Boolean,
      required: false,
      default: false,
    },

    compound: {
      type: Boolean,
      required: false,
      default: false,
    },

    walkinCloset: {
      type: Boolean,
      required: false,
      default: false,
    },

    kitchenAppliances: {
      type: Boolean,
      required: false,
      default: false,
    },
    closetoFrenchSchool: {
      type: Boolean,
      required: false,
      default: false,
    },

    closetoCAC: {
      type: Boolean,
      required: false,
      default: false,
    },

    transportNerdy: {
      type: Boolean,
      required: false,
      default: false,
    },

    shoppingNerdy: {
      type: Boolean,
      required: false,
      default: false,
    },

    closetoSchools: {
      type: Boolean,
      required: false,
      default: false,
    },

    closetoRestaurants: {
      type: Boolean,
      required: false,
      default: false,
    },

    closetoGym: {
      type: Boolean,
      required: false,
      default: false,
    },

    closetoMetroStation: {
      type: Boolean,
      required: false,
      default: false,
    },

    security: {
      type: Boolean,
      required: false,
      default: false,
    },

    closetoGym: {
      type: Boolean,
      required: false,
      default: false,
    },

    quietArea: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);
// propertySchema.pre('save', async function (next) {
//   var doc = this;
//   try {
//     const docRef = await property.findOne().sort({ refNumber: -1 });
//     if (docRef)
//       doc.refNumber = docRef.refNumber + 1;
//     else
//       doc.refNumber = 1
//     next();
//   } catch (err) {
//     throw err;
//   }
// });
const property = mongoose.model("Property", propertySchema);
module.exports = property;
