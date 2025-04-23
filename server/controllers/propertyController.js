const Property = require('../models/Property');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const mongoose = require('mongoose');
const { Settings, getSettings } = require('../models/Settings');
const Transaction = require('../models/Transaction');
const fs = require('fs');
const Customer = require('../models/Customer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create Property
exports.createProperty = async (req, res) => {
  try {
    console.log('Creating property with data:', req.body);
    console.log('Files:', req.files);
    console.log('User:', req.user);

    const settings = await getSettings();
    if (!settings) {
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إنشاء العقار: لم يتم العثور على إعدادات النظام'
      });
    }

    // Check if user has enough points (skip for admin users)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    console.log('User role:', user.role);
    console.log('User credits:', user.credits);
    console.log('Required points:', settings.pointsPerProperty);

    // Skip points check for admin users
    if (user.role === 'seller') {
      if (user.credits < settings.pointsPerProperty) {
        return res.status(400).json({
          success: false,
          message: `نقاط غير كافية. تحتاج إلى ${settings.pointsPerProperty} نقطة لإضافة عقار`
        });
      }
    }

    // Handle file uploads
    let images = [];
    let filesToDelete = []; // Keep track of files to delete

    if (req.files) {
      // Upload main photo
      if (req.files.mainPhoto && req.files.mainPhoto[0]) {
        try {
          const mainPhotoResult = await cloudinary.uploader.upload(req.files.mainPhoto[0].path, {
            folder: 'properties/main',
            resource_type: 'auto'
          });
          images.push(mainPhotoResult.secure_url);
          filesToDelete.push(req.files.mainPhoto[0].path);
        } catch (error) {
          console.error('Error uploading main photo:', error);
          return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء رفع الصورة الرئيسية'
          });
        }
      }

      // Upload additional media
      if (req.files.additionalMedia) {
        const mediaFiles = Array.isArray(req.files.additionalMedia) 
          ? req.files.additionalMedia 
          : [req.files.additionalMedia];

        for (const file of mediaFiles) {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: 'properties/media',
              resource_type: 'auto'
            });
            images.push(result.secure_url);
            filesToDelete.push(file.path);
          } catch (error) {
            console.error('Error uploading additional media:', error);
            return res.status(500).json({
              success: false,
              message: 'حدث خطأ أثناء رفع الملفات الإضافية'
            });
          }
        }
      }
    }

    // Create property
    const property = await Property.create({
      ...req.body,
      images: images,
      createdBy: req.user.id,
      userRole: req.user.role
    });

    // Deduct points from user (skip for admin users)
    if (user.role === 'seller') {
      user.credits -= settings.pointsPerProperty;
      await user.save();

      // Create transaction record
      await Transaction.create({
        user: req.user.id,
        type: 'property_listing',
        points: settings.pointsPerProperty,
        status: 'completed',
        description: `إضافة عقار جديد: ${property.title}`
      });
    }

    // Delete all uploaded files after successful property creation
    for (const filePath of filesToDelete) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', filePath, err);
        } else {
          console.log('Successfully deleted file:', filePath);
        }
      });
    }

    res.status(201).json({
      success: true,
      property,
      remainingPoints: user.credits
    });

  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء العقار',
      error: error.message
    });
  }
};

// Get All Properties
exports.getAllProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      propertyType,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      sort = '-createdAt'
    } = req.query;

    const query = {};

    if (propertyType) query.propertyType = propertyType;
    if (status) query.status = status;
    if (bedrooms) query.bedrooms = bedrooms;
    if (bathrooms) query.bathrooms = bathrooms;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    const properties = await Property.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name email phone')
      .select('+images');

    const count = await Property.countDocuments(query);

    res.json({
      success: true,
      properties,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error in getAllProperties:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب العقارات'
    });
  }
};

