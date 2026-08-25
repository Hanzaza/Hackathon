import React from 'react';
import CityDetailView, { CityData } from '../../../src/components/city/CityDetailView';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateMetadata() {
  return {
    title: 'Nagarote | Ciudad Creativa de Nicaragua',
    description: 'Municipio Azul: Cuna del Quesillo Tradicional y Playas del Pacífico.',
  };
}

export default async function NagarotePage() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allCities = JSON.parse(fileContents);
  const cityData: CityData = allCities['nagarote'];

  const prevCity = {"name":"Juigalpa","slug":"juigalpa"};
  const nextCity = {"name":"Managua","slug":"managua"};

  return (
    <CityDetailView
      city={cityData}
      prevCity={prevCity}
      nextCity={nextCity}
    />
  );
}
