<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name', 150);
            $table->string('name_he', 200)->nullable();
            $table->string('name_en', 200)->nullable();
            $table->text('description')->nullable();
            $table->text('description_he')->nullable();
            $table->text('description_en')->nullable();
            $table->string('image')->nullable();
            $table->json('images')->nullable();
            $table->string('video')->nullable();
            $table->string('video_url')->nullable();
            $table->string('badge', 30)->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('compare_price', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
