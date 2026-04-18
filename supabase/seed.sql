-- ============================================================
-- InmoDesk – Seed con UUIDs
-- ============================================================

-- 1. Inmobiliaria demo
insert into inmobiliarias (id, nombre, email, plan) values
  ('11111111-1111-1111-1111-111111111111', 'Demo Inmobiliaria', 'demo@inmodesk.com', 'basico')
on conflict (id) do nothing;

-- Vincular tu usuario auth (reemplazá el UUID con el tuyo de Authentication → Users):
-- insert into usuarios (id, inmobiliaria_id, nombre, email)
-- values ('<tu-auth-user-id>', '11111111-1111-1111-1111-111111111111', 'Admin', 'tu@email.com')
-- on conflict (id) do nothing;

-- 2. Propietarios
insert into propietarios (id, nombre, telefono, email, inmobiliaria_id) values
  ('aaaaaaaa-0001-0000-0000-000000000000', 'Roberto Álvarez',  '+54 11 4444-1111', 'roberto.alvarez@email.com',  '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-0002-0000-0000-000000000000', 'Patricia Moreno',  '+54 11 4444-2222', 'patricia.moreno@email.com',  '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-0003-0000-0000-000000000000', 'Jorge Gutiérrez',  '+54 11 4444-3333', 'jorge.gutierrez@email.com',  '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-0004-0000-0000-000000000000', 'Silvia Domínguez', '+54 11 4444-4444', 'silvia.dominguez@email.com', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-0005-0000-0000-000000000000', 'Eduardo Sánchez',  '+54 11 4444-5555', 'eduardo.sanchez@email.com',  '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-0006-0000-0000-000000000000', 'Graciela Peralta', '+54 11 4444-6666', 'graciela.peralta@email.com', '11111111-1111-1111-1111-111111111111')
on conflict (id) do nothing;

-- 3. Inquilinos
insert into inquilinos (id, nombre, telefono, email, dni, inmobiliaria_id) values
  ('bbbbbbbb-0001-0000-0000-000000000000', 'María González',   '+54 11 5555-1234', 'maria.gonzalez@email.com',   '28.456.789', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-0002-0000-0000-000000000000', 'Carlos Rodríguez', '+54 11 5555-2345', 'carlos.rodriguez@email.com', '32.123.456', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-0003-0000-0000-000000000000', 'Ana Martínez',     '+54 11 5555-3456', 'ana.martinez@email.com',     '35.789.012', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-0004-0000-0000-000000000000', 'Luis Fernández',   '+54 11 5555-4567', 'luis.fernandez@email.com',   '30.234.567', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-0005-0000-0000-000000000000', 'Valentina López',  '+54 11 5555-5678', 'valentina.lopez@email.com',  '33.567.890', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-0006-0000-0000-000000000000', 'Diego Ramírez',    '+54 11 5555-6789', 'diego.ramirez@email.com',    '29.876.543', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-0007-0000-0000-000000000000', 'Sofía Castro',     '+54 11 5555-7890', 'sofia.castro@email.com',     '34.321.654', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-0008-0000-0000-000000000000', 'Martín Herrera',   '+54 11 5555-8901', 'martin.herrera@email.com',   '31.654.987', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-0009-0000-0000-000000000000', 'Camila Ruiz',      '+54 11 5555-9012', 'camila.ruiz@email.com',      '36.987.321', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-0010-0000-0000-000000000000', 'Facundo Torres',   '+54 11 5555-0123', 'facundo.torres@email.com',   '27.111.222', '11111111-1111-1111-1111-111111111111')
on conflict (id) do nothing;

-- 4. Propiedades
insert into propiedades (id, direccion, unidad, tipo, barrio, ciudad, propietario_id, inquilino_id, ambientes, metros, alquiler_mensual, estado_contrato, fecha_inicio_contrato, fecha_fin_contrato, inmobiliaria_id) values
  ('cccccccc-0001-0000-0000-000000000000', 'Av. Santa Fe 2100',   '4B',   'Departamento', 'Recoleta',  'CABA', 'aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0001-0000-0000-000000000000', 3, 75, 350000, 'Vigente', '2024-06-01', '2026-06-01', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-0002-0000-0000-000000000000', 'Thames 1800',         'PB A', 'PH',           'Palermo',   'CABA', 'aaaaaaaa-0001-0000-0000-000000000000', 'bbbbbbbb-0002-0000-0000-000000000000', 2, 55, 280000, 'Vigente', '2024-09-01', '2026-09-01', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-0003-0000-0000-000000000000', 'Av. Rivadavia 6800',  '8B',   'Departamento', 'Flores',    'CABA', 'aaaaaaaa-0002-0000-0000-000000000000', 'bbbbbbbb-0003-0000-0000-000000000000', 2, 48, 220000, 'Vigente', '2025-01-01', '2027-01-01', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-0004-0000-0000-000000000000', 'Defensa 900',         '2A',   'Departamento', 'San Telmo', 'CABA', 'aaaaaaaa-0002-0000-0000-000000000000', 'bbbbbbbb-0004-0000-0000-000000000000', 1, 38, 180000, 'Vigente', '2024-11-01', '2026-11-01', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-0005-0000-0000-000000000000', 'Av. Cabildo 1200',    '3C',   'Departamento', 'Belgrano',  'CABA', 'aaaaaaaa-0003-0000-0000-000000000000', 'bbbbbbbb-0005-0000-0000-000000000000', 4, 95, 450000, 'Vigente', '2024-03-01', '2026-03-01', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-0006-0000-0000-000000000000', 'Av. Corrientes 3200', '6C',   'Departamento', 'Almagro',   'CABA', 'aaaaaaaa-0004-0000-0000-000000000000', 'bbbbbbbb-0006-0000-0000-000000000000', 2, 52, 240000, 'Vigente', '2025-02-01', '2027-02-01', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-0007-0000-0000-000000000000', 'Av. Las Heras 3500',  '10A',  'Departamento', 'Palermo',   'CABA', 'aaaaaaaa-0004-0000-0000-000000000000', 'bbbbbbbb-0007-0000-0000-000000000000', 3, 80, 400000, 'Vigente', '2024-07-01', '2026-07-01', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-0008-0000-0000-000000000000', 'Av. Pueyrredón 1500', '4D',   'Departamento', 'Recoleta',  'CABA', 'aaaaaaaa-0005-0000-0000-000000000000', 'bbbbbbbb-0008-0000-0000-000000000000', 2, 60, 300000, 'Vigente', '2024-08-01', '2026-08-01', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-0009-0000-0000-000000000000', 'Bolívar 500',         '5D',   'Departamento', 'San Telmo', 'CABA', 'aaaaaaaa-0006-0000-0000-000000000000', 'bbbbbbbb-0009-0000-0000-000000000000', 1, 35, 170000, 'Vigente', '2025-03-01', '2027-03-01', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-0010-0000-0000-000000000000', 'Paraguay 4100',       '2B',   'Departamento', 'Palermo',   'CABA', 'aaaaaaaa-0006-0000-0000-000000000000', 'bbbbbbbb-0010-0000-0000-000000000000', 3, 70, 380000, 'Vigente', '2024-12-01', '2026-12-01', '11111111-1111-1111-1111-111111111111')
on conflict (id) do nothing;

-- 5. Proveedores
insert into proveedores (id, nombre, rubro, zona, telefono, email, estado, tiempo_promedio_respuesta, rating, total_trabajos, historial, inmobiliaria_id) values
  ('dddddddd-0001-0000-0000-000000000000', 'Juan Pérez - Plomería Express',      'Plomería',          'Palermo, Recoleta, Belgrano', '+54 11 3333-1111', 'plomeria.express@email.com',       'Activo',     '2 horas',  4.8, 47, '[{"fecha":"2025-03-28","trabajo":"Reparación caño cocina","propiedad":"Av. Santa Fe 2100, 4B","resultado":"Completado"}]', '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-0002-0000-0000-000000000000', 'Electricidad Ramos',                 'Electricidad',      'CABA Norte',                 '+54 11 3333-2222', 'electricidad.ramos@email.com',     'Activo',     '3 horas',  4.6, 35, '[{"fecha":"2025-03-25","trabajo":"Reparación tablero eléctrico","propiedad":"Av. Cabildo 1200, 3C","resultado":"Completado"}]', '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-0003-0000-0000-000000000000', 'Gas del Sur - Matriculado',          'Gas',               'CABA Sur, Avellaneda',       '+54 11 3333-3333', 'gasdelsur@email.com',              'Activo',     '4 horas',  4.9, 28, '[{"fecha":"2025-03-20","trabajo":"Revisión termotanque","propiedad":"Defensa 900, 2A","resultado":"Completado"}]', '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-0004-0000-0000-000000000000', 'Cerrajería 24hs - Martínez',         'Cerrajería',        'CABA, GBA Norte',            '+54 11 3333-4444', 'cerrajeria.martinez@email.com',    'Activo',     '1 hora',   4.5, 62, '[{"fecha":"2025-03-22","trabajo":"Cambio cerradura","propiedad":"Av. Rivadavia 6800, 8B","resultado":"Completado"}]', '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-0005-0000-0000-000000000000', 'Construcciones Belgrano SRL',        'Albañilería',       'CABA, GBA',                  '+54 11 3333-5555', 'construcciones.belgrano@email.com','Activo',     '24 horas', 4.3, 19, '[{"fecha":"2025-03-01","trabajo":"Reparación humedad pared","propiedad":"Av. Corrientes 3200, 6C","resultado":"En curso"}]', '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-0006-0000-0000-000000000000', 'Clima Total - Aire Acondicionado',   'Aire acondicionado','CABA',                       '+54 11 3333-6666', 'climatotal@email.com',             'Activo',     '6 horas',  4.7, 41, '[{"fecha":"2025-03-18","trabajo":"Service split frío/calor","propiedad":"Av. Las Heras 3500, 10A","resultado":"Completado"}]', '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-0007-0000-0000-000000000000', 'Pinturas & Deco López',              'Pintura',           'CABA, Zona Norte GBA',       '+54 11 3333-7777', 'pinturaslopez@email.com',          'Disponible', '48 horas', 4.4, 23, '[{"fecha":"2025-02-10","trabajo":"Pintura departamento completo","propiedad":"Av. Santa Fe 2100, 4B","resultado":"Completado"}]', '11111111-1111-1111-1111-111111111111'),
  ('dddddddd-0008-0000-0000-000000000000', 'MultiService Hogar',                 'General',           'CABA',                       '+54 11 3333-8888', 'multiservice@email.com',           'Activo',     '5 horas',  4.2, 55, '[{"fecha":"2025-03-27","trabajo":"Reparación persiana","propiedad":"Av. Pueyrredón 1500, 4D","resultado":"Completado"}]', '11111111-1111-1111-1111-111111111111')
on conflict (id) do nothing;

-- 6. Incidencias
insert into incidencias (id, propiedad_id, inquilino_id, propietario_id, proveedor_id, rubro, urgencia, estado, titulo, descripcion, fecha_creacion, fecha_actualizacion, presupuesto_estimado, costo_final, notas, evidencias, timeline, inmobiliaria_id) values

('eeeeeeee-0001-0000-0000-000000000000','cccccccc-0001-0000-0000-000000000000','bbbbbbbb-0001-0000-0000-000000000000','aaaaaaaa-0001-0000-0000-000000000000','dddddddd-0001-0000-0000-000000000000',
'Plomería','Alta','En curso','Pérdida de agua en cocina','Se detectó una pérdida de agua debajo de la pileta de la cocina. El caño del desagüe presenta una fisura visible y gotea constantemente.',
'2025-04-10T09:30:00','2025-04-12T14:00:00',45000,null,'El inquilino reportó que el problema empeoró después de usar el lavavajillas.',
'["foto_canio_roto.jpg","foto_goteo.jpg"]',
'[{"fecha":"2025-04-10T09:30:00","evento":"Reclamo recibido","descripcion":"María González reportó pérdida de agua en cocina vía WhatsApp.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-04-10T11:20:00","evento":"Aprobación del propietario","descripcion":"Roberto Álvarez aprobó. Presupuesto: $45.000.","actor":"Propietario","tipo":"aprobacion"},{"fecha":"2025-04-12T09:45:00","evento":"Trabajo en curso","descripcion":"El plomero llegó y comenzó la reparación.","actor":"Proveedor","tipo":"trabajo"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0002-0000-0000-000000000000','cccccccc-0002-0000-0000-000000000000','bbbbbbbb-0002-0000-0000-000000000000','aaaaaaaa-0001-0000-0000-000000000000',null,
'Electricidad','Media','Pendiente de aprobación','Corte eléctrico parcial en dormitorio','Las luces y tomacorrientes del dormitorio principal dejaron de funcionar. Posible problema en la llave térmica.',
'2025-04-12T16:45:00','2025-04-12T17:00:00',25000,null,'',
'["foto_termica.jpg"]',
'[{"fecha":"2025-04-12T16:45:00","evento":"Reclamo recibido","descripcion":"Carlos Rodríguez reportó corte eléctrico parcial.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-04-12T17:00:00","evento":"Solicitud de aprobación","descripcion":"Se envió solicitud a Roberto Álvarez.","actor":"Sistema","tipo":"aprobacion"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0003-0000-0000-000000000000','cccccccc-0003-0000-0000-000000000000','bbbbbbbb-0003-0000-0000-000000000000','aaaaaaaa-0002-0000-0000-000000000000','dddddddd-0004-0000-0000-000000000000',
'Cerrajería','Crítica','Asignada','Cerradura rota - no puede cerrar puerta','La cerradura de la puerta principal del departamento se trabó y no permite cerrar.',
'2025-04-13T07:15:00','2025-04-13T08:30:00',35000,null,'Urgente: la inquilina no puede dejar la puerta abierta.',
'["foto_cerradura.jpg"]',
'[{"fecha":"2025-04-13T07:15:00","evento":"Reclamo recibido","descripcion":"Ana Martínez reportó cerradura rota.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-04-13T07:20:00","evento":"Aprobación automática","descripcion":"Por urgencia crítica, se aprobó automáticamente.","actor":"Sistema","tipo":"aprobacion"},{"fecha":"2025-04-13T07:25:00","evento":"Proveedor asignado","descripcion":"Se asignó a Cerrajería 24hs - Martínez.","actor":"Sistema","tipo":"asignacion"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0004-0000-0000-000000000000','cccccccc-0004-0000-0000-000000000000','bbbbbbbb-0004-0000-0000-000000000000','aaaaaaaa-0002-0000-0000-000000000000','dddddddd-0003-0000-0000-000000000000',
'Gas','Alta','Aprobada','Termotanque no enciende','El termotanque a gas no enciende desde ayer. No hay agua caliente en el departamento.',
'2025-04-11T19:00:00','2025-04-12T10:15:00',55000,null,'Verificar si es necesario cambiar la válvula termocupla.',
'["foto_termotanque.jpg"]',
'[{"fecha":"2025-04-11T19:00:00","evento":"Reclamo recibido","descripcion":"Luis Fernández reportó que el termotanque no enciende.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-04-12T10:15:00","evento":"Aprobación del propietario","descripcion":"Patricia Moreno aprobó. Presupuesto: $55.000.","actor":"Propietario","tipo":"aprobacion"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0005-0000-0000-000000000000','cccccccc-0005-0000-0000-000000000000','bbbbbbbb-0005-0000-0000-000000000000','aaaaaaaa-0003-0000-0000-000000000000','dddddddd-0001-0000-0000-000000000000',
'Plomería','Baja','Resuelta','Canilla del baño gotea','La canilla del lavatorio del baño gotea levemente cuando está cerrada.',
'2025-04-01T10:00:00','2025-04-05T16:30:00',15000,12000,'Se cambió el cuerito. Trabajo simple.',
'["foto_canilla.jpg"]',
'[{"fecha":"2025-04-01T10:00:00","evento":"Reclamo recibido","descripcion":"Valentina López reportó goteo en canilla.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-04-04T10:45:00","evento":"Trabajo realizado","descripcion":"Se reemplazó el cuerito. Costo: $12.000.","actor":"Proveedor","tipo":"trabajo"},{"fecha":"2025-04-05T16:30:00","evento":"Caso resuelto","descripcion":"Valentina confirmó que la canilla ya no gotea.","actor":"Inquilino","tipo":"cierre"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0006-0000-0000-000000000000','cccccccc-0006-0000-0000-000000000000','bbbbbbbb-0006-0000-0000-000000000000','aaaaaaaa-0004-0000-0000-000000000000','dddddddd-0005-0000-0000-000000000000',
'Albañilería','Media','En curso','Humedad en pared del living','Apareció una mancha de humedad en la pared del living que da a la medianera.',
'2025-04-05T11:30:00','2025-04-10T09:00:00',85000,null,'Posible filtración desde la terraza del piso superior.',
'["foto_humedad_1.jpg","foto_humedad_2.jpg"]',
'[{"fecha":"2025-04-05T11:30:00","evento":"Reclamo recibido","descripcion":"Diego Ramírez reportó humedad en pared.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-04-08T14:00:00","evento":"Aprobación del propietario","descripcion":"Silvia aprobó. Presupuesto: $85.000.","actor":"Propietario","tipo":"aprobacion"},{"fecha":"2025-04-10T09:00:00","evento":"Trabajo en curso","descripcion":"El albañil comenzó la reparación.","actor":"Proveedor","tipo":"trabajo"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0007-0000-0000-000000000000','cccccccc-0005-0000-0000-000000000000','bbbbbbbb-0005-0000-0000-000000000000','aaaaaaaa-0003-0000-0000-000000000000','dddddddd-0002-0000-0000-000000000000',
'Electricidad','Alta','En curso','Corte eléctrico parcial en cocina','Se desconectó la electricidad del sector cocina-lavadero. La térmica salta al conectar la heladera.',
'2025-04-09T20:30:00','2025-04-11T10:00:00',30000,null,'Verificar primero el circuito antes de revisar la heladera.',
'["foto_termica_saltada.jpg"]',
'[{"fecha":"2025-04-09T20:30:00","evento":"Reclamo recibido","descripcion":"Valentina López reportó que salta la térmica.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-04-10T08:00:00","evento":"Aprobación del propietario","descripcion":"Jorge aprobó. Presupuesto: $30.000.","actor":"Propietario","tipo":"aprobacion"},{"fecha":"2025-04-11T10:00:00","evento":"Trabajo en curso","descripcion":"El electricista está revisando el circuito.","actor":"Proveedor","tipo":"trabajo"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0008-0000-0000-000000000000','cccccccc-0007-0000-0000-000000000000','bbbbbbbb-0007-0000-0000-000000000000','aaaaaaaa-0004-0000-0000-000000000000','dddddddd-0006-0000-0000-000000000000',
'Aire acondicionado','Media','Asignada','Aire acondicionado pierde agua','El split del living pierde agua por la unidad interior. Se formó una mancha en la pared.',
'2025-04-11T14:00:00','2025-04-12T11:00:00',20000,null,'Posible obstrucción en el desagüe del split.',
'["foto_split_goteo.jpg"]',
'[{"fecha":"2025-04-11T14:00:00","evento":"Reclamo recibido","descripcion":"Sofía Castro reportó que el aire pierde agua.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-04-11T18:00:00","evento":"Aprobación del propietario","descripcion":"Silvia aprobó. Presupuesto: $20.000.","actor":"Propietario","tipo":"aprobacion"},{"fecha":"2025-04-12T11:00:00","evento":"Proveedor asignado","descripcion":"Se asignó a Clima Total. Visita para 14/04.","actor":"Sistema","tipo":"asignacion"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0009-0000-0000-000000000000','cccccccc-0008-0000-0000-000000000000','bbbbbbbb-0008-0000-0000-000000000000','aaaaaaaa-0005-0000-0000-000000000000','dddddddd-0008-0000-0000-000000000000',
'General','Baja','Resuelta','Persiana trabada en dormitorio','La persiana del dormitorio principal se trabó a mitad de camino y no sube ni baja.',
'2025-03-28T08:00:00','2025-04-02T17:00:00',18000,16500,'Se reemplazó la cinta y se lubricaron los rieles.',
'["foto_persiana.jpg"]',
'[{"fecha":"2025-03-28T08:00:00","evento":"Reclamo recibido","descripcion":"Martín Herrera reportó persiana trabada.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-04-01T14:00:00","evento":"Visita y reparación","descripcion":"Se reemplazó cinta y lubricaron rieles. Costo: $16.500.","actor":"Proveedor","tipo":"trabajo"},{"fecha":"2025-04-02T17:00:00","evento":"Caso resuelto","descripcion":"Martín confirmó que la persiana funciona correctamente.","actor":"Inquilino","tipo":"cierre"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0010-0000-0000-000000000000','cccccccc-0009-0000-0000-000000000000','bbbbbbbb-0009-0000-0000-000000000000','aaaaaaaa-0006-0000-0000-000000000000',null,
'Pintura','Baja','Nueva','Pintura descascarada en techo del baño','La pintura del techo del baño se está descascarando por la humedad del vapor.',
'2025-04-13T10:00:00','2025-04-13T10:03:00',null,null,'',
'["foto_techo_bano.jpg"]',
'[{"fecha":"2025-04-13T10:00:00","evento":"Reclamo recibido","descripcion":"Camila Ruiz reportó pintura descascarada en techo del baño.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-04-13T10:03:00","evento":"Clasificación automática","descripcion":"InmoDesk clasificó como Pintura - Urgencia Baja.","actor":"Sistema","tipo":"sistema"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0011-0000-0000-000000000000','cccccccc-0010-0000-0000-000000000000','bbbbbbbb-0010-0000-0000-000000000000','aaaaaaaa-0006-0000-0000-000000000000',null,
'Plomería','Media','Pendiente de aprobación','Inodoro pierde agua por la base','El inodoro del baño principal pierde agua por la base al tirar la cadena.',
'2025-04-12T21:00:00','2025-04-13T08:00:00',28000,null,'Posible problema con la junta de cera o el anillo de sellado.',
'["foto_inodoro_base.jpg"]',
'[{"fecha":"2025-04-12T21:00:00","evento":"Reclamo recibido","descripcion":"Facundo Torres reportó pérdida de agua en inodoro.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-04-13T08:00:00","evento":"Solicitud de aprobación","descripcion":"Se envió solicitud a Graciela Peralta.","actor":"Sistema","tipo":"aprobacion"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0012-0000-0000-000000000000','cccccccc-0001-0000-0000-000000000000','bbbbbbbb-0001-0000-0000-000000000000','aaaaaaaa-0001-0000-0000-000000000000','dddddddd-0006-0000-0000-000000000000',
'Aire acondicionado','Baja','Cerrada','Service de aire acondicionado','Solicitud de service preventivo del aire acondicionado del living antes del verano.',
'2025-03-15T10:00:00','2025-03-22T18:00:00',15000,15000,'Service preventivo completado sin problemas.',
'[]',
'[{"fecha":"2025-03-15T10:00:00","evento":"Reclamo recibido","descripcion":"María González solicitó service de aire acondicionado.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-03-20T10:00:00","evento":"Service realizado","descripcion":"Limpieza de filtros y carga de gas. Costo: $15.000.","actor":"Proveedor","tipo":"trabajo"},{"fecha":"2025-03-22T18:00:00","evento":"Caso cerrado","descripcion":"Service completado exitosamente.","actor":"Sistema","tipo":"cierre"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0013-0000-0000-000000000000','cccccccc-0003-0000-0000-000000000000','bbbbbbbb-0003-0000-0000-000000000000','aaaaaaaa-0002-0000-0000-000000000000','dddddddd-0005-0000-0000-000000000000',
'Albañilería','Media','Reabierta','Humedad recurrente en baño','Volvió a aparecer la mancha de humedad en la pared del baño que ya había sido reparada.',
'2025-03-01T09:00:00','2025-04-13T11:00:00',60000,null,'Caso reabierto. La reparación anterior no resolvió el problema de fondo.',
'["foto_humedad_reincidente.jpg"]',
'[{"fecha":"2025-03-01T09:00:00","evento":"Reclamo recibido","descripcion":"Ana Martínez reportó humedad en el baño.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-03-05T14:00:00","evento":"Reparación realizada","descripcion":"Se reparó y aplicó antihumedad. Costo: $45.000.","actor":"Proveedor","tipo":"trabajo"},{"fecha":"2025-04-13T11:00:00","evento":"Caso reabierto","descripcion":"Ana reportó que la humedad volvió a aparecer.","actor":"Inquilino","tipo":"reapertura"}]',
'11111111-1111-1111-1111-111111111111'),

('eeeeeeee-0014-0000-0000-000000000000','cccccccc-0006-0000-0000-000000000000','bbbbbbbb-0006-0000-0000-000000000000','aaaaaaaa-0004-0000-0000-000000000000',null,
'Gas','Alta','Pendiente de aprobación','Calefacción no funciona','El calefactor del living no enciende. Llega gas pero no produce llama.',
'2025-04-13T18:00:00','2025-04-13T18:15:00',40000,null,'',
'["foto_calefactor.jpg"]',
'[{"fecha":"2025-04-13T18:00:00","evento":"Reclamo recibido","descripcion":"Diego Ramírez reportó que el calefactor no funciona.","actor":"Inquilino","tipo":"inicio"},{"fecha":"2025-04-13T18:15:00","evento":"Solicitud de aprobación","descripcion":"Se envió solicitud a Silvia Domínguez.","actor":"Sistema","tipo":"aprobacion"}]',
'11111111-1111-1111-1111-111111111111')

on conflict (id) do nothing;
