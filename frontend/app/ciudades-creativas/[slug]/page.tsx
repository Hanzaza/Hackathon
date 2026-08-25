import React from 'react';
import { notFound } from 'next/navigation';
import path from 'path';
import { promises as fs } from 'fs';
import CityDetailView, { CityData } from '../../../src/components/city/CityDetailView';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allCities = JSON.parse(fileContents);
  
  return Object.keys(allCities).map(slug => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allCities = JSON.parse(fileContents);
  const city = allCities[slug];

  if (!city) return { title: 'Ciudad Creativa | Nicaragua' };

  return {
    title: city.name + ' | Ciudad Creativa de Nicaragua',
    description: city.subtitle,
  };
}

export default async function CreativeCityDynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'public', 'data', 'city-content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allCities = JSON.parse(fileContents);
  const cityData: CityData = allCities[slug];

  if (!cityData) {
    notFound();
  }

  const cityKeys = Object.keys(allCities);
  const currentIndex = cityKeys.indexOf(slug);
  const prevKey = currentIndex > 0 ? cityKeys[currentIndex - 1] : undefined;
  const nextKey = currentIndex < cityKeys.length - 1 ? cityKeys[currentIndex + 1] : undefined;

  const prevCity = prevKey ? { name: allCities[prevKey].name, slug: prevKey } : undefined;
  const nextCity = nextKey ? { name: allCities[nextKey].name, slug: nextKey } : undefined;

  return (
    <CityDetailView
      city={cityData}
      prevCity={prevCity}
      nextCity={nextCity}
    />
  );
}
