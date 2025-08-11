<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\DiamondsImport;
use Maatwebsite\Excel\Facades\Excel;

class DiamondImportController extends Controller
{
    /**
     * Handle the incoming Excel/CSV import.
     */
    public function import(Request $request)
    {
        // 1. Validate the uploaded file
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        // 2. Kick off the import
        Excel::import(new DiamondsImport, $request->file('file'));

        // 3. Redirect back (Inertia will carry the flash message)
        return back()->with('success', 'Diamonds imported successfully!');
    }

    public function index()
    {
        // $diamonds = \App\Models\Diamond::all();
        $diamonds = \App\Models\Diamond::orderBy('stock_id', 'asc')->get();

        return \Inertia\Inertia::render('Diamonds/List', [
            'diamonds' => $diamonds,
        ]);
    }
}
