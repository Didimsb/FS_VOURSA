import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useToast } from '@chakra-ui/react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const defaultSettings = {
  // Site Info
  siteName: '',
  siteDescription: '',
  contactEmail: '',
  contactPhone: '',

  // Points Settings
  pointCost: 0,
  pointsPerProperty: 0,
  minPointsToBuy: 0,
  maxPointsToBuy: 0,

  // Payment Methods
  paymentMethods: [
    {
      bankId: '',
      accountNumber: '',
      accountName: '',
      isActive: true,
      image: ''
    }
  ],

  // Home Page Settings
  homePage: {
    heroTitle: '',
    heroDescription: '',
    featuredPropertiesTitle: '',
    featuredPropertiesDescription: '',
    heroMedia: [],
    sections: {
      featuredProperties: {
        title: '',
        description: ''
      },
      latestProperties: {
        title: '',
        description: ''
      },
      testimonials: {
        title: '',
        description: ''
      }
    }
  },

  // About Page Settings
  aboutPage: {
    heroTitle: '',
    heroDescription: '',
    storyTitle: '',
    storyContent: '',
    storyImage: '',
    values: [
      {
        title: '',
        description: '',
        icon: ''
      }
    ],
    teamMembers: [
      {
        name: '',
        position: '',
        bio: '',
        image: '',
        social: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: ''
        }
      }
    ]
  },

  // Contact Page Settings
  contactPage: {
    title: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      whatsapp: '',
      youtube: ''
    },
    mapEmbedUrl: '',
    workingHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    }
  },

  // Banners
  banners: {
    home: {
      banner1: {
        title: '',
        description: '',
        image: ''
      }
    },
    about: {
      title: '',
      description: '',
      image: ''
    },
    contact: {
      title: '',
      description: '',
      image: ''
    }
  },

  // Social Media
  socialMedia: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    whatsapp: '',
    youtube: ''
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/settings');
      if (response.data.success) {
        // Deep merge the fetched settings with default settings
        const mergedSettings = {
          ...defaultSettings,
          ...response.data.settings,
          homePage: {
            ...defaultSettings.homePage,
            ...response.data.settings.homePage,
            sections: {
              ...defaultSettings.homePage.sections,
              ...(response.data.settings.homePage?.sections || {})
            }
          },
          aboutPage: {
            ...defaultSettings.aboutPage,
            ...response.data.settings.aboutPage,
            values: response.data.settings.aboutPage?.values || defaultSettings.aboutPage.values,
            teamMembers: response.data.settings.aboutPage?.teamMembers || defaultSettings.aboutPage.teamMembers
          },
          contactPage: {
            ...defaultSettings.contactPage,
            ...response.data.settings.contactPage,
            socialMedia: {
              ...defaultSettings.contactPage.socialMedia,
              ...(response.data.settings.contactPage?.socialMedia || {})
            },
            workingHours: {
              ...defaultSettings.contactPage.workingHours,
              ...(response.data.settings.contactPage?.workingHours || {})
            }
          },
          banners: {
            ...defaultSettings.banners,
            ...response.data.settings.banners,
            home: {
              ...defaultSettings.banners.home,
              ...(response.data.settings.banners?.home || {})
            }
          },
          socialMedia: {
            ...defaultSettings.socialMedia,
            ...response.data.settings.socialMedia
          },
          paymentMethods: response.data.settings.paymentMethods || defaultSettings.paymentMethods
        };

        // Ensure numeric values are properly converted
        mergedSettings.pointCost = Number(mergedSettings.pointCost) || 0;
        mergedSettings.pointsPerProperty = Number(mergedSettings.pointsPerProperty) || 0;
        mergedSettings.minPointsToBuy = Number(mergedSettings.minPointsToBuy) || 0;
        mergedSettings.maxPointsToBuy = Number(mergedSettings.maxPointsToBuy) || 0;

        setSettings(mergedSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError(error.message);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب الإعدادات',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      // Deep merge the new settings with default settings
      const settingsToUpdate = {
        ...defaultSettings,
        ...newSettings,
        homePage: {
          ...defaultSettings.homePage,
          ...newSettings.homePage,
          sections: {
            ...defaultSettings.homePage.sections,
            ...(newSettings.homePage?.sections || {})
          }
        },
        aboutPage: {
          ...defaultSettings.aboutPage,
          ...newSettings.aboutPage,
          values: newSettings.aboutPage?.values || defaultSettings.aboutPage.values,
          teamMembers: newSettings.aboutPage?.teamMembers || defaultSettings.aboutPage.teamMembers
        },
        contactPage: {
          ...defaultSettings.contactPage,
          ...newSettings.contactPage,
          socialMedia: {
            ...defaultSettings.contactPage.socialMedia,
            ...(newSettings.contactPage?.socialMedia || {})
          },
          workingHours: {
            ...defaultSettings.contactPage.workingHours,
            ...(newSettings.contactPage?.workingHours || {})
          }
        },
        banners: {
          ...defaultSettings.banners,
          ...newSettings.banners,
          home: {
            ...defaultSettings.banners.home,
            ...(newSettings.banners?.home || {})
          }
        },
        socialMedia: {
          ...defaultSettings.socialMedia,
          ...newSettings.socialMedia
        },
        paymentMethods: newSettings.paymentMethods || defaultSettings.paymentMethods
      };

      const response = await axiosInstance.put('/settings', settingsToUpdate);
      if (response.data.success) {
        setSettings(settingsToUpdate);
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث الإعدادات بنجاح',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        return { success: true, settings: settingsToUpdate };
      }
      toast({
        title: 'خطأ',
        description: response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return { success: false, error: response.data.message };
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث الإعدادات',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return { success: false, error: error.message };
    }
  };

  const handleUpdatePaymentMethods = async (paymentMethods) => {
    try {
      const response = await axiosInstance.put('/settings/payment-methods', { paymentMethods });
      if (response.data.success) {
        setSettings(prev => ({
          ...prev,
          paymentMethods: response.data.paymentMethods
        }));
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث طرق الدفع بنجاح',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        return true;
      } else {
        toast({
          title: 'خطأ',
          description: response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث طرق الدفع',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const value = {
    settings,
    loading,
    error,
    updateSettings,
    updatePaymentMethods: handleUpdatePaymentMethods,
    refreshSettings: fetchSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext; 