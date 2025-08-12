<?php

namespace App\Http\Controllers;

use App\Models\PartyMaster;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartyMasterController extends Controller
{
    public function index()
    {
        $parties = PartyMaster::all();
        return Inertia::render('Parties/Index', ['parties' => $parties]);
    }

    public function store(Request $request)
    {
        $party = PartyMaster::create($request->all());
        return redirect()->route('parties.index')->with('success', 'Party created');
    }
    public function update(Request $request, PartyMaster $party)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'pan' => 'nullable|string|max:50',
            'gst' => 'nullable|string|max:50',
        ]);

        $party->update($validated);

        return redirect()->route('parties.index')->with('success', 'Party updated!');
    }

    public function destroy(PartyMaster $party)
    {
        $party->delete();
        return redirect()->route('parties.index')->with('success', 'Party deleted!');
    }


}
