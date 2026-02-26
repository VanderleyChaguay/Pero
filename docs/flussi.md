birro/
├── app/
│   ├── page.tsx                       ← Selector de bares
│   ├── layout.tsx                     ← Layout raíz global
│   ├── globals.css                    ← Solo reset básico
│   │
│   ├── auth/                          ← Login, signup (ya existe)
│   │
│   ├── bar/
│   │   ├── pero/
│   │   │   ├── layout.tsx             ← Aplica el tema de Però
│   │   │   ├── page.tsx               ← Homepage de Però
│   │   │   ├── menu/
│   │   │   │   └── page.tsx
│   │   │   └── eventi/
│   │   │       └── page.tsx
│   │   ├── bar-due/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── menu/
│   │   │   │   └── page.tsx
│   │   │   └── eventi/
│   │   │       └── page.tsx
│   │   └── bar-tre/
│   │       └── ...
│   │
│   └── admin/
│       ├── layout.tsx                 ← Protección de rutas admin
│       ├── page.tsx                   ← Dashboard
│       ├── pero/
│       │   ├── menu/page.tsx
│       │   └── eventi/page.tsx
│       ├── bar-due/
│       │   └── ...
│       └── utenti/page.tsx            ← Gestión de admins
│
├── components/
│   ├── ui/                            ← Botones, inputs, cards (ya existe)
│   │
│   ├── homepage-selector/             ← Componentes de la página principal
│   │   └── bar-card.tsx
│   │
│   ├── bar/
│   │   ├── shared/                    ← Compartido entre todos los bares
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── menu-preview.tsx
│   │   ├── pero/                      ← Exclusivos de Però
│   │   │   ├── hero.tsx
│   │   │   ├── storia.tsx
│   │   │   └── eventi-preview.tsx
│   │   └── bar-due/
│   │       └── ...
│   │
│   └── admin/                         ← Componentes del panel admin
│       ├── sidebar.tsx
│       ├── menu-editor.tsx
│       └── allergen-picker.tsx
│
├── styles/
│   ├── globals.css
│   └── themes/
│       ├── pero.css
│       ├── bar-due.css
│       └── bar-tre.css
│
├── lib/
│   ├── prisma.ts
│   ├── supabase/
│   │   ├── client.ts                  ← Cliente para el browser
│   │   └── server.ts                  ← Cliente para el servidor
│   └── utils.ts
│
├── types/
│   └── index.ts                       ← Tipos TypeScript compartidos
│
└── public/
    ├── images/
    │   ├── pero/                      ← Imágenes estáticas de Però
    │   └── bar-due/
    └── icons/
        └── allergens/                 ← Iconos de los 14 alérgenos