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
  siteName: '',
  siteDescription: '',
  contactEmail: '',
  contactPhone: '',
  pointCost: 0,
  pointsPerProperty: 0,
  minPointsToBuy: 0,
  maxPointsToBuy: 0,
  paymentMethods: [],
  homePage: {
    heroTitle: '',
    heroDescription: '',
    featuredPropertiesTitle: '',
    featuredPropertiesDescription: '',
    heroMedia: []
  },
  aboutPage: {
    heroTitle: '',
    heroDescription: '',
    storyTitle: '',
    storyContent: '',
    storyImage: '',
    values: [],
    teamMembers: []
  },
  contactPage: {
    title: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    socialMedia: {},
    mapEmbedUrl: ''
  },
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
  socialMedia: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    whatsapp: '',
    youtube: ''
  },
  teamMembers: []
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
        // Merge the fetched settings with default settings to ensure all fields exist
        const mergedSettings = {
          ...defaultSettings,
          ...response.data.settings,
          homePage: {
            ...defaultSettings.homePage,
            ...response.data.settings.homePage
          },
          aboutPage: {
            ...defaultSettings.aboutPage,
            ...response.data.settings.aboutPage
          },
          contactPage: {
            ...defaultSettings.contactPage,
            ...response.data.settings.contactPage
          },
          banners: {
            ...defaultSettings.banners,
            ...response.data.settings.banners
          },
          socialMedia: {
            ...defaultSettings.socialMedia,
            ...response.data.settings.socialMedia
          }
        };
        setSettings(mergedSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      // Ensure all required fields are present
      const settingsToUpdate = {
        ...defaultSettings,
        ...newSettings,
        homePage: {
          ...defaultSettings.homePage,
          ...newSettings.homePage
        },
        aboutPage: {
          ...defaultSettings.aboutPage,
          ...newSettings.aboutPage
        },
        contactPage: {
          ...defaultSettings.contactPage,
          ...newSettings.contactPage
        },
        banners: {
          ...defaultSettings.banners,
          ...newSettings.banners
        },
        socialMedia: {
          ...defaultSettings.socialMedia,
          ...newSettings.socialMedia
        }
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