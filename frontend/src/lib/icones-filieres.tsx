import {
  Calculator,
  Code2,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Landmark,
  type LucideIcon,
  Palette,
  Scale,
  Sprout,
  Users,
  Wrench,
} from "lucide-react";

const REGLES: [RegExp, LucideIcon][] = [
  [/informatique|logiciel|numérique|réseau|digital/i, Code2],
  [/santé|médec|infirmi|pharma|puéricult/i, HeartPulse],
  [/droit|juridique|magistrat/i, Scale],
  [/agri|agro|zootechni|élevage/i, Sprout],
  [/gestion|comptab|économ|finance|mercatique|commerc/i, Calculator],
  [/administrat|science politique|diplomat/i, Landmark],
  [/génie|technolog|mécanique|électro|bâtiment|travaux/i, Wrench],
  [/art|musique|design/i, Palette],
  [/sociolog|population|social|démographi/i, Users],
  [/chimie|physique|biologie|science/i, FlaskConical],
];

export function iconePourFiliere(nom: string): LucideIcon {
  const regle = REGLES.find(([motif]) => motif.test(nom));
  return regle ? regle[1] : GraduationCap;
}
