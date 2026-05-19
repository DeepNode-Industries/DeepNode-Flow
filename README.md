# DeepNode Flow

**Plataforma SaaS de automatización empresarial con IA** — by DeepNode Industries

DeepNode Flow es una plataforma visual de automatización de workflows potenciada con inteligencia artificial. Permite crear flujos de automatización con nodos, conectar integraciones reales (WhatsApp, Email, HTTP, IA, Bases de Datos) y simular ejecuciones con logs detallados, sin necesidad de conocimientos técnicos.

---

## Stack Tecnológico

- **Next.js 16** — App Router con Server & Client Components
- **TypeScript** — Tipado estático completo
- **Tailwind CSS v4** — Estilos utility-first con tema dark futurista
- **@xyflow/react v12** — Canvas de nodos y conexiones
- **Framer Motion** — Animaciones premium
- **Zustand v5** — Estado global del builder
- **Lucide React** — Iconografía consistente
- **LocalStorage** — Persistencia de datos inicial (MVP)

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/deepnode-industries/deepnode-flow.git
cd deepnode-flow

# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Verificación de ESLint |

---

## Estructura del Proyecto

```
deepnode-flow/
├── app/                        # Rutas del App Router
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Layout raíz con fuentes
│   ├── globals.css             # Tema global DeepNode
│   ├── dashboard/page.tsx      # Dashboard con métricas
│   ├── builder/page.tsx        # Editor visual de workflows
│   ├── workflows/page.tsx      # Lista de workflows guardados
│   ├── templates/page.tsx      # Plantillas prediseñadas
│   └── settings/page.tsx       # Configuración de integraciones
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         # Navegación lateral
│   │   ├── Footer.tsx          # Footer con marca
│   │   └── DashboardLayout.tsx # Layout compartido de app
│   ├── ui/
│   │   └── Badge.tsx           # Badges y status indicators
│   └── flow/
│       ├── CustomNodes.tsx     # Nodos visuales personalizados
│       ├── NodePanel.tsx       # Panel izquierdo con nodos disponibles
│       ├── PropertiesPanel.tsx # Panel derecho de propiedades
│       └── ExecutionLogs.tsx   # Overlay de logs de ejecución
│
├── lib/
│   ├── types.ts                # Tipos TypeScript del dominio
│   ├── node-definitions.ts     # Catálogo de 20 nodos disponibles
│   ├── mock-data.ts            # Datos de demostración
│   ├── storage.ts              # Persistencia en LocalStorage
│   └── workflow-engine.ts      # Motor de ejecución simulado
│
└── store/
    └── flow-store.ts           # Estado global con Zustand
```

---

## Páginas

### Landing Page (`/`)
Página de presentación futurista con hero, características, casos de uso, integraciones y precios.

### Dashboard (`/dashboard`)
Panel de control con métricas, workflows activos, historial de ejecuciones y estado de integraciones.

### Workflow Builder (`/builder`)
El editor principal. Permite:
- Agregar nodos desde el panel izquierdo (click o drag-and-drop)
- Conectar nodos arrastrando entre handles
- Editar propiedades en el panel derecho
- Guardar en LocalStorage
- Ejecutar simulación con logs en tiempo real
- Exportar workflow a JSON
- Cargar un workflow existente via `?id=wf-xxx`

### Workflows (`/workflows`)
Lista de todos los flujos con filtros, búsqueda y acciones (abrir, duplicar, eliminar).

### Templates (`/templates`)
Plantillas prediseñadas listas para usar con filtros por categoría.

### Settings (`/settings`)
Configuración de API keys, credenciales y modo demo/producción.

---

## Nodos Disponibles

### Triggers
| Tipo | Descripción |
|---|---|
| `manual-trigger` | Inicio manual del flujo |
| `webhook` | Recibe peticiones HTTP |
| `schedule` | Cron job programado |
| `form-submission` | Activado por formulario |

