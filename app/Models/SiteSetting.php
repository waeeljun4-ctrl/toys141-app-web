<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = ['whatsapp_number', 'instagram_url', 'tiktok_url', 'facebook_url'];

    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
