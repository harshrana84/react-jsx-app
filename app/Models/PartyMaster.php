<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartyMaster extends Model
{
    protected $fillable = ['name', 'address', 'state', 'pan', 'gst'];
}