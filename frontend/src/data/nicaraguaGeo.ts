// Estructura Geográfica Completa de Nicaragua: 15 Departamentos y 2 Regiones Autónomas (153 Municipios)

export interface NicaraguaDepartment {
  id: string;
  name: string;
  is_autonomous_region?: boolean;
  municipalities: string[];
}

export const NICARAGUA_GEO_DATA: NicaraguaDepartment[] = [
  {
    id: 'leon',
    name: 'León',
    municipalities: [
      'León',
      'Nagarote',
      'La Paz Centro',
      'El Sauce',
      'Achuapa',
      'Santa Rosa del Peñón',
      'El Jicaral',
      'Larreynaga (Malpaisillo)',
      'Telica',
      'Quezalguaque',
    ],
  },
  {
    id: 'managua',
    name: 'Managua',
    municipalities: [
      'Managua',
      'Ciudad Sandino',
      'El Crucero',
      'Mateare',
      'San Francisco Libre',
      'San Rafael del Sur',
      'Ticuantepe',
      'Tipitapa',
      'Villa El Carmen',
    ],
  },
  {
    id: 'masaya',
    name: 'Masaya',
    municipalities: [
      'Masaya',
      'Catarina',
      'Nindirí',
      'Niquinohomo',
      'San Juan de Oriente',
      'Tisma',
      'La Concepción',
      'Masatepe',
      'Nandasmo',
    ],
  },
  {
    id: 'granada',
    name: 'Granada',
    municipalities: [
      'Granada',
      'Diriá',
      'Diriomo',
      'Nandaime',
    ],
  },
  {
    id: 'esteli',
    name: 'Estelí',
    municipalities: [
      'Estelí',
      'Condega',
      'Pueblo Nuevo',
      'San Juan de Limay',
      'San Nicolás',
      'La Trinidad',
    ],
  },
  {
    id: 'matagalpa',
    name: 'Matagalpa',
    municipalities: [
      'Matagalpa',
      'Ciudad Darío',
      'Esquipulas',
      'Matiguás',
      'Muy Muy',
      'Rancho Grande',
      'Río Blanco',
      'San Dionisio',
      'San Isidro',
      'San Ramón',
      'Sébaco',
      'Terrabona',
      'El Tuma - La Dalia',
    ],
  },
  {
    id: 'chinandega',
    name: 'Chinandega',
    municipalities: [
      'Chinandega',
      'Corinto',
      'Chichigalpa',
      'Posoltega',
      'El Realejo',
      'El Viejo',
      'Puerto Morazán',
      'Somotillo',
      'Santo Tomás del Norte',
      'Cinco Pinos',
      'San Pedro del Norte',
      'San Francisco del Norte',
    ],
  },
  {
    id: 'carazo',
    name: 'Carazo',
    municipalities: [
      'Jinotepe',
      'Diriamba',
      'San Marcos',
      'Dolores',
      'El Rosario',
      'La Conquista',
      'La Paz de Carazo',
      'Santa Teresa',
    ],
  },
  {
    id: 'rivas',
    name: 'Rivas',
    municipalities: [
      'Rivas',
      'Altagracia (Ometepe)',
      'Moyogalpa (Ometepe)',
      'Belén',
      'Buenos Aires',
      'Cárdenas',
      'Potosí',
      'San Jorge',
      'San Juan del Sur',
      'Tola',
    ],
  },
  {
    id: 'chontales',
    name: 'Chontales',
    municipalities: [
      'Juigalpa',
      'Acoyapa',
      'Comalapa',
      'El Coral',
      'La Libertad',
      'San Francisco de Cuapa',
      'San Pedro de Lóvago',
      'Santo Domingo',
      'Santo Tomás',
      'Villa Sandino',
    ],
  },
  {
    id: 'boaco',
    name: 'Boaco',
    municipalities: [
      'Boaco',
      'Camoapa',
      'San José de los Remates',
      'San Lorenzo',
      'Santa Lucía',
      'Teustepe',
    ],
  },
  {
    id: 'jinotega',
    name: 'Jinotega',
    municipalities: [
      'Jinotega',
      'San Rafael del Norte',
      'San Sebastián de Yalí',
      'La Concordia',
      'San José de Bocay',
      'El Cuá',
      'Santa María de Pantasma',
      'Wiwilí de Jinotega',
    ],
  },
  {
    id: 'madriz',
    name: 'Madriz',
    municipalities: [
      'Somoto',
      'Palacagüina',
      'San Lucas',
      'Las Sabanas',
      'San José de Cusmapa',
      'Totogalpa',
      'Telpaneca',
      'San Juan de Río Coco',
      'Yalagüina',
    ],
  },
  {
    id: 'nueva-segovia',
    name: 'Nueva Segovia',
    municipalities: [
      'Ocotal',
      'Jalapa',
      'Jícaro',
      'Murra',
      'Quilalí',
      'San Fernando',
      'Santa María',
      'Wiwilí de Nueva Segovia',
      'Dipilto',
      'Ciudad Antigua',
      'Mozonte',
      'Macuelizo',
    ],
  },
  {
    id: 'rio-san-juan',
    name: 'Río San Juan',
    municipalities: [
      'San Carlos',
      'El Almendro',
      'El Castillo',
      'Morrito',
      'San Juan de Nicaragua',
      'San Miguelito',
    ],
  },
  {
    id: 'costa-caribe-sur',
    name: 'Costa Caribe Sur (RACCS)',
    is_autonomous_region: true,
    municipalities: [
      'Bluefields',
      'Corn Island',
      'El Rama',
      'El Tortuguero',
      'Kukra Hill',
      'La Cruz de Río Grande',
      'Laguna de Perlas',
      'Muelle de los Bueyes',
      'Nueva Guinea',
      'Bocana de Paiwas',
      'Desembocadura de Río Grande',
    ],
  },
  {
    id: 'costa-caribe-norte',
    name: 'Costa Caribe Norte (RACCN)',
    is_autonomous_region: true,
    municipalities: [
      'Puerto Cabezas (Bilwi)',
      'Waspam',
      'Prinzapolka',
      'Rosita',
      'Bonanza',
      'Siuna',
      'Mulukukú',
      'Waslala',
    ],
  },
];

// Helper: Lista de todos los departamentos
export const NICARAGUA_DEPARTMENTS = NICARAGUA_GEO_DATA.map((d) => d.name);

// Helper: Obtener municipios por departamento
export function getMunicipalitiesByDepartment(departmentName: string): string[] {
  const dept = NICARAGUA_GEO_DATA.find(
    (d) => d.name.toLowerCase() === departmentName.toLowerCase() || d.id === departmentName.toLowerCase()
  );
  return dept ? dept.municipalities : ['León'];
}

// Helper: Encontrar departamento a partir de un municipio
export function getDepartmentByMunicipality(municipalityName: string): string {
  for (const dept of NICARAGUA_GEO_DATA) {
    if (dept.municipalities.some((m) => m.toLowerCase() === municipalityName.toLowerCase())) {
      return dept.name;
    }
  }
  return 'León';
}
