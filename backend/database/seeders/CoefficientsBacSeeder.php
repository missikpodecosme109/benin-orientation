<?php

namespace Database\Seeders;

use App\Models\Matiere;
use App\Models\Serie;
use Illuminate\Database\Seeder;

class CoefficientsBacSeeder extends Seeder
{
    /**
     * Coefficients officiels du Baccalauréat béninois, épreuves du premier
     * groupe (l'examen écrit/pratique principal qui détermine l'admissibilité
     * et la moyenne ; le deuxième groupe est un oral de rattrapage, non repris
     * ici pour éviter de compter deux fois une même matière).
     *
     * Source : "Liste des épreuves à l'examen du Baccalauréat", Office du
     * Baccalauréat du Bénin (officedubacbenin.bj), tirée de l'arrêté
     * interministériel N°016-2003/MESRS/MEPS/METFP/CAB/DC/SGM/DOB-BTS/SP.
     *
     * Les séries DEAT et DT ne figurent pas dans cet arrêté (ajoutées depuis) :
     * elles n'ont volontairement pas de coefficients ici tant qu'une source
     * officielle n'est pas identifiée pour elles.
     */
    private const COEFFICIENTS = [
        'A1' => [
            ['Français', 5], ['Philosophie', 4], ['Histoire-Géographie', 3],
            ['Langue vivante 1', 3], ['Langue vivante 2', 2], ['Mathématiques', 2],
            ['SVT', 2],
        ],
        'A2' => [
            ['Français', 4], ['Philosophie', 3], ['Histoire-Géographie', 5],
            ['Langue vivante 1', 3], ['Langue vivante 2', 2], ['Mathématiques', 2],
            ['SVT', 2],
        ],
        'B' => [
            ['Français', 4], ['Philosophie', 3], ['Histoire-Géographie', 4],
            ['Langue vivante 1', 2], ['Economie', 4], ['Mathématiques', 2],
            ['SVT', 2],
        ],
        'C' => [
            ['Mathématiques', 6], ['Sciences Physiques', 5], ['Français', 2],
            ['Anglais', 2], ['SVT', 2], ['Histoire-Géographie', 2],
            ['Philosophie', 2],
        ],
        'D' => [
            ['Mathématiques', 4], ['Sciences Physiques', 4], ['Français', 2],
            ['Anglais', 2], ['SVT', 5], ['Histoire-Géographie', 2],
            ['Philosophie', 2],
        ],
        'E' => [
            ['Français', 2], ['Mathématiques', 5], ['Sciences Physiques', 4],
            ['Construction Mécanique', 3], ['Manipulation (Travaux Pratiques)', 3],
            ['Etude de Fabrication ou Technologie', 2],
        ],
        'F1' => [
            ['Travaux Pratiques', 3], ['Français', 2], ['Mathématiques', 3],
            ['Sciences Physiques', 2], ['Construction Mécanique', 3], ['Mécanique', 2],
            ['Automatique', 2], ["Etude d'Outillage", 2], ['Analyse de Fabrication', 3],
        ],
        'F2' => [
            ['Informatique (TP)', 2], ['Réalisation de Maquette (TP)', 4],
            ['Mesures et Essais de Laboratoire (TP)', 3], ['Français', 2],
            ['Mathématiques', 3], ['Sciences Physiques', 2], ['Construction Mécanique', 2],
            ["Etude d'un Système Technique", 4],
        ],
        'F3' => [
            ['Construction (TP)', 4], ['Mesure et Essai de Laboratoire (TP)', 3],
            ['Français', 2], ['Mathématiques', 3], ['Sciences Physiques', 2],
            ['Electrotechnique', 3], ['Etude de Système Technique', 5],
        ],
        'F4' => [
            ["Projet d'Exploitation (TP)", 3], ['Dessin Technique (TP)', 3],
            ['Français', 2], ['Mathématiques', 3], ['Sciences Physiques', 2],
            ['Résistance des Matériaux', 3], ['Béton Armé', 2], ['Métré et Etude de Prix', 2],
            ['Procédé de Construction', 2],
        ],
        'G1' => [
            ['Techniques de base de secrétariat', 3], ['Français', 3], ['Etude de Cas', 4],
            ['Economie', 3], ['Anglais', 2], ['Compte-Rendu PV + Rapport', 3],
            ['Droit Administratif et Droit du Travail', 2],
        ],
        'G2' => [
            ['Français', 3], ['Etude de Cas', 6], ['Economie', 3], ['Anglais', 2],
            ['Mathématiques Appliquées', 3], ['Droit (TBAD-Finances Publiques)', 2],
        ],
        'G3' => [
            ['Français', 3], ['Etude de Cas', 6], ['Economie', 3], ['Anglais', 2],
            ['Mathématiques Appliquées', 3], ['Droit (TBAD-Finances Publiques)', 2],
        ],
        'EA' => [
            ["Traitement de l'eau (TP)", 4], ['Réseaux hydrauliques (TP)', 3], ['Français', 2],
            ['Assainissement', 2], ['Mathématiques', 3], ['Anglais', 1], ['Sciences Physiques', 2],
            ['Mobilisation des ressources en eau', 4], ["Projet d'exploitation", 4],
        ],
    ];

    public function run(): void
    {
        foreach (self::COEFFICIENTS as $code => $matieres) {
            $serie = Serie::where('code', $code)->first();

            if (! $serie) {
                continue;
            }

            foreach ($matieres as [$nom, $coefficient]) {
                $matiere = Matiere::firstOrCreate(['nom' => $nom]);

                $serie->coefficientsBac()->updateOrCreate(
                    ['matiere_id' => $matiere->id],
                    ['coefficient' => $coefficient]
                );
            }
        }
    }
}
