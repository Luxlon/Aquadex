<div align="center">

# Aquadex

**Real-time IoT Water Quality Monitoring Dashboard**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel)](https://aquadex-six.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**[Live Demo → aquadex-six.vercel.app](https://aquadex-six.vercel.app)**

</div>

---

## Overview

**Aquadex** adalah sistem monitoring kualitas air berbasis **IoT (Internet of Things)** yang memungkinkan pemantauan kondisi air secara **real-time** melalui dashboard web interaktif.

Sistem ini mengintegrasikan perangkat keras berupa **sensor IoT** yang terhubung ke cloud, lalu menampilkan data sensor secara langsung ke dashboard web yang dapat diakses dari mana saja. Aquadex ditujukan untuk keperluan monitoring air bersih, akuakultur, maupun sistem pengolahan air.

---

## Fitur Utama

-  **Real-time Monitoring** — Data dari sensor IoT diperbarui secara langsung tanpa perlu refresh halaman
-  **4 Parameter Kualitas Air** — Turbidity, pH, Temperature, dan Water Flow dipantau secara bersamaan
-  **Status Alert Otomatis** — Sistem mendeteksi kondisi air dan memberikan indikator status (Excellent / Danger)
-  **Riwayat Data (Historical Data)** — Grafik historis data sensor untuk analisis tren kualitas air
-  **Responsive Design** — Tampilan optimal di semua perangkat (desktop, tablet, mobile)
-  **Dark / Light Mode** — Dukungan tema terang dan gelap

---

##  Parameter Sensor yang Dipantau

| Parameter | Satuan | Keterangan |
|---|---|---|
|  **Turbidity** | NTU | Mengukur kekeruhan / kejernihan air |
|  **pH Level** | pH | Mengukur tingkat keasaman atau kebasaan air |
|  **Temperature** | °C | Mengukur suhu air secara presisi |
|  **Water Flow** | L/s | Mengukur laju aliran air per detik |

---

##  Arsitektur Sistem

```
┌─────────────────┐       ┌──────────────┐       ┌──────────────────┐
│  Hardware Layer  │──────▶│  Cloud / API │──────▶│  Web Dashboard   │
│                 │       │              │       │                  │
│  Sensor IoT     │       │  Data Broker │       │  Next.js App     │
│  (C++ / Arduino)│       │  (Realtime)  │       │  (aquadex.vercel)│
└─────────────────┘       └──────────────┘       └──────────────────┘
```

- **Hardware** — Mikrokontroler dengan sensor Turbidity, pH, Suhu, dan Flow Rate. Program ditulis dalam **C++** (lihat folder `/program`)
- **Cloud Layer** — Data sensor dikirim ke cloud melalui protokol IoT untuk kemudian dikonsumsi oleh web dashboard
- **Web Dashboard** — Aplikasi **Next.js 14** yang menampilkan data secara real-time dengan UI yang interaktif

---

## Tech Stack

### Web Dashboard (Frontend)

| Teknologi | Keterangan |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework dengan App Router |
| [NextUI v2](https://nextui.org/) | Komponen UI modern |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [Framer Motion](https://www.framer.com/motion/) | Animasi dan transisi UI |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark / Light mode |

### Hardware (IoT)

| Teknologi | Keterangan |
|---|---|
| **C++ / Arduino** | Program mikrokontroler untuk baca sensor |
| **Sensor Turbidity** | Membaca kekeruhan air |
| **Sensor pH** | Membaca tingkat keasaman |
| **Sensor Suhu** | Membaca temperatur air |
| **Sensor Flow Rate** | Membaca laju aliran air |

---

## Struktur Proyek

```
Aquadex/
├── app/                # Next.js App Router (halaman & layout)
├── components/         # Komponen UI reusable
├── config/             # Konfigurasi aplikasi & koneksi IoT
├── lib/                # Utility & helper functions
├── program/            # Kode C++ untuk hardware IoT (Arduino)
├── public/             # Aset statis
├── styles/             # Global CSS
├── types/              # TypeScript type definitions
├── next.config.js      # Konfigurasi Next.js
├── tailwind.config.js  # Konfigurasi Tailwind
└── tsconfig.json       # Konfigurasi TypeScript
```

---

## Cara Menjalankan Proyek

### Prasyarat

- Node.js `>= 18.x`
- npm / yarn / pnpm

### Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/Luxlon/Aquadex.git
cd Aquadex

# 2. Install dependencies
npm install

# 3. Salin file environment dan isi konfigurasi
cp .env.example .env.local

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build untuk Production

```bash
npm run build
npm run start
```

---

## Konfigurasi Hardware

Program untuk mikrokontroler (Arduino / ESP32 / ESP8266) tersedia di folder `/program`.

1. Buka file di `/program` menggunakan **Arduino IDE**
2. Sesuaikan konfigurasi Wi-Fi dan endpoint API di bagian konfigurasi
3. Upload program ke mikrokontroler
4. Pastikan semua sensor terhubung sesuai skema wiring

---

## Live Demo

Dashboard dapat diakses langsung di: **[aquadex-six.vercel.app](https://aquadex-six.vercel.app)**

---

## Lisensi

Proyek ini menggunakan lisensi [MIT](LICENSE).

---

<div align="center">

Dibangun menggunakan Next.js

</div>
