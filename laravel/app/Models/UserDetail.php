<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserDetail extends Model
{
    protected $table = 'user_details';

    protected $fillable = [
        'user_id',
        'provider_id',
        'provider_name',
        'provider_token',
        'provider_refresh_token',
    ];

    /**
     * Inverse relation back to users
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
