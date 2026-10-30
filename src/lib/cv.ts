import cvData from "@data/cv.json";

export interface Profile {
  network: string;
  username?: string;
  url: string;
}

export interface WorkLink {
  label: string;
  url: string;
}

export interface Work {
  name: string;
  position: string;
  url?: string;
  links?: WorkLink[];
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface Education {
  institution: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface Skill {
  name: string;
  level?: string;
  keywords?: string[];
}

export interface Project {
  name: string;
  description?: string;
  url?: string;
  repository?: string;
  image?: string;
  keywords?: string[];
}

export interface Cv {
  basics: {
    name: string;
    label: string;
    image: string;
    photo?: string;
    email: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: { city?: string; countryCode?: string };
    profiles: Profile[];
  };
  work: Work[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

export const cv = cvData as Cv;

const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

/**
 * "2023-05" -> "may 2023" · "2023" -> "2023" · "" -> ""
 * Acepta fechas parciales o texto libre ("Actualidad"), así nunca se rompe.
 */
export function formatDate(value?: string): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, year, month] = match;
  const monthIndex = Number(month) - 1;
  const monthName = MONTHS[monthIndex];
  return monthName ? `${monthName} ${year}` : year;
}

/** Rango de fechas listo para mostrar en la línea de tiempo. */
export function formatRange(startDate?: string, endDate?: string): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (!start && !end) return "Actualmente...";
  if (!end) return `${start} — Actualidad`;
  if (start === end) return start;
  return `${start} — ${end}`;
}

/** Foto de perfil: archivo local en /public si existe, si no la remota del JSON. */
export function photoUrl(): string {
  return cv.basics.photo || cv.basics.image;
}

/** URL de un perfil por red (GitHub, LinkedIn, ...). */
export function profileUrl(network: string): string | undefined {
  return cv.basics.profiles.find(
    (profile) => profile.network.toLowerCase() === network.toLowerCase()
  )?.url;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escapa el resumen y resalta (en rojo) la primera aparición del `label`.
 * Sirve para mantener el énfasis visual del hero sin duplicar el texto.
 */
export function highlightLabel(summary = "", label = ""): string {
  const safeSummary = escapeHtml(summary);
  if (!label) return safeSummary;

  const safeLabel = escapeHtml(label);
  if (!safeSummary.includes(safeLabel)) return safeSummary;

  return safeSummary.replace(
    safeLabel,
    `<span class="text-red-300">${safeLabel}</span>`
  );
}
