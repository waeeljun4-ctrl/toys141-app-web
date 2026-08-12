import { useRef, useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { useConfirm } from '../../Components/useConfirm';

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-xs font-bold text-ink mb-1.5">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

function Input({ label, error, ...props }) {
    return (
        <Field label={label} error={error}>
            <input {...props}
                className="w-full border border-cream-3 rounded-xl px-3 py-2.5 text-sm font-cairo text-ink bg-white focus:outline-none focus:border-accent transition-colors" />
        </Field>
    );
}

function Select({ label, error, children, ...props }) {
    return (
        <Field label={label} error={error}>
            <select {...props}
                className="w-full border border-cream-3 rounded-xl px-3 py-2.5 text-sm font-cairo text-ink bg-white focus:outline-none focus:border-accent transition-colors">
                {children}
            </select>
        </Field>
    );
}

function Textarea({ label, error, ...props }) {
    return (
        <Field label={label} error={error}>
            <textarea {...props} rows={3}
                className="w-full border border-cream-3 rounded-xl px-3 py-2.5 text-sm font-cairo text-ink bg-white focus:outline-none focus:border-accent transition-colors resize-none" />
        </Field>
    );
}

function getYoutubeEmbed(url) {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export default function ProductEdit({ product, categories, brands }) {
    const isNew = !product;
    const imgRef = useRef(null);
    const vidRef = useRef(null);
    const galleryRef = useRef(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [vidPreview, setVidPreview] = useState(null);
    const [vidFileName, setVidFileName] = useState(null);
    const [deletingImg, setDeletingImg] = useState(false);
    const [deletingVid, setDeletingVid] = useState(false);
    const [deletingGalleryIdx, setDeletingGalleryIdx] = useState(null);
    const [newGalleryFiles, setNewGalleryFiles] = useState([]);
    const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);
    const MAX_GALLERY = 10;
    const [uploadProgress, setUploadProgress] = useState(null);
    const { confirmAction, dialog } = useConfirm();

    const { data, setData, post, processing, errors } = useForm({
        category_id:     product?.category_id ?? '',
        brand_id:        product?.brand_id ?? '',
        name:            product?.name ?? '',
        name_he:         product?.name_he ?? '',
        name_en:         product?.name_en ?? '',
        description:     product?.description ?? '',
        description_he:  product?.description_he ?? '',
        description_en:  product?.description_en ?? '',
        badge:           product?.badge ?? '',
        price:           product?.price ?? '',
        compare_price:   product?.compare_price ?? '',
        stock_quantity:  product?.stock_quantity ?? '',
        is_active:       product?.is_active ?? true,
        sort_order:      product?.sort_order ?? 0,
        image:           null,
        new_images:      [],
        video:           null,
        video_url:       product?.video_url ?? '',
        variants: (product?.variants ?? []).map(v => ({
            id: v.id, size: v.size ?? '', color: v.color ?? '', color_he: v.color_he ?? '', color_en: v.color_en ?? '',
            color_hex: v.color_hex ?? '', stock: v.stock ?? 0, sku: v.sku ?? '',
        })),
    });

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setData('image', file);
        setImgPreview(URL.createObjectURL(file));
    }

    function handleVideoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setData('video', file);
        setVidPreview(URL.createObjectURL(file));
        setVidFileName(file.name);
    }

    function deleteImage() {
        confirmAction('حذف الصورة؟', (cb) => {
            setDeletingImg(true);
            router.delete(route('admin.products.destroyImage', product.id), {
                ...cb,
                onFinish: () => { setDeletingImg(false); cb.onFinish(); },
            });
        });
    }

    function deleteVideo() {
        confirmAction('حذف الفيديو؟', (cb) => {
            setDeletingVid(true);
            router.delete(route('admin.products.destroyVideo', product.id), {
                ...cb,
                onFinish: () => { setDeletingVid(false); cb.onFinish(); },
            });
        });
    }

    function handleGalleryChange(e) {
        const files = Array.from(e.target.files || []);
        e.target.value = '';
        if (!files.length) return;
        const room = MAX_GALLERY - (product?.images?.length ?? 0) - newGalleryFiles.length;
        const accepted = files.slice(0, Math.max(0, room));
        const updated = [...newGalleryFiles, ...accepted];
        setNewGalleryFiles(updated);
        setNewGalleryPreviews(prev => [...prev, ...accepted.map(f => URL.createObjectURL(f))]);
        setData('new_images', updated);
    }

    function removeNewGalleryFile(i) {
        const updated = newGalleryFiles.filter((_, idx) => idx !== i);
        setNewGalleryFiles(updated);
        setNewGalleryPreviews(prev => prev.filter((_, idx) => idx !== i));
        setData('new_images', updated);
    }

    function deleteGalleryImage(index) {
        confirmAction('حذف هاي الصورة من المعرض؟', (cb) => {
            setDeletingGalleryIdx(index);
            router.delete(route('admin.products.destroyGalleryImage', [product.id, index]), {
                ...cb,
                onFinish: () => { setDeletingGalleryIdx(null); cb.onFinish(); },
            });
        });
    }

    function addVariantRow() {
        setData('variants', [...data.variants, { size: '', color: '', color_he: '', color_en: '', color_hex: '', stock: 0, sku: '' }]);
    }

    function updateVariant(index, field, value) {
        const next = [...data.variants];
        next[index] = { ...next[index], [field]: value };
        setData('variants', next);
    }

    function removeVariant(index) {
        setData('variants', data.variants.filter((_, i) => i !== index));
    }

    function submit(e) {
        e.preventDefault();
        setUploadProgress(0);
        const url = isNew ? route('admin.products.store') : route('admin.products.update', product.id);
        post(url, {
            forceFormData: true,
            onProgress: (p) => setUploadProgress(p.percentage ?? null),
            onSuccess: () => {
                setUploadProgress(null);
                setImgPreview(null);
                setVidPreview(null);
                setVidFileName(null);
                setNewGalleryFiles([]);
                setNewGalleryPreviews([]);
                setData('new_images', []);
                if (isNew) router.visit(route('admin.products.index'));
            },
            onError: () => setUploadProgress(null),
        });
    }

    const currentImg = imgPreview || (product?.image ? `/storage/${product.image}` : null);
    const existingVideo = product?.video ? `/storage/${product.video}` : null;
    const embedUrl = getYoutubeEmbed(data.video_url);

    return (
        <>
            <Head title={isNew ? 'إضافة منتج جديد' : `تعديل: ${product.name}`} />
            {dialog}
            <AdminLayout title={isNew ? '➕ إضافة منتج' : `✏️ ${product.name}`}>

                <form onSubmit={submit}>
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-6">
                        <Link href={route('admin.products.index')}
                            className="text-sm text-muted hover:text-ink transition-colors font-bold flex items-center gap-1.5">
                            ← العودة للمنتجات
                        </Link>
                        <button type="submit" disabled={processing}
                            className="bg-accent text-white font-black text-sm px-6 py-2.5 rounded-xl hover:bg-accent-light transition-colors disabled:opacity-60 flex items-center gap-2">
                            {processing ? '⏳ جاري الحفظ...' : (isNew ? '💾 حفظ المنتج' : '💾 حفظ التعديلات')}
                        </button>
                    </div>

                    {uploadProgress !== null && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-xs font-bold text-ink mb-1">
                                <span>⬆️ جاري الرفع...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-cream-3 rounded-full h-2.5">
                                <div className="bg-accent h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                        {/* ── العمود الأيمن: الوسائط ── */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-2xl border border-cream-3 p-4">
                                <p className="font-black text-ink text-sm mb-3">🖼 صورة المنتج</p>

                                <div onClick={() => imgRef.current.click()}
                                    className="border-2 border-dashed border-cream-3 rounded-xl overflow-hidden cursor-pointer hover:border-accent transition-colors">
                                    {currentImg ? (
                                        <div className="relative group">
                                            <img src={currentImg} alt={product?.name || 'منتج جديد'} className="w-full h-52 object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                <span className="text-white text-2xl">📷</span>
                                                <span className="text-white font-bold text-sm">تغيير الصورة</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-44 flex flex-col items-center justify-center text-muted gap-2">
                                            <span className="text-4xl">📷</span>
                                            <span className="font-bold text-sm">اضغط لرفع صورة</span>
                                            <span className="text-xs">JPG · PNG · WEBP — حتى 10MB</span>
                                        </div>
                                    )}
                                </div>
                                <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

                                <div className="flex items-center gap-2 mt-2">
                                    {imgPreview && <p className="text-xs text-green-600 font-bold flex-1">✅ صورة جديدة جاهزة للرفع</p>}
                                    {!isNew && product.image && !imgPreview && (
                                        <button type="button" onClick={deleteImage} disabled={deletingImg}
                                            className="text-xs text-red-500 font-bold hover:text-red-700 transition-colors disabled:opacity-50 flex items-center gap-1 ms-auto">
                                            {deletingImg ? '⏳' : '🗑️'} حذف الصورة
                                        </button>
                                    )}
                                </div>
                                {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image}</p>}
                            </div>

                            {/* معرض الصور (اختياري) */}
                            <div className="bg-white rounded-2xl border border-cream-3 p-4">
                                <p className="font-black text-ink text-sm mb-1">🖼️ معرض الصور (اختياري)</p>
                                <p className="text-xs text-muted mb-3">صور إضافية تظهر بمعرض تفاصيل المنتج، فوق صورة الغلاف — حتى {MAX_GALLERY} صور.</p>

                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(product?.images ?? []).map((path, i) => (
                                        <div key={path} className="relative w-20 h-20">
                                            <img src={`/storage/${path}`} className="w-20 h-20 object-cover rounded-xl border border-cream-3" />
                                            <button type="button" onClick={() => deleteGalleryImage(i)} disabled={deletingGalleryIdx === i}
                                                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center leading-none disabled:opacity-50">
                                                {deletingGalleryIdx === i ? '⏳' : '✕'}
                                            </button>
                                        </div>
                                    ))}
                                    {newGalleryPreviews.map((src, i) => (
                                        <div key={src} className="relative w-20 h-20">
                                            <img src={src} className="w-20 h-20 object-cover rounded-xl border-2 border-green-400" />
                                            <button type="button" onClick={() => removeNewGalleryFile(i)}
                                                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center leading-none">✕</button>
                                        </div>
                                    ))}
                                    {((product?.images?.length ?? 0) + newGalleryFiles.length) < MAX_GALLERY && (
                                        <label onClick={() => galleryRef.current.click()}
                                            className="w-20 h-20 flex flex-col items-center justify-center gap-0.5 border-2 border-dashed border-cream-3 rounded-xl cursor-pointer text-muted hover:border-accent hover:text-accent transition-colors">
                                            <span className="text-xl leading-none">📷</span>
                                            <span className="text-[10px] font-bold">إضافة</span>
                                        </label>
                                    )}
                                </div>
                                <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
                                {newGalleryFiles.length > 0 && (
                                    <p className="text-xs text-green-600 font-bold">✅ {newGalleryFiles.length} صورة جاهزة للرفع — رح تنحفظ لما تضغط "حفظ"</p>
                                )}
                                {errors.new_images && <p className="text-xs text-red-500 mt-1">{errors.new_images}</p>}
                            </div>

                            {/* فيديو المنتج */}
                            <div className="bg-white rounded-2xl border border-cream-3 p-4 space-y-3">
                                <p className="font-black text-ink text-sm mb-1">▶ فيديو المنتج</p>

                                {(vidPreview || existingVideo) && (
                                    <div className="rounded-xl overflow-hidden bg-black aspect-video">
                                        <video key={vidPreview || existingVideo} src={vidPreview || existingVideo}
                                            controls className="w-full h-full object-contain" preload="metadata" />
                                    </div>
                                )}

                                <div onClick={() => vidRef.current.click()}
                                    className="border-2 border-dashed border-cream-3 rounded-xl p-4 cursor-pointer hover:border-accent transition-colors text-center">
                                    {vidFileName ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-xl">🎬</span>
                                            <span className="text-sm font-bold text-green-600 truncate max-w-[200px]">{vidFileName}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-muted">
                                            <span className="text-3xl">🎬</span>
                                            <span className="font-bold text-sm">ارفع فيديو من جهازك</span>
                                            <span className="text-xs">MP4 · MOV · WEBM — حتى 200MB</span>
                                        </div>
                                    )}
                                </div>
                                <input ref={vidRef} type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                                {errors.video && <p className="text-xs text-red-500">{errors.video}</p>}

                                {!isNew && product.video && !vidPreview && (
                                    <button type="button" onClick={deleteVideo} disabled={deletingVid}
                                        className="text-xs text-red-500 font-bold hover:text-red-700 transition-colors disabled:opacity-50 flex items-center gap-1">
                                        {deletingVid ? '⏳' : '🗑️'} حذف الفيديو الحالي
                                    </button>
                                )}

                                <div className="border-t border-cream-3 pt-3">
                                    <Field label="أو رابط YouTube" error={errors.video_url}>
                                        <input value={data.video_url} onChange={e => setData('video_url', e.target.value)}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full border border-cream-3 rounded-xl px-3 py-2.5 text-sm font-cairo text-ink bg-white focus:outline-none focus:border-accent transition-colors" />
                                    </Field>
                                    {embedUrl ? (
                                        <div className="mt-3 rounded-xl overflow-hidden aspect-video">
                                            <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="video preview" />
                                        </div>
                                    ) : data.video_url ? (
                                        <p className="text-xs text-amber-500 mt-2">⚠️ الرابط ليس YouTube صالح</p>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* ── العمود الأيسر: المعلومات والتسعير والمقاسات ── */}
                        <div className="lg:col-span-3 space-y-4">

                            <div className="bg-white rounded-2xl border border-cream-3 p-4 space-y-3">
                                <p className="font-black text-ink text-sm mb-1">📋 المعلومات الأساسية</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="اسم المنتج" value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        error={errors.name} placeholder="سيارة تحكم عن بعد" />
                                    <Select label="الصنف" value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)} error={errors.category_id}>
                                        <option value="">اختر الصنف</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                                    </Select>
                                </div>
                                <Select label="الماركة (اختياري)" value={data.brand_id}
                                    onChange={e => setData('brand_id', e.target.value)}>
                                    <option value="">بدون ماركة</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </Select>
                                <Textarea label="الوصف" value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="وصف قصير للمنتج..." />
                            </div>

                            {/* الترجمات */}
                            <div className="bg-white rounded-2xl border border-cream-3 p-4 space-y-3">
                                <p className="font-black text-ink text-sm mb-1">🌐 الترجمات <span className="text-xs text-muted font-normal">(اختياري — إذا تُركت فارغة يُعرض العربي)</span></p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input label="الاسم بالعبري ✡" value={data.name_he}
                                        onChange={e => setData('name_he', e.target.value)} placeholder="שם המוצר בעברית" />
                                    <Input label="الاسم بالإنجليزي 🌍" value={data.name_en}
                                        onChange={e => setData('name_en', e.target.value)} placeholder="Product name in English" />
                                </div>
                                <Textarea label="الوصف بالعبري ✡" value={data.description_he}
                                    onChange={e => setData('description_he', e.target.value)}
                                    placeholder="תיאור קצר של המוצר..." />
                                <Textarea label="الوصف بالإنجليزي 🌍" value={data.description_en}
                                    onChange={e => setData('description_en', e.target.value)}
                                    placeholder="Short product description in English..." />
                            </div>

                            <div className="bg-white rounded-2xl border border-cream-3 p-4 space-y-3">
                                <p className="font-black text-ink text-sm mb-1">💰 السعر</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <Input label="السعر (₪)" type="number" min="0" step="0.01"
                                        value={data.price} onChange={e => setData('price', e.target.value)}
                                        error={errors.price} placeholder="120" />
                                    <Input label='السعر "بدل" — اختياري' type="number" min="0" step="0.01"
                                        value={data.compare_price} onChange={e => setData('compare_price', e.target.value)}
                                        placeholder="160" />
                                    <Input label="الشارة (اختياري)" value={data.badge}
                                        onChange={e => setData('badge', e.target.value)} placeholder="جديد" />
                                </div>
                                {data.variants.length === 0 && (
                                    <>
                                        <Input label="الكمية المتوفرة (اختياري)" type="number" min="0"
                                            value={data.stock_quantity} onChange={e => setData('stock_quantity', e.target.value)}
                                            placeholder="اتركها فاضية لكمية غير محدودة" error={errors.stock_quantity} />
                                        <p className="text-xs text-muted">
                                            لو حطيت رقم، بينخصم أوتوماتيك مع كل طلب ويتوقف البيع لما توصل صفر. اتركها فاضية إذا الكمية غير محدودة.
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="bg-white rounded-2xl border border-cream-3 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="font-black text-ink text-sm">🧸 المقاسات والألوان</p>
                                    <button type="button" onClick={addVariantRow}
                                        className="text-xs font-bold text-accent hover:text-accent-dark">+ إضافة مقاس</button>
                                </div>

                                {data.variants.length === 0 && (
                                    <p className="text-xs text-muted">لا يوجد مقاسات بعد — اضغط "إضافة مقاس" لإضافة أول خيار.</p>
                                )}

                                {data.variants.map((v, i) => (
                                    <div key={i} className="grid grid-cols-12 gap-2 items-end border-b border-cream-3 pb-3 last:border-0 last:pb-0">
                                        <div className="col-span-4">
                                            <Input label="المقاس" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} placeholder="قياسي" />
                                        </div>
                                        <div className="col-span-4">
                                            <Input label="اللون" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} placeholder="أحمر" />
                                        </div>
                                        <div className="col-span-3">
                                            <Input label="المخزون" type="number" min="0" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} />
                                        </div>
                                        <div className="col-span-1">
                                            <button type="button" onClick={() => removeVariant(i)}
                                                className="w-full h-[42px] rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors">🗑️</button>
                                        </div>
                                        <div className="col-span-6">
                                            <Input label="اللون بالعبري ✡ (اختياري)" value={v.color_he} onChange={e => updateVariant(i, 'color_he', e.target.value)} placeholder="אדום" />
                                        </div>
                                        <div className="col-span-6">
                                            <Input label="اللون بالإنجليزي 🌍 (اختياري)" value={v.color_en} onChange={e => updateVariant(i, 'color_en', e.target.value)} placeholder="Red" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl border border-cream-3 p-4 space-y-3">
                                <p className="font-black text-ink text-sm mb-1">⚙️ الإعدادات</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Select label="يظهر في المتجر" value={data.is_active ? '1' : '0'}
                                        onChange={e => setData('is_active', e.target.value === '1')}>
                                        <option value="1">نعم ✅</option>
                                        <option value="0">لا ❌</option>
                                    </Select>
                                    <Input label="الترتيب" type="number" min="0"
                                        value={data.sort_order} onChange={e => setData('sort_order', Number(e.target.value))} />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                        <button type="submit" disabled={processing}
                            className="bg-ink text-white font-black text-sm px-8 py-3 rounded-xl hover:bg-accent transition-colors disabled:opacity-60 flex items-center gap-2">
                            {processing ? '⏳ جاري الحفظ...' : (isNew ? '💾 حفظ المنتج' : '💾 حفظ التعديلات')}
                        </button>
                    </div>
                </form>

            </AdminLayout>
        </>
    );
}
