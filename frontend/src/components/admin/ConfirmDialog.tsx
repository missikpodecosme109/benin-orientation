"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";

export function ConfirmDialog({
  ouvert,
  titre,
  description,
  enCours,
  onAnnuler,
  onConfirmer,
}: {
  ouvert: boolean;
  titre: string;
  description: string;
  enCours: boolean;
  onAnnuler: () => void;
  onConfirmer: () => void;
}) {
  return (
    <Modal ouvert={ouvert} onFermer={onAnnuler} titre={titre}>
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onAnnuler} disabled={enCours}>
          Annuler
        </Button>
        <Button variant="danger" onClick={onConfirmer} disabled={enCours}>
          {enCours ? "Suppression..." : "Supprimer"}
        </Button>
      </div>
    </Modal>
  );
}
