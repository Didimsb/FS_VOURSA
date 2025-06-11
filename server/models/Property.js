const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'عنوان العقار مطلوب'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'وصف العقار مطلوب']
  },
  price: {
    type: Number,
    required: [true, 'سعر العقار مطلوب'],
    min: [0, 'السعر يجب أن يكون أكبر من صفر']
  },
  location: {
    type: String,
    required: [true, 'موقع العقار مطلوب']
  },
  province: {
    type: String,
    required: [true, 'الولاية مطلوبة'],
    enum: [
      'ولاية الحوض الشرقي',
      'ولاية الحوض الغربي',
      'ولاية العصابة',
      'ولاية كوركول',
      'ولاية البراكنة',
      'ولاية الترارزة',
      'ولاية أدرار',
      'ولاية داخلة نواذيبو',
      'ولاية تكانت',
      'ولاية غيديماغا',
      'ولاية تيرس زمور',
      'ولاية إينشيري',
      'ولاية نواكشوط الشمالية',
      'ولاية نواكشوط الغربية',
      'ولاية نواكشوط الجنوبية'
    ]
  },
  district: {
    type: String,
    required: [true, 'المقاطعة مطلوبة'],
    enum: [
      // الحوض الشرقي
      'مقاطعة امورج',
      'مقاطعة باسكنو',
      'مقاطعة جكني',
      'مقاطعة النعمة',
      'مقاطعة ولاتة',
      'مقاطعة تمبدغة',
      // الحوض الغربي
      'مقاطعة العيون',
      'مقاطعة كوبني',
      'مقاطعة تامشكط',
      'مقاطعة الطينطان',
      // العصابة
      'مقاطعة باركيول',
      'مقاطعة بومديد',
      'مقاطعة كرو',
      'مقاطعة كنكوصة',
      'مقاطعة كيفة',
      // كوركول
      'مقاطعة كيهيدي',
      'مقاطعة امبود',
      'مقاطعة مقامه',
      'مقاطعة مونكل',
      // البراكنة
      'مقاطعة ألاك',
      'مقاطعة بابابي',
      'مقاطعة بوكي',
      'مقاطعة امباني',
      'مقاطعة مقطع لحجار',
      // الترارزة
      'مقاطعة بوتلميت',
      'مقاطعة كرمسين',
      'مقاطعة المذرذره',
      'مقاطعة واد الناقة',
      'مقاطعة الركيز',
      'مقاطعة روصو',
      // أدرار
      'مقاطعة أطار',
      'مقاطعة شنقيط',
      'مقاطعة أوجفت',
      'مقاطعة وادان',
      // داخلة نواذيبو
      'مقاطعة نواذيبو',
      'مقاطعة الشامي',
      // تكانت
      'مقاطعة المجرية',
      'مقاطعة تيشيت',
      'مقاطعة تجكجة',
      // غيديماغا
      'مقاطعة ولد ينج',
      'مقاطعة سيليبابي',
      // تيرس زمور
      'مقاطعة بير أم اكرين',
      'مقاطعة فديرك',
      'مقاطعة الزويرات',
      // إينشيري
      'مقاطعة أكجوجت',
      'مقاطعة بنشاب',
      // نواكشوط الشمالية
      'مقاطعة دار النعيم',
      'مقاطعة تيارت',
      'مقاطعة توجنين',
      // نواكشوط الغربية
      'مقاطعة لكصر',
      'مقاطعة السبخة',
      'مقاطعة تفرغ زينة',
      // نواكشوط الجنوبية
      'مقاطعة عرفات',
      'مقاطعة الميناء',
      'مقاطعة الرياض'
    ]
  },
  propertyType: {
    type: String,
    required: [true, 'نوع العقار مطلوب'],
    enum: ['أرض للبيع','منزل للبيع', 'منزل للايجار', , 'شقة للايجار' ]
  },
  status: {
    type: String,
    required: [true, 'حالة العقار مطلوبة'],
    enum: ['للبيع', 'بيع', 'للايجار', 'مؤجر'],
    default: 'للبيع'
  },
  bedrooms: {
    type: Number,
    // required: [true, 'عدد غرف النوم مطلوب'],
    min: [0, 'عدد غرف النوم يجب أن يكون 0 أو أكثر']
  },
  bathrooms: {
    type: Number,
    // required: [true, 'عدد الحمامات مطلوب'],
    min: [0, 'عدد الحمامات يجب أن يكون 0 أو أكثر']
  },
  area: {
    type: Number,
    required: [true, 'مساحة العقار مطلوبة'],
    min: [0, 'المساحة يجب أن تكون أكبر من 0']
  },
  features: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  images: {
    type: [String],
    required: true,
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userRole: {
    type: String,
    enum: ['admin', 'seller', 'superadmin'],
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  inquiries: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure images are always selected
propertySchema.pre(/^find/, function(next) {
  this.select('+images');
  next();
});

module.exports = mongoose.model('Property', propertySchema); 