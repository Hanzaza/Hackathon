import React from 'react';
import CityDetailView, { CityData } from '../../../src/components/city/CityDetailView';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateMetadata() {
  return {
    title: 'Juigalpa | Ciudad Creativa de Nicaragua',
    description: 'Tierra de Gigantes Amerindios, Cultura Taurina y Sabanas Chontaleñas.',
  };
}

export default async function JuigalpaPage() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allCities = JSON.parse(fileContents);
  const cityData: CityData = allCities['juigalpa'];

  const prevCity = {"name":"Bluefields","slug":"bluefields"};
  const nextCity = {"name":"Nagarote","slug":"nagarote"};

  return (
    <CityDetailView
      city={cityData}
      prevCity={prevCity}
      nextCity={nextCity}
    />
  );
}