// Get Single Property
exports.getProperty = async (req, res) => {
  try {
    console.log('Fetching property with ID:', req.params.id);
    
    const property = await Property.findById(req.params.id)
      .populate('createdBy', 'name email phone whatsapp')
      .select('+images');

    if (!property) {
      console.log('Property not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'العقار غير موجود'
      });
    }

    console.log('Found property:', {
      id: property._id,
      title: property.title,
      createdBy: property.createdBy
    });

    // Increment views count without saving (to avoid validation errors)
    property.views = (property.views || 0) + 1;
    
    // Update views in database without validation
    await Property.updateOne(
      { _id: property._id },
      { $inc: { views: 1 } }
    );

    res.json({
      success: true,
      property
    });
  } catch (error) {
    console.error('Error in getProperty:', {
      id: req.params.id,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات العقار',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update Property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'العقار غير موجود'
      });
    }

    // Update basic info
    const {
      title,
      description,
      price,
      location,
      propertyType,
      status,
      bedrooms,
      bathrooms,
      area,
      features,
      amenities,
      mainPhotoUrl,
      existingMediaUrls
    } = req.body;

    if (title) property.title = title;
    if (description) property.description = description;
    if (price) property.price = price;
    if (location) property.location = location;
    if (propertyType) property.propertyType = propertyType;
    if (status) property.status = status;
    if (bedrooms) property.bedrooms = bedrooms;
    if (bathrooms) property.bathrooms = bathrooms;
    if (area) property.area = area;
    if (features) property.features = features;
    if (amenities) property.amenities = amenities;

    // Handle image updates
    let images = property.images || []; // Start with existing images

    // Add existing media URLs if provided
    if (existingMediaUrls) {
      try {
        const parsedUrls = JSON.parse(existingMediaUrls);
        images = [...parsedUrls];
      } catch (error) {
        console.error('Error parsing existing media URLs:', error);
      }
    }

    // Handle main photo update
    if (req.files?.mainPhoto?.[0]) {
      // Delete old main photo from Cloudinary if it exists
      if (images.length > 0) {
        const publicId = images[0].split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new main photo
      const mainPhotoResult = await cloudinary.uploader.upload(req.files.mainPhoto[0].path, {
        folder: 'properties/main',
        resource_type: 'auto'
      });
      
      // Replace first image with new main photo
      if (images.length > 0) {
        images[0] = mainPhotoResult.secure_url;
      } else {
        images.push(mainPhotoResult.secure_url);
      }
      
      // Delete the file after uploading to Cloudinary
      fs.unlink(req.files.mainPhoto[0].path, (err) => {
        if (err) console.error('Error deleting main photo:', err);
      });
    } else if (mainPhotoUrl) {
      // Use the provided main photo URL
      if (images.length > 0) {
        images[0] = mainPhotoUrl;
      } else {
        images.push(mainPhotoUrl);
      }
    }

    // Handle additional media updates
    if (req.files?.additionalMedia) {
      const mediaFiles = Array.isArray(req.files.additionalMedia) 
        ? req.files.additionalMedia 
        : [req.files.additionalMedia];

      // Upload new media files
      for (const file of mediaFiles) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'properties/media',
          resource_type: 'auto'
        });
        images.push(result.secure_url);
        // Delete the file after uploading to Cloudinary
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting media file:', err);
        });
      }
    }

    // Update property with new images array
    property.images = images;

    await property.save();

    res.json({
      success: true,
      property
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث العقار'
    });
  }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'العقار غير موجود'
      });
    }

    // Delete images from Cloudinary
    for (const image of property.images) {
      const publicId = image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await property.remove();

    res.json({
      success: true,
      message: 'تم حذف العقار بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف العقار'
    });
  }
};

// Get Latest Properties
exports.getLatestProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .sort('-createdAt')
      .limit(5)
      .populate('createdBy', 'name email')
      .select('+images');

    res.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Error in getLatestProperties:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب آخر العقارات'
    });
  }
};

// @desc    Get seller properties
// @route   GET /api/properties/seller/properties
// @access  Public
exports.getSellerProperties = async (req, res) => {
  try {
    const { sellerId } = req.query;
    
    if (!sellerId) {
      return res.status(400).json({ 
        success: false,
        message: 'معرف البائع مطلوب'
      });
    }

    const properties = await Property.find({ createdBy: sellerId })
      .populate('createdBy', 'name email')
      .select('+images')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Error in getSellerProperties:', error);
    res.status(500).json({ 
      success: false,
      message: 'خطأ في جلب عقارات البائع'
    });
  }
};

