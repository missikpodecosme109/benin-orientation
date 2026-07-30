<?php

namespace App\Services;

use App\Models\Filiere;
use App\Models\Serie;
use Illuminate\Support\Collection;

class OrientationService
{
    /**
     * Seuil au-dessus duquel une matière est considérée comme un point fort.
     */
    private const SEUIL_MATIERE_FORTE = 14;

    /**
     * Seuil en dessous duquel une matière est considérée comme un point faible.
     */
    private const SEUIL_MATIERE_FAIBLE = 10;

    /**
     * Calcule le classement des filières compatibles avec un candidat.
     *
     * Pondération : quand les coefficients officiels du bac sont connus pour
     * la série du candidat (voir CoefficientsBacSeeder), chaque matière est
     * pondérée par son vrai coefficient officiel. Sinon (séries DEAT et DT,
     * absentes de l'arrêté trouvé), on applique une pondération égale entre
     * les matières listées par le guide pour la filière, faute de coefficient
     * officiel connu pour ces deux séries précises.
     *
     * @param  Serie  $serie  Série de bac du candidat
     * @param  array<int, float>  $notes  Notes du candidat indexées par matiere_id
     * @return Collection<int, array{filiere: Filiere, score: float, compatibilite: int, matieres_fortes: array, matieres_faibles: array}>
     */
    public function classerFilieres(Serie $serie, array $notes): Collection
    {
        $filieres = $serie->filieres()->with('etablissement.universite', 'debouches')->get();

        $coefficientsOfficiels = $serie->coefficientsBac()->with('matiere')->get()
            ->keyBy(fn ($c) => $c->matiere->nom);

        return $filieres
            ->map(function (Filiere $filiere) use ($serie, $notes, $coefficientsOfficiels) {
                $matieres = $filiere->matieresPourSerie($serie->id);

                if ($matieres->isEmpty()) {
                    return null;
                }

                $notesRelevees = [];
                $poids = [];
                foreach ($matieres as $matiere) {
                    if ($coefficientsOfficiels->isNotEmpty()) {
                        // Les notes du candidat sont indexées par l'id des matières
                        // OFFICIELLES du bac (celles renvoyées par SerieController::matieres()),
                        // pas par l'id de la matière telle que nommée dans le guide.
                        $nomOfficiel = MatiereBacResolver::nomOfficielPossible($matiere->nom);
                        $coefficientOfficiel = $coefficientsOfficiels[$nomOfficiel] ?? null;

                        // Matière du guide sans équivalent officiel (ex: "Culture générale",
                        // "Commentaire de texte...") : épreuve de sélection propre à l'école,
                        // en plus du bac. On ne collecte pas de note pour elle.
                        if (! $coefficientOfficiel) {
                            continue;
                        }

                        if (! array_key_exists($coefficientOfficiel->matiere_id, $notes)) {
                            continue;
                        }

                        $notesRelevees[$matiere->nom] = (float) $notes[$coefficientOfficiel->matiere_id];
                        $poids[$matiere->nom] = $coefficientOfficiel->coefficient;
                    } else {
                        // Série sans coefficients officiels connus (DEAT, DT) : ancien
                        // comportement, pondération égale entre les matières du guide.
                        if (! array_key_exists($matiere->id, $notes)) {
                            continue;
                        }

                        $notesRelevees[$matiere->nom] = (float) $notes[$matiere->id];
                        $poids[$matiere->nom] = 1;
                    }
                }

                if (empty($notesRelevees)) {
                    return null;
                }

                $sommePonderee = 0;
                $sommePoids = 0;
                foreach ($notesRelevees as $nom => $note) {
                    $sommePonderee += $note * $poids[$nom];
                    $sommePoids += $poids[$nom];
                }
                $moyenne = $sommePonderee / $sommePoids;
                $compatibilite = (int) round(($moyenne / 20) * 100);

                $matieresFortes = array_keys(array_filter(
                    $notesRelevees,
                    fn ($note) => $note >= self::SEUIL_MATIERE_FORTE
                ));

                $matieresFaibles = array_keys(array_filter(
                    $notesRelevees,
                    fn ($note) => $note < self::SEUIL_MATIERE_FAIBLE
                ));

                return [
                    'filiere' => $filiere,
                    'score' => round($moyenne, 2),
                    'compatibilite' => max(0, min(100, $compatibilite)),
                    'matieres_prises_en_compte' => $notesRelevees,
                    'matieres_fortes' => $matieresFortes,
                    'matieres_faibles' => $matieresFaibles,
                ];
            })
            ->filter()
            ->sortByDesc('compatibilite')
            ->values();
    }
}
