import axiosInstance from '../utils/axiosInstance';

// Get all settings
export const getSettings = async () => {
  try {
    const response = await axiosInstance.get('/settings');
    const settings = response.data.settings;
    
    // Process settings to ensure all required fields are present
    const processedSettings = {
      siteName: settings?.siteName || '',
      siteDescription: settings?.siteDescription || '',
      contactEmail: settings?.contactEmail || '',
      contactPhone: settings?.contactPhone || '',
      homePage: {
        heroTitle: settings?.homePage?.heroTitle || '',
        heroDescription: settings?.homePage?.heroDescription || '',
        featuredPropertiesTitle: settings?.homePage?.featuredPropertiesTitle || '',
        featuredPropertiesDescription: settings?.homePage?.featuredPropertiesDescription || '',
        heroMedia: settings?.homePage?.heroMedia || []
      },
      aboutPage: {
        heroTitle: settings?.aboutPage?.heroTitle || '',
        heroDescription: settings?.aboutPage?.heroDescription || '',
        storyTitle: settings?.aboutPage?.storyTitle || '',
        storyContent: settings?.aboutPage?.storyContent || '',
        storyImage: settings?.aboutPage?.storyImage || '',
        values: settings?.aboutPage?.values || [],
        teamMembers: settings?.aboutPage?.teamMembers || []
      },
      contactPage: {
        title: settings?.contactPage?.title || '',
        description: settings?.contactPage?.description || '',
        address: settings?.contactPage?.address || '',
        phone: settings?.contactPage?.phone || '',
        email: settings?.contactPage?.email || '',
        socialMedia: settings?.contactPage?.socialMedia || {},
        mapEmbedUrl: settings?.contactPage?.mapEmbedUrl || ''
      },
      banners: {
        home: {
          banner1: {
            title: settings?.banners?.home?.banner1?.title || '',
            description: settings?.banners?.home?.banner1?.description || '',
            image: settings?.banners?.home?.banner1?.image || ''
          }
        },
        about: {
          title: settings?.banners?.about?.title || '',
          description: settings?.banners?.about?.description || '',
          image: settings?.banners?.about?.image || ''
        },
        contact: {
          title: settings?.banners?.contact?.title || '',
          description: settings?.banners?.contact?.description || '',
          image: settings?.banners?.contact?.image || ''
        }
      },
      socialMedia: {
        facebook: settings?.socialMedia?.facebook || '',
        twitter: settings?.socialMedia?.twitter || '',
        instagram: settings?.socialMedia?.instagram || '',
        linkedin: settings?.socialMedia?.linkedin || '',
        whatsapp: settings?.socialMedia?.whatsapp || '',
        youtube: settings?.socialMedia?.youtube || ''
      },
      pointCost: Number(settings?.pointCost) || 0,
      pointsPerProperty: Number(settings?.pointsPerProperty) || 0,
      minPointsToBuy: Number(settings?.minPointsToBuy) || 0,
      maxPointsToBuy: Number(settings?.maxPointsToBuy) || 0,
      paymentMethods: settings?.paymentMethods || [],
      teamMembers: settings?.teamMembers || []
    };
    
    console.log('Processed Settings:', processedSettings);
    
    return {
      success: true,
      settings: processedSettings
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message
    };
  }
};

// Update settings
export const updateSettings = async (settingsData) => {
  try {
    console.log('SettingsService - Updating settings with data:', settingsData);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Ensure all required fields are present and properly formatted
    const processedData = {
      ...settingsData,
      pointCost: Number(settingsData.pointCost) || 0,
      pointsPerProperty: Number(settingsData.pointsPerProperty) || 0,
      minPointsToBuy: Number(settingsData.minPointsToBuy) || 0,
      maxPointsToBuy: Number(settingsData.maxPointsToBuy) || 0,
      homePage: {
        heroTitle: settingsData.homePage?.heroTitle || '',
        heroDescription: settingsData.homePage?.heroDescription || '',
        featuredPropertiesTitle: settingsData.homePage?.featuredPropertiesTitle || '',
        featuredPropertiesDescription: settingsData.homePage?.featuredPropertiesDescription || '',
        heroMedia: settingsData.homePage?.heroMedia || []
      },
      aboutPage: {
        heroTitle: settingsData.aboutPage?.heroTitle || '',
        heroDescription: settingsData.aboutPage?.heroDescription || '',
        storyTitle: settingsData.aboutPage?.storyTitle || '',
        storyContent: settingsData.aboutPage?.storyContent || '',
        storyImage: settingsData.aboutPage?.storyImage || '',
        values: settingsData.aboutPage?.values || [],
        teamMembers: settingsData.aboutPage?.teamMembers || []
      },
      contactPage: {
        title: settingsData.contactPage?.title || '',
        description: settingsData.contactPage?.description || '',
        address: settingsData.contactPage?.address || '',
        phone: settingsData.contactPage?.phone || '',
        email: settingsData.contactPage?.email || '',
        socialMedia: settingsData.contactPage?.socialMedia || {},
        mapEmbedUrl: settingsData.contactPage?.mapEmbedUrl || ''
      },
      banners: {
        home: {
          banner1: {
            title: settingsData.banners?.home?.banner1?.title || '',
            description: settingsData.banners?.home?.banner1?.description || '',
            image: settingsData.banners?.home?.banner1?.image || ''
          }
        },
        about: {
          title: settingsData.banners?.about?.title || '',
          description: settingsData.banners?.about?.description || '',
          image: settingsData.banners?.about?.image || ''
        },
        contact: {
          title: settingsData.banners?.contact?.title || '',
          description: settingsData.banners?.contact?.description || '',
          image: settingsData.banners?.contact?.image || ''
        }
      },
      socialMedia: {
        facebook: settingsData.socialMedia?.facebook || '',
        twitter: settingsData.socialMedia?.twitter || '',
        instagram: settingsData.socialMedia?.instagram || '',
        linkedin: settingsData.socialMedia?.linkedin || '',
        whatsapp: settingsData.socialMedia?.whatsapp || '',
        youtube: settingsData.socialMedia?.youtube || ''
      }
    };

    const response = await axiosInstance.put('/settings', processedData);
    console.log('SettingsService - Update settings response:', response.data);
    
    if (response.data.success) {
      return {
        success: true,
        settings: response.data.settings
      };
    } else {
      throw new Error(response.data.message || 'Failed to update settings');
    }
  } catch (error) {
    console.error('SettingsService - Error updating settings:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'حدث خطأ أثناء تحديث الإعدادات'
    };
  }
};

// Update payment methods
export const updatePaymentMethods = async (paymentMethods) => {
  try {
    const response = await axiosInstance.put('/settings/payment-methods', { paymentMethods });
    return {
      success: true,
      data: response.data.settings,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'حدث خطأ أثناء تحديث طرق الدفع',
    };
  }
};