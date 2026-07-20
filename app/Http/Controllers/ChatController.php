<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    private string $systemPrompt = <<<'PROMPT'
أنت مساعد TOYS 141، متجر فلسطيني أونلاين لبيع ألعاب الأطفال بكل أنواعها.

- تشكيلة: ألعاب أطفال صغار، أولاد، بنات، تعليمية، إلكترونية، خارجية، ألعاب جماعية وبازل، وأدوات حفلات.
- بعض المنتجات لها مقاسات أو ألوان متعددة يختارها الزبون قبل الإضافة للسلة.
- التوصيل لجميع مناطق فلسطين.
- التواصل والطلب عبر واتساب أو مباشرة من الموقع.

أجب باللغة العربية، بإجابات مختصرة لا تزيد عن 3 جمل.
كن ودوداً ومهنياً. إذا سُئلت عن توفر عمر مناسب أو لون معين، اطلب من الزبون فتح صفحة المنتج للتأكد من المتوفر حالياً.
PROMPT;

    public function send(Request $request)
    {
        $request->validate([
            'messages'           => 'required|array|max:20',
            'messages.*.role'    => 'required|in:user,assistant',
            'messages.*.content' => 'required|string|max:1000',
        ]);

        $key = config('services.anthropic.key');
        if (!$key) {
            return response()->json(['error' => 'AI service not configured'], 503);
        }

        $response = Http::timeout(15)
            ->withHeaders([
                'x-api-key'         => $key,
                'anthropic-version' => '2023-06-01',
                'content-type'      => 'application/json',
            ])
            ->post('https://api.anthropic.com/v1/messages', [
                'model'      => 'claude-haiku-4-5-20251001',
                'max_tokens' => 300,
                'system'     => $this->systemPrompt,
                'messages'   => $request->messages,
            ]);

        if ($response->status() === 401) {
            return response()->json(['error' => 'invalid_key'], 503);
        }

        if (!$response->successful()) {
            return response()->json(['error' => 'upstream_error'], 502);
        }

        return response()->json([
            'content' => $response->json('content.0.text'),
        ]);
    }
}
