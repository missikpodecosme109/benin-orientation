import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Pagination({
  page,
  dernierePage,
  onChange,
}: {
  page: number;
  dernierePage: number;
  onChange: (page: number) => void;
}) {
  if (dernierePage <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Précédent
      </Button>
      <span className="text-sm font-medium text-muted-foreground">
        Page {page} / {dernierePage}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={page >= dernierePage}
      >
        Suivant <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
