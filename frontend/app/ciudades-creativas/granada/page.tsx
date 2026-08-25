import React from 'react';
import CityDetailView, { CityData } from '../../../src/components/city/CityDetailView';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateMetadata() {
  return {
    title: 'Granada | Ciudad Creativa de Nicaragua',
    description: 'La Gran Sultana, joya arquitectónica colonial a orillas del Cocibolca.',
  };
}

export default async function GranadaPage() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allCities = JSON.parse(fileContents);
  const cityData: CityData = allCities['granada'];

  const prevCity = {"name":"León","slug":"leon"};
  const nextCity = {"name":"Masaya","slug":"masaya"};

  return (
    <CityDetailView
      city={cityData}
      prevCity={prevCity}
      nextCity={nextCity}
    />
  );
}
