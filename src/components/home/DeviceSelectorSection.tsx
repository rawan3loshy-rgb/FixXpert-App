'use client';

import React, { useState } from 'react';
import { t } from '@/lib/text';

type DeviceCategory = 'phone' | 'tablet' | 'laptop' | 'other';

const deviceData: Record<DeviceCategory, { brands: string[]; models: Record<string, string[]> }> = {
  phone: {
    brands: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Huawei', 'Sony'],
    models: {
      Apple: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 11 Pro', 'iPhone 11', 'iPhone SE (3rd Gen)'],
      Samsung: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy A54', 'Galaxy A34'],
      Google: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a', 'Pixel 6 Pro', 'Pixel 6'],
      OnePlus: ['OnePlus 12', 'OnePlus 11', 'OnePlus 10 Pro', 'OnePlus Nord 3', 'OnePlus Nord CE 3'],
      Huawei: ['P60 Pro', 'Mate 60 Pro', 'Nova 11 Pro', 'P50 Pro'],
      Sony: ['Xperia 1 V', 'Xperia 5 V', 'Xperia 10 V'],
    },
  },
  tablet: {
    brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Huawei'],
    models: {
      Apple: ['iPad Pro 12.9" (6th Gen)', 'iPad Pro 11" (4th Gen)', 'iPad Air (5th Gen)', 'iPad (10th Gen)', 'iPad mini (6th Gen)'],
      Samsung: ['Galaxy Tab S9 Ultra', 'Galaxy Tab S9+', 'Galaxy Tab S9', 'Galaxy Tab A9+'],
      Microsoft: ['Surface Pro 9', 'Surface Pro 8', 'Surface Go 3'],
      Lenovo: ['Tab P12 Pro', 'Tab P11 Pro', 'Tab M10 Plus'],
      Huawei: ['MatePad Pro 11', 'MatePad 11', 'MatePad SE'],
    },
  },
  laptop: {
    brands: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Microsoft'],
    models: {
      Apple: ['MacBook Pro 16" (M3 Max)', 'MacBook Pro 14" (M3 Pro)', 'MacBook Air 15" (M3)', 'MacBook Air 13" (M3)', 'MacBook Pro 13" (M2)'],
      Dell: ['XPS 15 (9530)', 'XPS 13 (9340)', 'Inspiron 15', 'Latitude 14', 'Precision 5570'],
      HP: ['Spectre x360 14', 'EliteBook 840 G10', 'Envy 13', 'Pavilion 15', 'ZBook Fury 16'],
      Lenovo: ['ThinkPad X1 Carbon', 'ThinkPad T14s', 'Yoga 9i', 'IdeaPad 5 Pro', 'Legion 5 Pro'],
      ASUS: ['ZenBook Pro Duo', 'ROG Zephyrus G14', 'VivoBook 15', 'ProArt StudioBook'],
      Microsoft: ['Surface Laptop 5', 'Surface Laptop Studio 2', 'Surface Pro 9'],
    },
  },
  other: {
    brands: ['Apple', 'Sony', 'Nintendo', 'Various'],
    models: {
      Apple: ['Apple Watch Ultra 2', 'Apple Watch Series 9', 'AirPods Pro', 'AirPods Max'],
      Sony: ['PlayStation 5', 'PlayStation 4', 'WH-1000XM5'],
      Nintendo: ['Nintendo Switch OLED', 'Nintendo Switch'],
      Various: ['Smart TV', 'E-Reader', 'Smartwatch', 'Other Device'],
    },
  },
};

const categoryIcons: Record<DeviceCategory, React.ReactNode> = {
  phone: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <circle cx="12" cy="17" r="1" />
    </svg>
  ),
  tablet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="18" r="0.5" fill="currentColor" />
    </svg>
  ),
  laptop: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="13" rx="1" />
      <path d="M1 21h22" />
      <path d="M9 21l1.5-4h3L15 21" />
    </svg>
  ),
  other: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l3 3" />
    </svg>
  ),
};

export default function DeviceSelectorSection() {

  const [activeCategory, setActiveCategory] = useState<DeviceCategory>('phone');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: DeviceCategory[] = ['phone', 'tablet', 'laptop', 'other'];
  const categoryKeys: Record<DeviceCategory, string> = {
    phone: 'devices_phone',
    tablet: 'devices_tablet',
    laptop: 'devices_laptop',
    other: 'devices_other',
  };

  const brands = deviceData[activeCategory].brands;
  const models = selectedBrand ? deviceData[activeCategory].models[selectedBrand] || [] : [];
  const filteredModels = searchQuery
    ? models.filter(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
    : models;

  const handleCategoryChange = (cat: DeviceCategory) => {
    setActiveCategory(cat);
    setSelectedBrand('');
    setSelectedModel('');
    setSearchQuery('');
  };

  return (
    <section id="devices" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0A0B0F 0%, #0D1525 50%, #0A0B0F 100%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent font-mono mb-4 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5">
            {t('devices_title')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-3">
            {t('devices_title')}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">{t('devices_sub')}</p>
        </div>

        {/* Main Selector Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:p-10">
          {/* Category Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
                  activeCategory === cat
                    ? 'border-primary bg-primary/10 text-primary shadow-lg'
                    : 'border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground'
                }`}
                style={activeCategory === cat ? { boxShadow: '0 0 20px rgba(37,99,235,0.2)' } : {}}
              >
                <span className={activeCategory === cat ? 'text-primary' : 'text-muted-foreground'}>
                  {categoryIcons[cat]}
                </span>
                <span className="text-sm font-semibold">{t(categoryKeys[cat])}</span>
              </button>
            ))}
          </div>

          {/* Brand Selection */}
          <div className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono mb-3 block">
              {t('devices_brand_label')}
            </label>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setSelectedModel('');
                    setSearchQuery('');
                  }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    selectedBrand === brand
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-primary/5'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          {selectedBrand && (
            <div className="mb-8">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono mb-3 block">
                {t('devices_model_label')}
              </label>
              {/* Search */}
              <div className="relative mb-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder={`${t('searchModels')} ${selectedBrand}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:bg-primary/5 transition-all"
                />
              </div>
              {/* Model list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                {filteredModels.map((model) => (
                  <button
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={`text-left px-4 py-3 rounded-xl text-sm border transition-all duration-200 ${
                      selectedModel === model
                        ? 'border-primary bg-primary/10 text-primary font-semibold' :'border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            disabled={!selectedBrand || !selectedModel}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all duration-300 ${
              selectedBrand && selectedModel
                ? 'bg-primary text-primary-foreground hover:scale-[1.02] cursor-pointer'
                : 'bg-muted/40 text-muted-foreground cursor-not-allowed'
            }`}
            style={selectedBrand && selectedModel ? { boxShadow: '0 0 30px rgba(37,99,235,0.3)' } : {}}
          >
            {selectedModel
              ? `${t('devices_cta')} → ${selectedModel}`
              : t('devices_cta')}
            {selectedBrand && selectedModel && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}