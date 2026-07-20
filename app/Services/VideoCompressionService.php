<?php

namespace App\Services;

use FFMpeg\FFMpeg;
use FFMpeg\Format\Video\X264;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Re-encodes uploaded product videos to H.264/AAC mp4 at the same resolution
 * as the source, using a CRF (constant-quality) encode to shrink file size
 * without downscaling.
 *
 * This runs SYNCHRONOUSLY inside the upload request, by design. Queueing the
 * encode would require standing up real infrastructure this project doesn't
 * have yet: a persistent `queue:work` worker process plus a job-status
 * polling UI so the admin knows when the video is ready. A blocking
 * synchronous encode is an acceptable tradeoff here because uploading a
 * product video is an infrequent, admin-only action (a handful of times a
 * week, not a customer-facing high-volume flow) -- not because synchronous
 * processing would be fine for uploads in general.
 */
class VideoCompressionService
{
    private const CRF = 28;

    private const PRESET = 'medium';

    public function compressAndStore(UploadedFile $file, string $directory, string $disk = 'public'): string
    {
        $ffmpeg = FFMpeg::create([
            'ffmpeg.binaries' => config('services.ffmpeg.binary'),
            'ffprobe.binaries' => config('services.ffmpeg.probe'),
            'timeout' => 3600,
            'ffmpeg.threads' => 0,
        ]);

        $video = $ffmpeg->open($file->getRealPath());

        $format = new X264('aac', 'libx264');

        // php-ffmpeg's X264 format defaults to a 1000k target bitrate, which
        // makes it emit "-b:v 1000k" alongside our "-crf" flag and forces a
        // 2-pass encode. That fights with CRF (constant-quality) encoding and
        // roughly doubles encode time for no benefit, so we zero the bitrate
        // out to get a plain single-pass CRF encode.
        $format->setKiloBitrate(0);
        $format->setAdditionalParameters(['-crf', (string) self::CRF, '-preset', self::PRESET]);

        $tempPath = sys_get_temp_dir().DIRECTORY_SEPARATOR.'vidcompress_'.Str::random(20).'.mp4';

        try {
            $video->save($format, $tempPath);

            $path = $directory.'/'.Str::random(40).'.mp4';
            Storage::disk($disk)->put($path, file_get_contents($tempPath));

            return $path;
        } finally {
            if (file_exists($tempPath)) {
                @unlink($tempPath);
            }
        }
    }
}
