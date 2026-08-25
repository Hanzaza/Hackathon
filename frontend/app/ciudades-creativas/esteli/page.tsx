import React from 'react';
import CityDetailView, { CityData } from '../../../src/components/city/CityDetailView';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateMetadata() {
  return {
    title: 'Estelí | Ciudad Creativa de Nicaragua',
    description: 'El Diamante de las Segovias: Tabaco Premium, Murales y Música Norteña.',
  };
}

export default async function EsteliPage() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allCities = JSON.parse(fileContents);
  const cityData: CityData = allCities['esteli'];

  const prevCity = {"name":"San Juan de Oriente","slug":"san-juan-de-oriente"};
  const nextCity = {"name":"Matagalpa","slug":"matagalpa"};

  return (
    <CityDetailView
      city={cityData}
      prevCity={prevCity}
      nextCity={nextCity}
    />
  );
}
