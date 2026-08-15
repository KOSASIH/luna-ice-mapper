# Luna Ice Mapper Web Platform 🚀🌕

An open-source, full-stack Next.js 15 web platform for **Luna Ice Mapper** — an Indonesia-led 6U CubeSat mission in partnership with NASA CSLI (CubeSat Launch Initiative) designed to map water-ice deposits and hydrogen concentrations in Permanently Shadowed Regions (PSRs) of the Lunar South Pole.

Target Launch Window: **Q4 2027 – Q2 2028**

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router, React 18, TypeScript)
- **Styling**: Tailwind CSS, CSS Custom Starfield, Custom Ice Glow Animations
- **UI Components**: Custom shadcn-style component primitives (Badge, Button, Card, Progress, Tabs, etc.)
- **Icons**: Lucide React
- **Data & Charts**: Recharts, Date-fns, Custom Realtime SVG Telemetry Stream
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Design System**: Dark Space Theme (`#030712`), Ice Blue Accent (`#38bdf8`), Inter & JetBrains Mono typography, WCAG 2.1 AA Compliant

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm / yarn / pnpm

### Installation

```bash
# Navigate to web-platform directory
cd web-platform

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Support

To run the complete platform using Docker Compose (PostGIS, FastAPI backend, Next.js frontend, Redis):

```bash
docker-compose up --build
```

---

## 📜 License

Licensed under the [Apache-2.0 License](LICENSE).