// @desc    Reject property by admin
// @route   PUT /api/properties/:id/reject
// @access  Private/Admin
exports.rejectProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'العقار غير موجود'
      });
    }

    // Delete images from Cloudinary
    for (const image of property.images) {
      const publicId = image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete the property
    await property.deleteOne();

    res.json({
      success: true,
      message: 'تم رفض العقار بنجاح'
    });
  } catch (error) {
    console.error('Error rejecting property:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في رفض العقار'
    });
  }
};

exports.markPropertyAsSold = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { customerName, customerPhone, agreedPrice } = req.body;

    // Validate propertyId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'معرف العقار غير صالح'
      });
    }

    // Validate input
    if (!customerName || !customerPhone || !agreedPrice) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة'
      });
    }

    // Check if property exists and belongs to the seller
    const property = await Property.findOne({
      _id: propertyId,
      createdBy: req.user._id
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'العقار غير موجود أو لا تملك صلاحية التعديل عليه'
      });
    }

    // Check if property is already sold
    if (property.status === 'بيع') {
      return res.status(400).json({
        success: false,
        message: 'العقار تم بيعه مسبقاً'
      });
    }

    // Create customer record
    const customer = await Customer.create({
      name: customerName,
      phone: customerPhone,
      agreedPrice: agreedPrice,
      property: propertyId,
      seller: req.user._id
    });

    // Update property status
    property.status = 'بيع';
    await property.save();

    res.status(200).json({
      success: true,
      message: 'تم تحديث حالة العقار بنجاح',
      data: {
        property,
        customer
      }
    });
  } catch (error) {
    console.error('Error marking property as sold:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث حالة العقار'
    });
  }
};

exports.getSellerCustomers = async (req, res) => {
  try {
    const { sellerId } = req.query;
    
    if (!sellerId) {
      return res.status(400).json({ 
        success: false,
        message: 'معرف البائع مطلوب'
      });
    }

    const customers = await Customer.find({ seller: sellerId })
      .populate('property', 'title price location images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      customers
    });
  } catch (error) {
    console.error('Error fetching seller customers:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب بيانات العملاء'
    });
  }
};

// @desc    Get seller statistics
// @route   GET /api/properties/seller/stats
// @access  Private
exports.getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user._id;
    console.log('Fetching stats for seller:', sellerId);

    // Get total properties
    const totalProperties = await Property.countDocuments({ createdBy: sellerId });
    console.log('Total properties:', totalProperties);

    // Get available properties (status: lilbay3)
    const activeProperties = await Property.countDocuments({ 
      createdBy: sellerId,
      status: 'للبيع'
    });
    console.log('Available properties:', activeProperties);

    // Get total views
    const properties = await Property.find({ createdBy: sellerId });
    const totalViews = properties.reduce((sum, property) => sum + (property.views || 0), 0);
    console.log('Total views:', totalViews);

    // Get total sales and total sales amount
    const customers = await Customer.find({ seller: sellerId });
    console.log('Found customers:', customers.length);
    console.log('Customers data:', JSON.stringify(customers, null, 2));
    
    const totalSales = customers.length;
    const totalSalesAmount = customers.reduce((sum, customer) => {
      console.log('Customer agreedPrice:', customer.agreedPrice);
      return sum + (customer.agreedPrice || 0);
    }, 0);
    console.log('Total sales amount:', totalSalesAmount);

    // Get monthly sales
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthlySales = await Customer.countDocuments({
      seller: sellerId,
      createdAt: { $gte: startOfMonth }
    });
    console.log('Monthly sales:', monthlySales);

    // Get monthly views
    const monthlyViews = properties.reduce((sum, property) => {
      const viewsThisMonth = property.viewsHistory?.filter(view => 
        new Date(view.date) >= startOfMonth
      ).length || 0;
      return sum + viewsThisMonth;
    }, 0);
    console.log('Monthly views:', monthlyViews);

    const stats = {
      totalProperties,
      activeProperties,
      totalViews,
      totalSales,
      totalSalesAmount,
      monthlySales,
      monthlyViews
    };
    console.log('Final stats:', stats);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب إحصائيات البائع'
    });
  }
}; 