### Inteligencia Artificial
| Tipo | Descripción |
|---|---|
| `ai-text-generator` | Genera texto con GPT/Claude |
| `ai-classifier` | Clasifica texto en categorías |
| `ai-summarizer` | Resume texto largo |
| `ai-json-extractor` | Extrae datos estructurados |
| `ai-agent` | Agente autónomo con herramientas |

### Acciones
| Tipo | Descripción |
|---|---|
| `http-request` | Llamadas HTTP a APIs externas |
| `send-email` | Envío de correo electrónico |
| `send-whatsapp` | Mensaje WhatsApp Business |
| `save-to-crm` | Guarda en HubSpot/Salesforce |
| `save-to-sheets` | Guarda en Google Sheets |
| `database-query` | Consultas SQL/NoSQL |
| `notification` | Notificaciones push/Slack/Teams |

### Lógica
| Tipo | Descripción |
|---|---|
| `if-condition` | Bifurcación condicional |
| `delay` | Pausa temporizada |
| `loop` | Iteración sobre arrays |
| `transform-data` | Mapeo y transformación de datos |

---

## Cómo Agregar un Nuevo Nodo

1. **Definir el nodo** en `lib/node-definitions.ts`:

```typescript
{
  type: "mi-nodo",
  category: "action",           // "trigger" | "ai" | "action" | "logic"
  label: "Mi Nodo",
  description: "Hace algo increíble",
  icon: "Zap",                  // Nombre del icono de Lucide React
  color: "#7c3aed",
  accentColor: "#a855f7",
  defaultConfig: { url: "" },
  configFields: [
    { key: "url", label: "URL", type: "text", placeholder: "https://..." },
  ],
}
```

2. **Registrar el tipo** en `components/flow/CustomNodes.tsx`:

```typescript
export const NODE_TYPES = {
  // ...existentes
  "mi-nodo": memo(BaseNode),
};
```

3. **Agregar el ícono** al `ICON_MAP` en `NodePanel.tsx` y `CustomNodes.tsx`.

---

## Motor de Ejecución

El motor en `lib/workflow-engine.ts`:
1. Ordena los nodos topológicamente (BFS desde los triggers)
2. Simula la ejecución nodo por nodo con delays realistas
3. Genera logs descriptivos por tipo de nodo
4. Actualiza el estado visual en el canvas (pending → running → success/error)
5. Maneja errores y nodos omitidos
6. Guarda historial en LocalStorage

---

## Despliegue en Vercel

### Método 1 — Via CLI
```bash
npm install -g vercel
vercel login
vercel
```

### Método 2 — Via GitHub
1. Sube el proyecto a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com) → Import Project
3. Selecciona el repositorio
4. Vercel detecta Next.js automáticamente
5. Haz click en **Deploy**

No se requieren variables de entorno para el MVP (modo demo con LocalStorage).

---

## Conectar Backend Real

Para producción:

### 1. API Routes en Next.js
```
app/api/workflows/route.ts        # CRUD de workflows
app/api/execute/[id]/route.ts     # Ejecución real
app/api/webhooks/[id]/route.ts    # Webhooks entrantes
```

### 2. Variables de Entorno
```env
OPENAI_API_KEY=sk-...
WHATSAPP_TOKEN=EAAxxxx...
DATABASE_URL=postgresql://...
```

### 3. Base de Datos
Reemplaza `lib/storage.ts` con llamadas a Supabase, PlanetScale o Neon.

### 4. Ejecución Real
Reemplaza `lib/workflow-engine.ts` con ejecución real de cada tipo de nodo.

---

## Roadmap

- [ ] Autenticación con Clerk o NextAuth.js
- [ ] Base de datos (Supabase o Neon)
- [ ] Ejecución real de nodos IA (OpenAI SDK)
- [ ] WhatsApp Cloud API real
- [ ] Webhooks reales con Vercel Edge Functions
- [ ] Variables de flujo dinámicas `{{variable}}`
- [ ] Historial de versiones de workflows
- [ ] Marketplace de integraciones

---

**DeepNode Industries © 2026. Todos los derechos reservados.**
