import axiosInstance from '../utils/axiosInstance';

// Get all settings
export const getSettings = async () => {
  try {
    const response = await axiosInstance.get('/settings');
    const settings = response.data.settings;
    
    // Process settings to ensure all required fields are present
    const processedSettings = {
      siteName: settings?.siteName,
      siteDescription: settings?.siteDescription,
      contactEmail: settings?.contactEmail,
      contactPhone: settings?.contactPhone,
      homePage: {
        heroTitle: settings?.homePage?.heroTitle,
        heroDescription: settings?.homePage?.heroDescription,
        featuredPropertiesTitle: settings?.homePage?.featuredPropertiesTitle,
        featuredPropertiesDescription: settings?.homePage?.featuredPropertiesDescription,
        heroMedia: settings?.homePage?.heroMedia || []
      },
      aboutPage: {
        heroTitle: settings?.aboutPage?.heroTitle,
        heroDescription: settings?.aboutPage?.heroDescription,
        storyTitle: settings?.aboutPage?.storyTitle,
        storyContent: settings?.aboutPage?.storyContent,
        storyImage: settings?.aboutPage?.storyImage,
        values: settings?.aboutPage?.values || [],
        teamMembers: settings?.aboutPage?.teamMembers || []
      },
      contactPage: {
        title: settings?.contactPage?.title,
        description: settings?.contactPage?.description,
        address: settings?.contactPage?.address,
        phone: settings?.contactPage?.phone,
        email: settings?.contactPage?.email,
        socialMedia: settings?.contactPage?.socialMedia || {},
        mapEmbedUrl: settings?.contactPage?.mapEmbedUrl
      },
      banners: {
        home: settings?.banners?.home || {},
        about: settings?.banners?.about || {},
        contact: settings?.banners?.contact || {}
      },
      // Process teamMembers with their social media data
      teamMembers: settings?.teamMembers?.map(member => ({
        ...member,
        social: {
          facebook: member?.social?.facebook || '',
          twitter: member?.social?.twitter || '',
          instagram: member?.social?.instagram || '',
          linkedin: member?.social?.linkedin || ''
        }
      })) || [],
      socialMedia: settings?.socialMedia || {},
      pointCost: settings?.pointCost || 0,
      pointsPerProperty: settings?.pointsPerProperty || 0,
      minPointsToBuy: settings?.minPointsToBuy || 0,
      maxPointsToBuy: settings?.maxPointsToBuy || 0,
      paymentMethods: settings?.paymentMethods || []
    };
    
    console.log('Processed Settings:', processedSettings); // Debug log
    
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

    // Ensure points settings are numbers
    const processedData = {
      ...settingsData,
      pointCost: Number(settingsData.pointCost) || 0,
      pointsPerProperty: Number(settingsData.pointsPerProperty) || 0,
      minPointsToBuy: Number(settingsData.minPointsToBuy) || 0,
      maxPointsToBuy: Number(settingsData.maxPointsToBuy) || 0
    };

    const response = await axiosInstance.put('/settings', processedData);
    console.log('SettingsService - Update settings response:', response.data);
    
    if (response.data.success) {
      const updatedSettings = {
        ...response.data.settings,
        pointCost: Number(response.data.settings.pointCost) || 0,
        pointsPerProperty: Number(response.data.settings.pointsPerProperty) || 0,
        minPointsToBuy: Number(response.data.settings.minPointsToBuy) || 0,
        maxPointsToBuy: Number(response.data.settings.maxPointsToBuy) || 0
      };
      
      return {
        success: true,
        settings: updatedSettings
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