import React from 'react';
import CityDetailView, { CityData } from '../../../src/components/city/CityDetailView';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateMetadata() {
  return {
    title: 'Managua | Ciudad Creativa de Nicaragua',
    description: 'Capital Creativa: Paisajismo Lacustre, Museos y Vanguardia Cultural.',
  };
}

export default async function ManaguaPage() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allCities = JSON.parse(fileContents);
  const cityData: CityData = allCities['managua'];

  const prevCity = {"name":"Nagarote","slug":"nagarote"};
  const nextCity = undefined;

  return (
    <CityDetailView
      city={cityData}
      prevCity={prevCity}
      nextCity={nextCity}
    />
  );
}
