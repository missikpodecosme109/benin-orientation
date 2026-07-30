<?php

namespace App\Services;

class MatiereBacResolver
{
    /**
     * Alias entre les intitulés abrégés/variantes utilisés dans le guide
     * d'orientation (Guido) et les intitulés officiels des matières du bac
     * (voir CoefficientsBacSeeder). Beaucoup de matières du guide portent déjà
     * exactement le même nom que l'épreuve officielle (Français, Anglais,
     * SVT, Economie...) et n'ont donc pas besoin d'alias ici.
     *
     * Les matières du guide qui n'ont pas d'équivalent officiel raisonnable
     * (Culture générale, Commentaire de texte, Etude de Cas de niche, etc.)
     * sont volontairement absentes : ce sont des épreuves de sélection propres
     * à certaines écoles, en plus du bac, pas des matières du bac lui-même.
     */
    private const ALIAS = [
        'maths' => 'Mathématiques',
        'maths appliquées' => 'Mathématiques Appliquées',
        'maths appliqués' => 'Mathématiques Appliquées',
        'philo' => 'Philosophie',
        'hist-géo' => 'Histoire-Géographie',
        'pct' => 'Sciences Physiques',
        'anglais (lv1)' => 'Langue vivante 1',
        'espagnol (lv1)' => 'Langue vivante 1',
        'allemand (lv1)' => 'Langue vivante 1',
        'lv1' => 'Langue vivante 1',
        'anglais (lv2)' => 'Langue vivante 2',
        'espagnol (lv2)' => 'Langue vivante 2',
        'anglais, espagnol ou allemand' => 'Langue vivante 1',
        'droit admin du travail' => 'Droit Administratif et Droit du Travail',
    ];

    /**
     * Retourne le nom officiel probable d'une matière du guide, ou null si
     * elle n'a pas d'équivalent parmi les matières officielles du bac.
     * L'appelant doit vérifier que ce nom correspond bien à une matière
     * réellement coefficientée pour la série concernée avant de s'en servir.
     */
    public static function nomOfficielPossible(string $nomGuide): string
    {
        $normalise = mb_strtolower(trim($nomGuide));

        return self::ALIAS[$normalise] ?? $nomGuide;
    }
}
