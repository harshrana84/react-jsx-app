<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{

    public function index(Request $request)
    {
        // 1. Get the search query from URL (or null if empty)
        $search = $request->input('search');

        // 2. Start query builder for stocks table (initially no filters)
        $query = Stock::query();

        // 3. If search is not empty, add filters to search specific columns
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('stock_id', 'like', "%{$search}%")
                    ->orWhere('shape', 'like', "%{$search}%")
                    ->orWhere('color', 'like', "%{$search}%")
                    ->orWhere('clarity', 'like', "%{$search}%");
            });
        }

        // 4. Fetch up to 50 filtered or all records
        $stocks = $query->take(50)->get();

        // 5. Return view with stocks data and current filters for React
        return Inertia::render('Stocks/Index', [
            'stocks' => $stocks,
            'filters' => $request->only('search'), // pass current search so frontend knows
        ]);
    }
}
