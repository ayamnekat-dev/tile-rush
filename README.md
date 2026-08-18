# Tile Rush

Game refleks sederhana bertema **dark glow**. Ketuk tile neon yang menyala sebelum waktunya habis. Semakin lama kamu bertahan, semakin cepat papan bergerak.

Dibangun dengan **Next.js 16** (App Router) dan **React 19**. Tidak ada backend: skor disimpan di browser.

## Cara main

1. Tekan **Mainkan** (atau `Enter` / `Space`).
2. Ketuk hanya tile yang ber-glow.
3. Tile yang terlambat atau tile mati yang diketuk mengurangi 1 nyawa.
4. Combo menaikkan pengali skor: **×2** mulai 5 streak, **×3** mulai 10 streak.
5. Mulai skor **150**, dua tile bisa menyala bersamaan.
6. `Esc` untuk jeda / lanjut. Ada **3 nyawa**.

High score tersimpan otomatis di `localStorage` browser kamu.

## Fitur

- Grid 4×4 dengan tile cyan, magenta, dan lime
- Timer visual di tile aktif, plus efek urgent saat waktu hampir habis
- Combo, nyawa, jeda, dan layar game over
- Tema gelap neon yang responsif untuk desktop dan mobile

## Stack

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js 16.3 (App Router, Turbopack) |
| UI | React 19 + TypeScript |
| Styling | CSS Modules + CSS variables |
| Font | Outfit + Orbitron (next/font) |
| Data | localStorage (high score) |

## Prasyarat

- Node.js 20 atau lebih baru
- npm (sudah termasuk saat install Node.js)

## Instalasi & menjalankan

Di folder proyek:

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Perintah lain

```bash
npm run build    # build produksi
npm run start    # jalankan hasil build
npm run lint     # cek lint
```

## Struktur folder

```text
Tile-Rush/
  app/                 # layout, halaman utama, style global
  components/          # papan, tile, HUD, menu, pause, game over
  lib/
    game.ts            # aturan game (skor, nyawa, spawn, timer)
    storage.ts         # high score di localStorage
  LICENSE
  README.md
```

Logika permainan dipisah dari tampilan. Ubah angka di `lib/game.ts` jika ingin game lebih mudah atau lebih sulit:

- `INITIAL_TIMEOUT_MS` — lama tile menyala di awal
- `MIN_TIMEOUT_MS` — batas tercepat
- `DUAL_SPAWN_SCORE` — skor mulai dua tile
- `INITIAL_LIVES` — jumlah nyawa

## Lisensi

Proyek ini memakai lisensi [MIT](./LICENSE). Kamu bebas memakai, menyalin, dan memodifikasi, asal tetap menyertakan pemberitahuan copyright.
