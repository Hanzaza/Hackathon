import React from 'react';
import CityDetailView, { CityData } from '../../../src/components/city/CityDetailView';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateMetadata() {
  return {
    title: 'León | Ciudad Creativa de Nicaragua',
    description: 'Corazón intelectual, arte mural y cuna de Rubén Darío.',
  };
}

export default async function LeonPage() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allCities = JSON.parse(fileContents);
  const cityData: CityData = allCities['leon'];

  const prevCity = undefined;
  const nextCity = {"name":"Granada","slug":"granada"};

  return (
    <CityDetailView
      city={cityData}
      prevCity={prevCity}
      nextCity={nextCity}
    />
  );
}
