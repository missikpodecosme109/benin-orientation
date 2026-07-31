<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Etablissement;
use App\Models\Filiere;
use Illuminate\Http\Request;

class ImportController extends Controller
{
    private const MODES_VALIDES = ['classement', 'concours', 'dossier'];

    /**
     * Importe des filières depuis un CSV (colonnes : id, nom, etablissement_id,
     * etablissement_nom, quota_bourse, quota_aide_fpp, mode_entree).
     * Une ligne avec un id existant met à jour la filière, sinon elle est créée.
     * etablissement_nom est ignoré : seul etablissement_id fait foi.
     */
    public function importerFilieres(Request $request)
    {
        $request->validate([
            'fichier' => ['required', 'file', 'mimes:csv,txt'],
        ]);

        $flux = fopen($request->file('fichier')->getRealPath(), 'r');
        $entetes = fgetcsv($flux);

        $crees = 0;
        $modifies = 0;
        $erreurs = [];
        $numeroLigne = 1;

        while (($ligne = fgetcsv($flux)) !== false) {
            $numeroLigne++;
            $donnee = array_combine($entetes, $ligne);

            $etablissementId = (int) ($donnee['etablissement_id'] ?? 0);
            $nom = trim($donnee['nom'] ?? '');
            $modeEntree = trim($donnee['mode_entree'] ?? '');

            if ($nom === '' || ! Etablissement::whereKey($etablissementId)->exists() || ! in_array($modeEntree, self::MODES_VALIDES, true)) {
                $erreurs[] = "Ligne {$numeroLigne} : données invalides (nom, etablissement_id ou mode_entree).";
                continue;
            }

            $attributs = [
                'nom' => $nom,
                'etablissement_id' => $etablissementId,
                'quota_bourse' => (int) ($donnee['quota_bourse'] ?? 0),
                'quota_aide_fpp' => (int) ($donnee['quota_aide_fpp'] ?? 0),
                'mode_entree' => $modeEntree,
            ];

            $id = (int) ($donnee['id'] ?? 0);

            if ($id > 0 && Filiere::whereKey($id)->exists()) {
                Filiere::whereKey($id)->update($attributs);
                $modifies++;
            } else {
                Filiere::create($attributs);
                $crees++;
            }
        }

        fclose($flux);

        return response()->json([
            'crees' => $crees,
            'modifies' => $modifies,
            'erreurs' => $erreurs,
        ]);
    }
}
