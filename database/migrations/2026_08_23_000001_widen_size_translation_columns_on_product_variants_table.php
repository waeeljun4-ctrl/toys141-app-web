<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE product_variants MODIFY size_he VARCHAR(100) NULL, MODIFY size_en VARCHAR(100) NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE product_variants MODIFY size_he VARCHAR(40) NULL, MODIFY size_en VARCHAR(40) NULL');
    }
};
