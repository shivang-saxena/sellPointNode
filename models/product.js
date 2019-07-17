const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  title:{
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);


