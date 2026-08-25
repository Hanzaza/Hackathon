import React from 'react';
import CityDetailView, { CityData } from '../../../src/components/city/CityDetailView';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateMetadata() {
  return {
    title: 'Masaya | Ciudad Creativa de Nicaragua',
    description: 'Cuna del Folklore Nacional y Corazón de la Artesanía Popular.',
  };
}

export default async function MasayaPage() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allCities = JSON.parse(fileContents);
  const cityData: CityData = allCities['masaya'];

  const prevCity = {"name":"Granada","slug":"granada"};
  const nextCity = {"name":"San Juan de Oriente","slug":"san-juan-de-oriente"};

  return (
    <CityDetailView
      city={cityData}
      prevCity={prevCity}
      nextCity={nextCity}
    />
  );
}
