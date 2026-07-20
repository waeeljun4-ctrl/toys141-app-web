import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function SiteSettings({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        whatsapp_number: settings?.whatsapp_number || '',
        instagram_url: settings?.instagram_url || '',
        tiktok_url: settings?.tiktok_url || '',
        facebook_url: settings?.facebook_url || '',
    });

    function submit(e) {
        e.preventDefault();
        post('/admin/settings');
    }

    return (
        <AdminLayout title="التواصل الاجتماعي">
            <Head title="التواصل الاجتماعي" />

            <form onSubmit={submit} className="bg-white rounded-2xl border border-cream-3 p-5 max-w-md space-y-4">
                <p className="font-bold text-ink text-sm">بيانات التواصل</p>

                <Field label="رقم الواتساب" value={data.whatsapp_number}
                    onChange={v => setData('whatsapp_number', v)} error={errors.whatsapp_number}
                    placeholder="972500000000" />
                <Field label="رابط إنستغرام" value={data.instagram_url}
                    onChange={v => setData('instagram_url', v)} error={errors.instagram_url}
                    placeholder="https://instagram.com/toys141" />
                <Field label="رابط تيك توك" value={data.tiktok_url}
                    onChange={v => setData('tiktok_url', v)} error={errors.tiktok_url}
                    placeholder="https://tiktok.com/@toys141" />
                <Field label="رابط فيسبوك" value={data.facebook_url}
                    onChange={v => setData('facebook_url', v)} error={errors.facebook_url}
                    placeholder="https://facebook.com/toys141" />

                <button disabled={processing}
                    className="bg-ink text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-accent transition-colors disabled:opacity-60">
                    {processing ? '⏳ جاري الحفظ...' : 'حفظ'}
                </button>
            </form>
        </AdminLayout>
    );
}

function Field({ label, value, onChange, error, placeholder }) {
    return (
        <div>
            <label className="text-xs font-bold text-muted block mb-1">{label}</label>
            <input type="text" dir="ltr" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
                className="w-full px-3 py-2 border-2 border-cream-3 rounded-xl text-sm focus:border-accent outline-none font-cairo" />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
