const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Site settings
  siteName: {
    type: String,
    default: 'وكالة بورصة العقارية',
    required: true
  },
  siteDescription: {
    type: String,
    default: 'أفضل وكالة عقارية في المملكة',
    required: true
  },
  contactEmail: {
    type: String,
    default: 'info@voursa.com',
    required: true
  },
  contactPhone: {
    type: String,
    default: '+966 50 123 4567',
    required: true
  },
  
  // Home page settings
  homePage: {
    heroTitle: {
      type: String,
      default: 'وكالة بورصة العقارية',
      required: true
    },
    heroDescription: {
      type: String,
      default: 'نقدم حلولاً عقارية متكاملة تلبي احتياجات عملائنا بأعلى معايير الجودة والشفافية',
      required: true
    },
    heroMedia: [{
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      thumbnail: {
        type: String
      },
      isActive: {
        type: Boolean,
        default: true
      },
      order: {
        type: Number,
        default: 0
      }
    }],
    featuredPropertiesTitle: {
      type: String,
      default: 'أحدث العقارات',
      required: true
    },
    featuredPropertiesDescription: {
      type: String,
      default: 'اكتشف مجموعة متنوعة من العقارات المميزة في أفضل المواقع',
      required: true
    }
  },

  // About page settings
  aboutPage: {
    heroTitle: {
      type: String,
      default: 'وكالة ورسة العقارية',
      required: true
    },
    heroDescription: {
      type: String,
      default: 'نحن نقدم حلولاً عقارية متكاملة تلبي احتياجات عملائنا بأعلى معايير الجودة والشفافية',
      required: true
    },
    heroImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    },
    storyTitle: {
      type: String,
      default: 'قصتنا',
      required: true
    },
    storyContent: {
      type: String,
      default: 'تأسست وكالة ورسة العقارية في عام 2013 بهدف تقديم خدمات عقارية متكاملة تلبي احتياجات العملاء في موريتانيا. بدأنا بفريق صغير من الخبراء المتخصصين في مجال العقارات، وتمكنا من بناء سمعة طيبة في السوق بفضل التزامنا بالشفافية والجودة.',
      required: true
    },
    storyImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
    },
    values: [{
      icon: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }],
    teamMembers: [{
      name: {
        type: String,
        required: true
      },
      role: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      bio: {
        type: String,
        required: true
      },
      social: {
        instagram: String,
        facebook: String,
        twitter: String,
        tiktok: String
      }
    }],
    stats: [{
      label: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      }
    }]
  },

  // Contact page settings
  contactPage: {
    title: {
      type: String,
      default: 'تواصل معنا',
      required: true
    },
    description: {
      type: String,
      default: 'نحن هنا لمساعدتك في جميع استفساراتك. لا تتردد في التواصل معنا',
      required: true
    },
    address: {
      type: String,
      default: 'شارع الرئيسي، نواكشوط، موريتانيا',
      required: true
    },
    phone: {
      type: String,
      default: '+222 123 456 789',
      required: true
    },
    email: {
      type: String,
      default: 'info@voursa.com',
      required: true
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String
    },
    mapEmbedUrl: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15282225.313766744!2d-17.5!3d20.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe32a9ad62337c7d%3A0x4c0e1f7a1c0e1f7a!2sMauritania!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus'
    },
    developerInfo: {
      companyName: {
        type: String,
        default: 'شركة الهلال الرقمية',
        required: true
      },
      description: {
        type: String,
        default: 'شركة الهلال الرقمية هي شركة متخصصة في تطوير الحلول التقنية والبرمجية. نحن نقدم خدمات تطوير المواقع والتطبيقات بجودة عالية وأسعار تنافسية.',
        required: true
      },
      logo: {
        type: String,
        default: '/elhilal.png'
      },
      whatsapp: {
        type: String,
        default: '22242900600'
      }
    }
  },
  
  // Points settings
  pointCost: {
    type: Number,
    required: true
  },
  pointsPerProperty: {
    type: Number,
    required: true
  },
  minPointsToBuy: {
    type: Number,
    required: true
  },
  maxPointsToBuy: {
    type: Number,
    required: true
  },
  
  // User settings
  autoRegistration: {
    type: Boolean,
    default: false
  },
  emailVerification: {
    type: Boolean,
    default: true
  },
  phoneVerification: {
    type: Boolean,
    default: true
  },
  
  // Property settings
  autoPropertyApproval: {
    type: Boolean,
    default: false
  },
  propertyComments: {
    type: Boolean,
    default: true
  },
  propertyRatings: {
    type: Boolean,
    default: true
  },
  
  // Payment methods
  paymentMethods: [{
    bankId: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    accountName: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // New banner and social media settings
  banners: {
    home: {
      banner1: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true }
      }
    },
    about: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, required: true }
    },
    contact: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String, required: true }
    }
  },
  socialMedia: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    whatsapp: { type: String },
    youtube: { type: String }
  },

  // Team members settings
  teamMembers: [{
    name: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      required: true
    },
    social: {
      instagram: String,
      facebook: String,
      twitter: String,
      tiktok: String
    }
  }]
}, {
  timestamps: true
});

// Create a singleton instance
const Settings = mongoose.model('Settings', settingsSchema);

// Function to get settings or create default if not exists
const getSettings = async () => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({});
    }
    
    return settings;
  } catch (error) {
    console.error('Error in getSettings:', error);
    throw error;
  }
};

// Create default settings if none exist
const initializeSettings = async () => {
  try {
    const count = await Settings.countDocuments();
    if (count === 0) {
      await Settings.create({});
      console.log('Default settings created successfully');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
};

// Call initializeSettings when the model is loaded
initializeSettings();

module.exports = {
  Settings,
  getSettings
}; 