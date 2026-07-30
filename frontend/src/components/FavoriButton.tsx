"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, HeartOff, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ajouterFavori } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export function FavoriButton({ filiereId }: { filiereId: number }) {
  const { user, loading } = useAuth();
  const [statut, setStatut] = useState<"idle" | "envoi" | "ajoute" | "erreur">(
    "idle"
  );

  if (loading) return null;

  if (!user) {
    return (
      <Link
        href="/connexion"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
      >
        <LogIn className="h-4 w-4" />
        Se connecter pour ajouter aux favoris
      </Link>
    );
  }

  async function ajouter() {
    setStatut("envoi");
    try {
      await ajouterFavori(filiereId);
      setStatut("ajoute");
    } catch {
      setStatut("erreur");
    }
  }

  return (
    <Button
      variant="secondary"
      onClick={ajouter}
      disabled={statut === "envoi" || statut === "ajoute"}
    >
      {statut === "ajoute" ? (
        <>
          <Heart className="h-4 w-4 fill-current text-brand-600" /> Ajouté aux
          favoris
        </>
      ) : statut === "erreur" ? (
        <>
          <HeartOff className="h-4 w-4" /> Erreur, réessayer
        </>
      ) : statut === "envoi" ? (
        "Ajout..."
      ) : (
        <>
          <Heart className="h-4 w-4" /> Ajouter aux favoris
        </>
      )}
    </Button>
  );
}
