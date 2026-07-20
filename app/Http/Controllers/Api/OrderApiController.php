<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderApiController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name'  => 'required|string|max:100',
            'customer_phone' => 'required|string|max:20',
            'address'        => 'nullable|string|max:255',
            'items'          => 'required|array|min:1',
            'items.*.name'   => 'required|string',
            'items.*.size'   => 'nullable|string',
            'items.*.color'  => 'nullable|string',
            'items.*.price'  => 'required|numeric',
            'items.*.qty'    => 'required|integer|min:1',
            'total'          => 'required|numeric',
            'notes'          => 'nullable|string|max:500',
        ]);

        $order = Order::create(array_merge($data, ['status' => 'pending']));

        return response()->json([
            'success' => true,
            'order'   => $order,
            'message' => 'تم استلام طلبك! سنتواصل معك قريباً ✅',
        ], 201);
    }

    // Admin: list all orders
    public function index()
    {
        return response()->json([
            'orders' => Order::latest()->limit(500)->get(),
        ]);
    }

    // Admin: update order status
    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'required|in:pending,confirmed,in_progress,ready,delivered,cancelled',
        ]);

        $order->update($data);
        return response()->json(['order' => $order]);
    }

    // Admin: delete order
    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(['message' => 'تم حذف الطلب']);
    }
}
