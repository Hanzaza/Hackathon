-- =========================================================================================
-- CIRCUITO CREATIVO NATURAL XOLOTLÁN - MANAGUA, NICARAGUA
-- =========================================================================================
-- Proyecto: Red Nacional de Ciudades Creativas de Nicaragua (ROOTS)
-- Circuito diseñado para conectar a los visitantes con la biodiversidad y los espacios verdes
-- dentro del entorno urbano de la capital a orillas del Lago Xolotlán.
-- =========================================================================================

-- 1. Insertar el Circuito Creativo Natural Xolotlán de Managua
INSERT INTO public.creative_routes (
  id, municipality_id, name, slug, description, theme, difficulty,
  estimated_duration, points_award, badge_name, badge_icon, route_color, is_visible_in_map, status, cover_image
)
SELECT 
  'da6d078c-2476-4e3f-b4dd-5a87137d2909',
  id,
  'Ruta Natural del Circuito Creativo Xolotlán',
  'ruta-natural-circuito-creativo-xolotlan',
  'Circuito diseñado para conectar a los visitantes con la biodiversidad y los espacios verdes dentro del entorno urbano de Managua a orillas del majestuoso Lago Xolotlán.',
  'Naturaleza & Biodiversidad Urbana',
  'Fácil',
  180,
  300,
  'Guardián del Xolotlán',
  'Trees',
  '#059669',
  true,
  'published',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop'
FROM public.municipalities WHERE slug = 'managua'
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  theme = EXCLUDED.theme,
  route_color = EXCLUDED.route_color,
  is_visible_in_map = EXCLUDED.is_visible_in_map,
  status = EXCLUDED.status;

-- 2. Insertar los 6 lugares destacados que forman parte de esta ruta
INSERT INTO public.route_places (
  municipality_id, route_id, name, slug, description, category, icon_name,
  address, walk_time, points_reward, lat, lng, order_num, is_primary_route_point, status, image_url
)
VALUES
  (
    (SELECT id FROM public.municipalities WHERE slug = 'managua'),
    'da6d078c-2476-4e3f-b4dd-5a87137d2909',
    'Isla del Amor',
    'isla-del-amor-lago-xolotlan',
    'Un destino ecoturístico situado en las aguas del Lago Xolotlán. Espacio único para la desconexión urbana, observación de aves acuáticas y apreciación del paisaje lacustre y volcánico nicaragüense.',
    'Ecoturismo Lacustre',
    'Palmtree',
    'Lago Xolotlán (Embarque desde Puerto Salvador Allende), Managua',
    '25 min en barco',
    60,
    12.1755000,
    -86.2952000,
    1,
    true,
    'active',
    'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&auto=format&fit=crop'
  ),
  (
    (SELECT id FROM public.municipalities WHERE slug = 'managua'),
    'da6d078c-2476-4e3f-b4dd-5a87137d2909',
    'Puerto Salvador Allende, Paseo Xolotlán y Paseo de los Estudiantes',
    'puerto-salvador-allende-paseo-xolotlan',
    'Espacios costeros ideales para el esparcimiento familiar, gastronomía autóctona, réplicas a escala de la vieja Managua y contemplación de atardeceres sobre el majestuoso lago.',
    'Esparcimiento Costero & Gastronomía',
    'Sparkles',
    'Costanera del Lago Xolotlán, Casco Histórico, Managua',
    '10 min a pie',
    50,
    12.1585000,
    -86.2730000,
    2,
    true,
    'active',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop'
  ),
  (
    (SELECT id FROM public.municipalities WHERE slug = 'managua'),
    'da6d078c-2476-4e3f-b4dd-5a87137d2909',
    'Arboretum Nacional Juan Bautista Salas Estrada',
    'arboretum-nacional-juan-bautista-salas',
    'Un área que preserva la riqueza floral de las distintas regiones ecológicas del país, albergando más de 200 especies de flora nativa y senderos botánicos en el corazón de Managua.',
    'Jardín Botánico & Reserva Floral',
    'Trees',
    'Avenida de Bolívar a Chávez, Managua',
    '15 min a pie',
    50,
    12.1480000,
    -86.2738000,
    3,
    true,
    'active',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop'
  ),
  (
    (SELECT id FROM public.municipalities WHERE slug = 'managua'),
    'da6d078c-2476-4e3f-b4dd-5a87137d2909',
    'Parque Histórico Nacional Loma de Tiscapa',
    'loma-de-tiscapa',
    'Un sitio histórico que alberga la famosa laguna de origen volcánico en pleno corazón geográfico de Managua, con una vista panorámica privilegiada de la capital y el lago.',
    'Mirador Histórico & Laguna Crastérica',
    'Landmark',
    'Reserva Natural Laguna de Tiscapa, Managua',
    '15 min a pie',
    50,
    12.1378000,
    -86.2715000,
    4,
    true,
    'active',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop'
  ),
  (
    (SELECT id FROM public.municipalities WHERE slug = 'managua'),
    'da6d078c-2476-4e3f-b4dd-5a87137d2909',
    'Lagunas de Asososca y Nejapa',
    'lagunas-de-asososca-y-nejapa',
    'Espacios naturales de gran majestuosidad, cráteres volcánicos de agua dulce rodeados de exuberante vegetación y reconocidos por su alto valor paisajístico y ecológico.',
    'Reserva Natural Lacustre',
    'Compass',
    'Carretera Sur - Carretera Vieja a León, Managua',
    '15 min en vehículo',
    60,
    12.1365000,
    -86.3150000,
    5,
    true,
    'active',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop'
  ),
  (
    (SELECT id FROM public.municipalities WHERE slug = 'managua'),
    'da6d078c-2476-4e3f-b4dd-5a87137d2909',
    'Parque Natural Divina Misericordia',
    'parque-divina-misericordia',
    'Un lugar enfocado en el descanso y la paz espiritual, con hermosas áreas verdes, senderos arbolados y una fuente de agua artificial pensada para el bienestar integral de la ciudadanía.',
    'Parque Natural & Paz Espiritual',
    'Heart',
    'Villa Fontana, Costado Sur de la UNAN-Managua, Managua',
    '20 min en vehículo',
    50,
    12.1090000,
    -86.2625000,
    6,
    true,
    'active',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  image_url = EXCLUDED.image_url;

-- 3. Vincular Logro / Insignia de la Ruta
INSERT INTO public.achievements (
  id, name, slug, description, achievement_type, icon, points_reward, required_count, route_id
)
VALUES (
  'ecefa938-9944-423c-bb3a-68c1a279dfee',
  'Guardián del Xolotlán',
  'guardian-del-xolotlan',
  'Completa la Ruta Natural del Circuito Creativo Xolotlán en Managua dejando tu reseña y fotografía en sus hitos ecológicos.',
  'ruta',
  '🌿',
  300,
  1,
  'da6d078c-2476-4e3f-b4dd-5a87137d2909'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  route_id = EXCLUDED.route_id;
