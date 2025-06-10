import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, updateSettings as updateSettingsApi, updatePaymentMethods } from '../services/SettingsService';
import { useToast } from '@chakra-ui/react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getSettings();
      if (response.success) {
        setSettings(response.settings);
        setError(null);
      } else {
        setError(response.message);
        setSettings({
          siteName: 'وكالة فرصة العقارية',
          siteDescription: 'أفضل وكالة عقارية في موريتانيا',
          contactEmail: 'agencevoursa@gmail.com',
          contactPhone: '+222 44 19 16 13',
          homePage: {
            heroTitle: 'وكالة فرصة العقارية',
            heroDescription: 'نقدم حلولاً عقارية متكاملة تلبي احتياجات عملائنا بأعلى معايير الجودة والشفافية',
            featuredPropertiesTitle: 'أحدث العقارات',
            featuredPropertiesDescription: 'اكتشف مجموعة متنوعة من العقارات المميزة في أفضل المواقع',
            heroMedia: []
          },
          aboutPage: {
            heroTitle: 'وكالة فرصة العقارية',
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
            phone: '+222 44 19 16 13',
            email: 'agencevoursa@gmail.com',
            socialMedia: {},
            mapEmbedUrl: ''
          },
          banners: {
            home: {},
            about: {},
            contact: {}
          },
          socialMedia: {},
          pointCost: 0,
          pointsPerProperty: 0,
          minPointsToBuy: 0,
          maxPointsToBuy: 0,
          paymentMethods: []
        });
      }
    } catch (error) {
      setError(error.message);
      setSettings({
        siteName: 'وكالة فرصة العقارية',
        siteDescription: 'أفضل وكالة عقارية في موريتانيا',
        contactEmail: 'agencevoursa@gmail.com',
        contactPhone: '+222 44 19 16 13',
        homePage: {
          heroTitle: 'وكالة فرصة العقارية',
          heroDescription: 'نقدم حلولاً عقارية متكاملة تلبي احتياجات عملائنا بأعلى معايير الجودة والشفافية',
          featuredPropertiesTitle: 'أحدث العقارات',
          featuredPropertiesDescription: 'اكتشف مجموعة متنوعة من العقارات المميزة في أفضل المواقع',
          heroMedia: []
        },
        aboutPage: {
          heroTitle: 'وكالة فرصة العقارية',
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
          phone: '+222 44 19 16 13',
          email: 'agencevoursa@gmail.com',
          socialMedia: {},
          mapEmbedUrl: ''
        },
        banners: {
          home: {},
          about: {},
          contact: {}
        },
        socialMedia: {},
        pointCost: 0,
        pointsPerProperty: 0,
        minPointsToBuy: 0,
        maxPointsToBuy: 0,
        paymentMethods: []
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      setLoading(true);
      const response = await updateSettingsApi(newSettings);
      if (response.success) {
        setSettings(response.data);
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