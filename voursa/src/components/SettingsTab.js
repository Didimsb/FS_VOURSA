import React from 'react';
import {
  Box,
  VStack,
  Heading,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  Button,
  Text,
} from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const SettingsTab = () => {
  const { settings: localSettings, handleSettingChange } = useSettings();

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" mb={4}>إعدادات الصفحة الرئيسية</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl>
            <FormLabel>عنوان القسم الرئيسي</FormLabel>
            <Input
              value={localSettings?.homePage?.heroTitle || ''}
              onChange={(e) => handleSettingChange('homePage.heroTitle', e.target.value)}
              placeholder="عنوان القسم الرئيسي"
            />
          </FormControl>
          <FormControl>
            <FormLabel>وصف القسم الرئيسي</FormLabel>
            <Textarea
              value={localSettings?.homePage?.heroDescription || ''}
              onChange={(e) => handleSettingChange('homePage.heroDescription', e.target.value)}
              placeholder="وصف القسم الرئيسي"
            />
          </FormControl>
        </SimpleGrid>
      </Box>

      <Box>
        <Heading size="md" mb={4}>إدارة البانر</Heading>
        <VStack spacing={4} align="stretch">
          {!localSettings?.homePage?.heroMedia?.length ? (
            <Text color="gray.500" textAlign="center">لا توجد وسائط مضافة</Text>
          ) : (
            localSettings.homePage.heroMedia.map((media, index) => (
              <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>نوع الوسائط</FormLabel>
                    <Select
                      value={media.type}
                      onChange={(e) => {
                        const updatedMedia = [...localSettings.homePage.heroMedia];
                        updatedMedia[index] = { ...updatedMedia[index], type: e.target.value };
                        handleSettingChange('homePage.heroMedia', updatedMedia);
                      }}
                    >
                      <option value="image">صورة</option>
                      <option value="video">فيديو</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>الرابط</FormLabel>
                    <Input
                      value={media.url}
                      onChange={(e) => {
                        const updatedMedia = [...localSettings.homePage.heroMedia];
                        updatedMedia[index] = { ...updatedMedia[index], url: e.target.value };
                        handleSettingChange('homePage.heroMedia', updatedMedia);
                      }}
                      placeholder="رابط الوسائط"
                    />
                  </FormControl>
                  {media.type === 'video' && (
                    <FormControl>
                      <FormLabel>صورة مصغرة</FormLabel>
                      <Input
                        value={media.thumbnail || ''}
                        onChange={(e) => {
                          const updatedMedia = [...localSettings.homePage.heroMedia];
                          updatedMedia[index] = { ...updatedMedia[index], thumbnail: e.target.value };
                          handleSettingChange('homePage.heroMedia', updatedMedia);
                        }}
                        placeholder="رابط الصورة المصغرة"
                      />
                    </FormControl>
                  )}
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">تفعيل</FormLabel>
                    <Switch
                      isChecked={media.isActive}
                      onChange={(e) => {
                        const updatedMedia = [...localSettings.homePage.heroMedia];
                        updatedMedia[index] = { ...updatedMedia[index], isActive: e.target.checked };
                        handleSettingChange('homePage.heroMedia', updatedMedia);
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>ترتيب العرض</FormLabel>
                    <Input
                      type="number"
                      value={media.order}
                      onChange={(e) => {
                        const updatedMedia = [...localSettings.homePage.heroMedia];
                        updatedMedia[index] = { ...updatedMedia[index], order: Number(e.target.value) };
                        handleSettingChange('homePage.heroMedia', updatedMedia);
                      }}
                    />
                  </FormControl>
                  <Button
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => {
                      const updatedMedia = [...localSettings.homePage.heroMedia];
                      updatedMedia.splice(index, 1);
                      handleSettingChange('homePage.heroMedia', updatedMedia);
                    }}
                  >
                    حذف
                  </Button>
                </SimpleGrid>
              </Box>
            ))
          )}
          <Button
            leftIcon={<Plus />}
            onClick={() => {
              const newMedia = {
                type: 'image',
                url: '',
                isActive: true,
                order: localSettings?.homePage?.heroMedia?.length || 0
              };
              const updatedMedia = [...(localSettings?.homePage?.heroMedia || []), newMedia];
              handleSettingChange('homePage.heroMedia', updatedMedia);
            }}
          >
            إضافة وسائط جديدة
          </Button>
        </VStack>
      </Box>

      <Box>
        <Heading size="md" mb={4}>إعدادات العقارات المميزة</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl>
            <FormLabel>عنوان قسم العقارات المميزة</FormLabel>
            <Input
              value={localSettings?.homePage?.featuredPropertiesTitle || ''}
              onChange={(e) => handleSettingChange('homePage.featuredPropertiesTitle', e.target.value)}
              placeholder="عنوان قسم العقارات المميزة"
            />
          </FormControl>
          <FormControl>
            <FormLabel>وصف قسم العقارات المميزة</FormLabel>
            <Textarea
              value={localSettings?.homePage?.featuredPropertiesDescription || ''}
              onChange={(e) => handleSettingChange('homePage.featuredPropertiesDescription', e.target.value)}
              placeholder="وصف قسم العقارات المميزة"
            />
          </FormControl>
        </SimpleGrid>
      </Box>
    </VStack>
  );
};

export default SettingsTab; 