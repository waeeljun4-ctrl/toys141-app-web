import { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Button, Modal, Input } from '../../Components/UI';

function BrandForm({ open, onClose, brand }) {
    const isEdit = !!brand;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name:       brand?.name || '',
        sort_order: brand?.sort_order || 0,
        is_active:  brand?.is_active ?? true,
    });

    const [logoPreview, setLogoPreview] = useState(brand?.logo ? `/storage/${brand.logo}` : null);
    const [logoUploading, setLogoUploading] = useState(false);
    const logoInput = useRef(null);

    function submit(e) {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.brands.update', brand.id), { onSuccess: () => { onClose(); reset(); } });
        } else {
            post(route('admin.brands.store'), { onSuccess: () => { onClose(); reset(); } });
        }
    }

    function handleLogoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setLogoPreview(URL.createObjectURL(file));
        setLogoUploading(true);
        router.post(route('admin.brands.uploadLogo', brand.id), { logo: file }, {
            forceFormData: true,
            onFinish: () => setLogoUploading(false),
        });
    }

    function deleteLogo() {
        if (!confirm('حذف شعار الماركة؟')) return;
        router.delete(route('admin.brands.destroyLogo', brand.id), { onSuccess: () => setLogoPreview(null) });
    }

    return (
        <Modal open={open} onClose={onClose} title={isEdit ? 'تعديل الماركة' : 'إضافة ماركة'} maxWidth="max-w-sm">
            <form onSubmit={submit} className="space-y-3">
                <Input label="اسم الماركة" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="Nike" />
                <div className="grid grid-cols-2 gap-3">
                    <Input label="الترتيب" type="number" value={data.sort_order} onChange={e => setData('sort_order', Number(e.target.value))} />
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold tracking-widest uppercase text-muted">يظهر</label>
                        <select value={data.is_active ? '1' : '0'} onChange={e => setData('is_active', e.target.value === '1')}
                            className="px-3 py-2 border-2 border-cream-3 focus:border-accent rounded-lg text-sm text-ink bg-cream outline-none">
                            <option value="1">نعم ✅</option><option value="0">لا ❌</option>
                        </select>
                    </div>
                </div>

                {isEdit && (
                    <div className="border border-cream-3 rounded-xl p-3 space-y-2">
                        <p className="text-xs font-bold text-muted">🖼 شعار الماركة</p>
                        {logoPreview ? (
                            <div className="relative w-20 h-20">
                                <img src={logoPreview} alt="" className="w-20 h-20 rounded-xl object-cover" />
                                {logoUploading && (
                                    <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center text-xs text-accent font-bold">⏳</div>
                                )}
                                <button type="button" onClick={deleteLogo}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none hover:bg-red-600">✕</button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => logoInput.current?.click()}
                                className="w-20 h-20 border-2 border-dashed border-cream-3 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-accent hover:bg-accent-pale transition-colors text-muted hover:text-accent">
                                <span className="text-xl">🖼</span>
                                <span className="text-[10px] font-bold">رفع شعار</span>
                            </button>
                        )}
                        <input ref={logoInput} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                    </div>
                )}

                <div className="flex gap-2 pt-1">
                    <button type="button" onClick={onClose} className="bg-cream-2 text-ink border border-cream-3 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-cream-3">إلغاء</button>
                    <button type="submit" disabled={processing} className="flex-1 bg-ink text-white py-2.5 rounded-xl font-black text-sm hover:bg-accent transition-colors disabled:opacity-60">
                        {processing ? '⏳...' : '💾 حفظ'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default function Brands({ brands }) {
    const [formOpen, setFormOpen] = useState(false);
    const [editBrand, setEditBrand] = useState(null);
    const { delete: destroy } = useForm();

    function handleDelete(brand) {
        if (!confirm(`حذف "${brand.name}"؟`)) return;
        destroy(route('admin.brands.destroy', brand.id));
    }

    return (
        <>
            <Head title="الماركات — الإدارة" />
            <AdminLayout title="🏷️ الماركات">
                <div className="flex justify-between items-center mb-5">
                    <p className="text-muted text-sm">{brands.length} ماركة</p>
                    <Button variant="accent" onClick={() => { setEditBrand(null); setFormOpen(true); }}>+ إضافة ماركة</Button>
                </div>
                <div className="bg-white rounded-2xl border border-cream-3 overflow-hidden">
                    {brands.map((b, i) => (
                        <div key={b.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-cream transition-colors ${i < brands.length - 1 ? 'border-b border-cream-3' : ''}`}>
                            <div className="w-11 h-11 bg-cream-2 rounded-xl overflow-hidden flex items-center justify-center text-xl shrink-0">
                                {b.logo ? <img src={`/storage/${b.logo}`} alt={b.name} className="w-full h-full object-cover" /> : '🏷️'}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm text-ink">{b.name}</p>
                                <p className="text-xs text-muted mt-0.5">ترتيب: {b.sort_order} · {b.is_active ? '✅ نشط' : '❌ مخفي'}</p>
                            </div>
                            <div className="flex gap-1.5">
                                <button onClick={() => { setEditBrand(b); setFormOpen(true); }}
                                    className="bg-cream-2 border border-cream-3 text-ink text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-accent-pale hover:border-accent hover:text-accent transition-colors">✏️ تعديل</button>
                                <button onClick={() => handleDelete(b)}
                                    className="border border-cream-3 text-gray-400 text-xs font-bold px-2.5 py-1.5 rounded-lg hover:text-red-500 hover:border-red-400 transition-colors">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
                <BrandForm open={formOpen} onClose={() => { setFormOpen(false); setEditBrand(null); }} brand={editBrand} />
            </AdminLayout>
        </>
    );
}
