<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\ImageManager;

class ImageCompressionService
{
    private const JPEG_QUALITY = 60;

    public function compressAndStore(UploadedFile $file, string $directory, string $disk = 'public'): string
    {
        $manager = new ImageManager(new Driver());
        $encoded = $manager->decodePath($file->getRealPath())
            ->encode(new JpegEncoder(quality: self::JPEG_QUALITY, strip: true));

        $path = $directory.'/'.Str::random(40).'.jpg';
        Storage::disk($disk)->put($path, $encoded->toString());

        return $path;
    }
}
