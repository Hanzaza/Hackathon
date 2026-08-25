import React from 'react';
import CityDetailView, { CityData } from '../../../src/components/city/CityDetailView';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateMetadata() {
  return {
    title: 'San Juan de Oriente | Ciudad Creativa de Nicaragua',
    description: 'Pueblo de Alfareros y Maestros de la Cerámica Precolombina.',
  };
}

export default async function SanJuanDeOrientePage() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allCities = JSON.parse(fileContents);
  const cityData: CityData = allCities['san-juan-de-oriente'];

  const prevCity = {"name":"Masaya","slug":"masaya"};
  const nextCity = {"name":"Estelí","slug":"esteli"};

  return (
    <CityDetailView
      city={cityData}
      prevCity={prevCity}
      nextCity={nextCity}
    />
  );
}
