<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Diamond;
use Inertia\Inertia;

class DiamondController extends Controller
{
    public function index()
    {
        $diamonds = Diamond::whereNotNull('stock_id')->get();

        return Inertia::render('Diamonds/List', [
            'diamonds' => $diamonds,
        ]);
    }

    public function show($id)
    {
        $diamond = Diamond::findOrFail($id);

        return Inertia::render('Diamonds/Show', [
            'diamond' => $diamond
        ]);
    }
}
