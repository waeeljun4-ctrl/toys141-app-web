import { useWishlist } from './WishlistContext';
import { useLocale } from './LocaleContext';

export default function WishlistDrawer({ onOpenProduct }) {
    const { items, remove, open, setOpen } = useWishlist();
    const { t } = useLocale();

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            )}

            <div className={`fixed top-0 right-0 bottom-0 w-[360px] max-w-full bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300
                ${open ? 'translate-x-0' : 'translate-x-full'}`}>

                <div className="flex items-center justify-between px-5 py-4 border-b border-cream-3 shrink-0">
                    <h3 className="font-bold text-base text-ink flex items-center gap-2">
                        ♡ {t('wishlistTitle')}
                        {items.length > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{items.length}</span>
                        )}
                    </h3>
                    <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-cream-2 text-ink flex items-center justify-center hover:bg-cream-3">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3">
                    {!items.length ? (
                        <div className="text-center py-14 text-muted">
                            <div className="text-4xl mb-3">🤍</div>
                            <p className="text-sm">{t('wishlistEmpty')}</p>
                        </div>
                    ) : items.map(item => (
                        <div key={item.id} className="flex gap-3 py-3 border-b border-cream-3 items-center">
                            <button
                                className="w-14 h-14 bg-cream-2 rounded-xl flex items-center justify-center text-xl shrink-0 overflow-hidden"
                                onClick={() => { onOpenProduct?.(item); setOpen(false); }}>
                                {item.image ? <img src={`/storage/${item.image}`} alt={item.name} className="w-full h-full object-cover" /> : '👕'}
                            </button>
                            <button className="flex-1 min-w-0 text-start" onClick={() => { onOpenProduct?.(item); setOpen(false); }}>
                                <p className="text-sm font-bold text-ink truncate">{item.name}</p>
                                <p className="text-sm font-black text-accent mt-1">{item.price}₪</p>
                            </button>
                            <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-500 text-sm transition-colors">✕</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
