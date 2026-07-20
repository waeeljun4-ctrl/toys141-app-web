import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useCart } from './CartContext';
import { useLocale } from './LocaleContext';
import { Button, Toast } from './UI';
import { parsePhone, WA_LINK } from '../config';

export default function CartDrawer() {
    const { items, removeItem, changeQty, clear, total, count, open, setOpen } = useCart();
    const { t, dict } = useLocale();
    const { auth, siteSettings } = usePage().props;
    const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', notes: '' });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, msg: '' });
    const [couponCode, setCouponCode] = useState('');
    const [coupon, setCoupon] = useState(null); // { code, discount, message }
    const [couponChecking, setCouponChecking] = useState(false);
    const [myCoupon, setMyCoupon] = useState(null); // private coupon available to activate

    function showToast(msg) {
        setToast({ show: true, msg });
        setTimeout(() => setToast({ show: false, msg: '' }), 3000);
    }

    useEffect(() => {
        if (!auth?.user || !open) return;
        axios.get('/api/coupons/mine').then(({ data }) => {
            setMyCoupon(data.coupons?.[0] || null);
        }).catch(() => {});
    }, [auth?.user, open]);

    async function activateMyCoupon() {
        if (!myCoupon) return;
        setCouponChecking(true);
        try {
            const { data } = await axios.post('/api/coupons/validate', { code: myCoupon.code, total });
            setCoupon({ code: myCoupon.code, discount: data.discount, message: data.message });
            setMyCoupon(null);
        } catch (e) {
            showToast(e.response?.data?.message || 'كود الخصم غير صالح');
        }
        setCouponChecking(false);
    }

    function variantLabel(item) {
        return [item.size, item.color].filter(Boolean).join(' · ');
    }

    async function applyCoupon() {
        if (!couponCode.trim()) return;
        setCouponChecking(true);
        try {
            const { data } = await axios.post('/api/coupons/validate', { code: couponCode.trim(), total });
            setCoupon({ code: couponCode.trim(), discount: data.discount, message: data.message });
        } catch (e) {
            setCoupon(null);
            showToast(e.response?.data?.message || 'كود الخصم غير صالح');
        }
        setCouponChecking(false);
    }

    function removeCoupon() {
        setCoupon(null);
        setCouponCode('');
    }

    const finalTotal = Math.max(0, total - (coupon?.discount || 0));

    async function confirmOrder() {
        if (!items.length) return;
        if (!form.name)    { showToast(t('errName')); return; }
        const { waNumber, error: phoneError } = parsePhone(form.phone);
        if (phoneError)    { showToast(phoneError); return; }
        if (!form.city)    { showToast(t('errCity')); return; }
        if (!form.address) { showToast(t('errAddress')); return; }

        setLoading(true);
        try {
            await axios.post('/api/orders', {
                customer_name:  form.name,
                customer_phone: waNumber,
                address:        `${form.city} — ${form.address}`,
                notes:          form.notes,
                items:          items.map(i => ({ name: i.name, size: i.size, color: i.color, price: i.price, qty: i.qty, product_id: i.productId })),
                total,
                coupon_code: coupon?.code || null,
            });
            showToast(t('successOrder'));
            clear();
            setOpen(false);
            setForm({ name: '', phone: '', city: '', address: '', notes: '' });
            removeCoupon();
        } catch (e) {
            showToast(e.response?.data?.message || t('errGeneric'));
        }
        setLoading(false);
    }

    function orderViaWA() {
        if (!items.length) return;
        if (!siteSettings?.whatsapp_number) { showToast(t('errGeneric')); return; }
        const lines = items.map(i => `- ${i.name}${variantLabel(i) ? ` (${variantLabel(i)})` : ''} (${i.qty}x) = ${i.price * i.qty}₪`).join('\n');
        const nameLine  = form.name  ? dict.waName(form.name) : '';
        const { waNumber: waNum } = parsePhone(form.phone);
        const phoneLine = waNum ? dict.waPhone(waNum) : (form.phone ? `\n${form.phone}` : '');
        const addrLine  = (form.city || form.address) ? dict.waAddress(form.city, form.address) : '';
        const notesLine = form.notes ? dict.waNotes(form.notes) : '';
        const msg = `${t('waGreeting')}\n${t('waWantToOrder')}\n${lines}\n${dict.waTotal(total)}${nameLine}${phoneLine}${addrLine}${notesLine}`;
        window.open(WA_LINK(msg, siteSettings.whatsapp_number), '_blank');
    }

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            )}

            <div className={`fixed top-0 left-0 bottom-0 w-[360px] max-w-full bg-white dark:bg-ink-2 z-50 shadow-2xl flex flex-col transition-transform duration-300
                ${open ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-cream-3 dark:border-white/10 shrink-0">
                    <h3 className="font-bold text-base text-ink dark:text-cream flex items-center gap-2">
                        🛒 {t('cartTitle')}
                        {count > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
                        )}
                    </h3>
                    <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-cream-2 dark:bg-ink text-ink dark:text-cream flex items-center justify-center hover:bg-cream-3">✕</button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                    {!items.length ? (
                        <div className="text-center py-14 text-muted">
                            <div className="text-4xl mb-3">🛍️</div>
                            <p className="text-sm">{t('cartEmpty')}</p>
                        </div>
                    ) : items.map((item) => (
                        <div key={item.key} className="flex gap-3 py-3 border-b border-cream-3 dark:border-white/10 items-start">
                            <div className="w-14 h-14 bg-cream-2 dark:bg-ink rounded-xl flex items-center justify-center text-xl shrink-0 overflow-hidden">
                                {item.image ? <img src={`/storage/${item.image}`} alt={item.name} className="w-full h-full object-cover" /> : '👕'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-ink dark:text-cream truncate">{item.name}</p>
                                {variantLabel(item) && <p className="text-xs text-muted mt-0.5">{variantLabel(item)}</p>}
                                <div className="flex items-center gap-2 mt-1.5">
                                    <button onClick={() => changeQty(item.key, item.qty - 1)}
                                        className="w-6 h-6 rounded-lg bg-cream-2 dark:bg-ink text-ink dark:text-cream text-sm font-bold hover:bg-cream-3">−</button>
                                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                    <button onClick={() => changeQty(item.key, item.qty + 1)}
                                        className="w-6 h-6 rounded-lg bg-cream-2 dark:bg-ink text-ink dark:text-cream text-sm font-bold hover:bg-cream-3">+</button>
                                </div>
                                <p className="text-sm font-black text-accent mt-1">{item.price * item.qty}₪</p>
                            </div>
                            <button onClick={() => removeItem(item.key)} className="text-gray-300 hover:text-red-500 text-sm transition-colors">✕</button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="px-4 pb-5 pt-3 border-t border-cream-3 dark:border-white/10 shrink-0 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                className="px-3 py-2 border-2 border-cream-3 dark:border-white/10 focus:border-accent rounded-lg text-sm text-ink dark:text-cream bg-cream dark:bg-ink outline-none"
                                placeholder={t('namePlaceholder')}
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            />
                            <input
                                className="px-3 py-2 border-2 border-cream-3 dark:border-white/10 focus:border-accent rounded-lg text-sm text-ink dark:text-cream bg-cream dark:bg-ink outline-none"
                                placeholder={t('phonePlaceholder')}
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            />
                        </div>
                        <input
                            className="w-full px-3 py-2 border-2 border-cream-3 dark:border-white/10 focus:border-accent rounded-lg text-sm text-ink dark:text-cream bg-cream dark:bg-ink outline-none"
                            placeholder={t('cityPlaceholder')}
                            value={form.city}
                            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                        />
                        <input
                            className="w-full px-3 py-2 border-2 border-cream-3 dark:border-white/10 focus:border-accent rounded-lg text-sm text-ink dark:text-cream bg-cream dark:bg-ink outline-none"
                            placeholder={t('addressPlaceholder')}
                            value={form.address}
                            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        />
                        <input
                            className="w-full px-3 py-2 border-2 border-cream-3 dark:border-white/10 focus:border-accent rounded-lg text-sm text-ink dark:text-cream bg-cream dark:bg-ink outline-none"
                            placeholder={t('notesPlaceholder')}
                            value={form.notes}
                            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        />

                        {/* Private coupon offer */}
                        {!coupon && myCoupon && (
                            <div className="flex items-center justify-between bg-accent-pale rounded-lg px-3 py-2">
                                <span className="text-xs font-bold text-accent">
                                    🎁 عندك خصم خاص {myCoupon.type === 'percentage' ? `${myCoupon.value}%` : `${myCoupon.value}₪`}!
                                </span>
                                <button onClick={activateMyCoupon} disabled={couponChecking}
                                    className="text-xs font-black bg-accent text-white px-3 py-1 rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50">
                                    {couponChecking ? '⏳' : 'تفعيل'}
                                </button>
                            </div>
                        )}

                        {/* Coupon */}
                        {coupon ? (
                            <div className="flex items-center justify-between bg-accent-pale rounded-lg px-3 py-2">
                                <span className="text-xs font-bold text-accent">🎟️ {coupon.code} — خصم {coupon.discount}₪</span>
                                <button onClick={removeCoupon} className="text-xs text-muted hover:text-red-500">✕</button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 px-3 py-2 border-2 border-cream-3 dark:border-white/10 focus:border-accent rounded-lg text-sm text-ink dark:text-cream bg-cream dark:bg-ink outline-none"
                                    placeholder="كود الخصم (اختياري)"
                                    value={couponCode}
                                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                />
                                <button onClick={applyCoupon} disabled={couponChecking || !couponCode.trim()}
                                    className="px-4 bg-cream-2 dark:bg-ink-2 border-2 border-cream-3 dark:border-white/10 rounded-lg text-xs font-bold text-ink dark:text-cream hover:border-accent transition-colors disabled:opacity-50">
                                    {couponChecking ? '⏳' : 'تطبيق'}
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted">{t('totalLabel')}</span>
                            <div className="text-left">
                                {coupon && <span className="block text-xs text-muted line-through">{total}₪</span>}
                                <span className="text-xl font-black text-ink dark:text-cream">{finalTotal}₪</span>
                            </div>
                        </div>

                        <Button variant="dark" className="w-full py-3" onClick={confirmOrder} disabled={loading}>
                            {loading ? t('sending') : t('confirmOrder')}
                        </Button>
                        {siteSettings?.whatsapp_number && (
                            <Button variant="wa" className="w-full py-2.5" onClick={orderViaWA}>
                                {t('orderViaWABtn')}
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <Toast message={toast.msg} show={toast.show} />
        </>
    );
}
