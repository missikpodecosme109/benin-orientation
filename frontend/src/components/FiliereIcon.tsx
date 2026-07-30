import { createElement } from "react";
import { iconePourFiliere } from "@/lib/icones-filieres";

export function FiliereIcon({
  nom,
  className = "h-5 w-5",
}: {
  nom: string;
  className?: string;
}) {
  return createElement(iconePourFiliere(nom), { className });
}
