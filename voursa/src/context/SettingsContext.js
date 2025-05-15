import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, updateSettings as updateSettingsApi, updatePaymentMethods } from '../services/SettingsService';
import { useToast } from '@chakra-ui/react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const defaultSettings = {
    siteName: 'وكالة بورصة العقارية',
    siteDescription: 'أفضل وكالة عقارية في المملكة',
    contactEmail: 'info@voursa.com',
    contactPhone: '+222 123 456 789',
    homePage: {
      heroTitle: 'وكالة بورصة العقارية',
      heroDescription: 'نقدم حلولاً عقارية متكاملة تلبي احتياجات عملائنا بأعلى معايير الجودة والشفافية',
      featuredPropertiesTitle: 'أحدث العقارات',
      featuredPropertiesDescription: 'اكتشف مجموعة متنوعة من العقارات المميزة في أفضل المواقع',
      heroMedia: []
    },
    aboutPage: {
      heroTitle: 'وكالة ورسة العقارية',
      heroDescription: 'نحن نقدم حلولاً عقارية متكاملة تلبي احتياجات عملائنا بأعلى معايير الجودة والشفافية',
      storyTitle: 'قصتنا',
      storyContent: 'تأسست وكالة ورسة العقارية في عام 2013 بهدف تقديم خدمات عقارية متكاملة تلبي احتياجات العملاء في موريتانيا',
      values: [],
      teamMembers: [] 
    },
    contactPage: {
      title: 'تواصل معنا',
      description: 'نحن هنا لمساعدتك في جميع استفساراتك. لا تتردد في التواصل معنا',
      address: 'شارع الرئيسي، نواكشوط، موريتانيا',
      phone: '+222 123 456 789',
      email: 'info@voursa.com',
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
    pointCost: 0,
    pointsPerProperty: 0,
    minPointsToBuy: 0,
    maxPointsToBuy: 0,
    paymentMethods: [],
    teamMembers: []
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getSettings();
      if (response.success) {
        // Merge the response settings with default settings to ensure all fields exist
        const mergedSettings = {
          ...defaultSettings,
          ...response.settings,
          homePage: {
            ...defaultSettings.homePage,
            ...response.settings.homePage
          },
          aboutPage: {
            ...defaultSettings.aboutPage,
            ...response.settings.aboutPage
          },
          contactPage: {
            ...defaultSettings.contactPage,
            ...response.settings.contactPage
          },
          banners: {
            ...defaultSettings.banners,
            ...response.settings.banners
          },
          socialMedia: {
            ...defaultSettings.socialMedia,
            ...response.settings.socialMedia
          }
        };
        setSettings(mergedSettings);
        setError(null);
      } else {
        setError(response.message);
        setSettings(defaultSettings);
      }
    } catch (error) {
      setError(error.message);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      setLoading(true);
      const response = await updateSettingsApi(newSettings);
      if (response.success) {
        // Merge the updated settings with default settings
        const mergedSettings = {
          ...defaultSettings,
          ...response.data,
          homePage: {
            ...defaultSettings.homePage,
            ...response.data.homePage
          },
          aboutPage: {
            ...defaultSettings.aboutPage,
            ...response.data.aboutPage
          },
          contactPage: {
            ...defaultSettings.contactPage,
            ...response.data.contactPage
          },
          banners: {
            ...defaultSettings.banners,
            ...response.data.banners
          },
          socialMedia: {
            ...defaultSettings.socialMedia,
            ...response.data.socialMedia
          }
        };
        setSettings(mergedSettings);
        setError(null);
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث الإعدادات بنجاح',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        return { success: true };
      } else {
        setError(response.error);
        toast({
          title: 'خطأ',
          description: response.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      setError(error.message);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث الإعدادات',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentMethods = async (paymentMethods) => {
    try {
      const response = await updatePaymentMethods(paymentMethods);
      if (response.success) {
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
          description: response.error,
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

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 