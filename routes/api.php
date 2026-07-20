<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderApiController;
use App\Http\Controllers\Api\ProductApiController;
use Illuminate\Support\Facades\Route;

// ── Public ──
Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:register');
Route::post('/auth/login',    [AuthController::class, 'login'])->middleware('throttle:login');

Route::get('/products',       [ProductApiController::class, 'index']);
Route::post('/orders',        [OrderApiController::class,   'store'])->middleware('throttle:orders');

// ── Authenticated (any logged-in user) ──
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me',     [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

// ── Admin only ──
Route::middleware(['auth:sanctum', 'api.admin'])->prefix('admin')->group(function () {
    Route::get('/orders',               [OrderApiController::class, 'index']);
    Route::patch('/orders/{order}',     [OrderApiController::class, 'update']);
    Route::delete('/orders/{order}',    [OrderApiController::class, 'destroy']);
});
