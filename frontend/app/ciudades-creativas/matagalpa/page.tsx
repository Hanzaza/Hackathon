import React from 'react';
import CityDetailView, { CityData } from '../../../src/components/city/CityDetailView';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateMetadata() {
  return {
    title: 'Matagalpa | Ciudad Creativa de Nicaragua',
    description: 'Tierra del Café Gourmet, Montañas Nubosas y Mazurcas Campesinas.',
  };
}

export default async function MatagalpaPage() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allCities = JSON.parse(fileContents);
  const cityData: CityData = allCities['matagalpa'];

  const prevCity = {"name":"Estelí","slug":"esteli"};
  const nextCity = {"name":"Bluefields","slug":"bluefields"};

  return (
    <CityDetailView
      city={cityData}
      prevCity={prevCity}
      nextCity={nextCity}
    />
  );
}
