import { useState, useMemo, useRef, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CartProvider, useCart } from '../../Components/CartContext';
import { WishlistProvider, useWishlist } from '../../Components/WishlistContext';
import { LocaleProvider, useLocale } from '../../Components/LocaleContext';
import { ThemeProvider, useTheme } from '../../Components/ThemeContext';
import { localField } from '../../i18n';
import CartDrawer from '../../Components/CartDrawer';
import WishlistDrawer from '../../Components/WishlistDrawer';
import ProductCard from '../../Components/ProductCard';
import WhatsAppButton from '../../Components/WhatsAppButton';
import InstallBanner from '../../Components/InstallBanner';

function scrollCats(ref, dir, direction) {
    const el = ref.current;
    if (!el) return;
    const amount = 260 * (dir === 'rtl' ? -1 : 1) * direction;
    el.scrollBy({ left: amount, behavior: 'smooth' });
}

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} aria-label="toggle theme"
            className="w-9 h-9 rounded-xl bg-cream-2 dark:bg-ink-2 border border-cream-3 dark:border-white/10 flex items-center justify-center text-sm text-ink dark:text-cream hover:bg-accent-pale hover:border-accent hover:text-accent transition-colors shrink-0">
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    );
}

function AdminLink() {
    const { auth } = usePage().props;
    const { t } = useLocale();
    if (auth?.user?.role !== 'admin') return null;
    return (
        <a href={route('admin.dashboard')} title={t('dashboardTooltip')}
            className="w-9 h-9 rounded-xl bg-cream-2 dark:bg-ink-2 border border-cream-3 dark:border-white/10 flex items-center justify-center text-sm text-ink dark:text-cream hover:bg-accent-pale hover:border-accent hover:text-accent transition-colors shrink-0">
            ⚙️
        </a>
    );
}

function AccountLink() {
    const { auth } = usePage().props;
    const { t } = useLocale();
    const [open, setOpen] = useState(false);
    const user = auth?.user;

    if (!user) {
        return (
            <a href="/login" title={t('loginTooltip')}
                className="w-9 h-9 rounded-xl bg-cream-2 dark:bg-ink-2 border border-cream-3 dark:border-white/10 flex items-center justify-center text-sm text-ink dark:text-cream hover:bg-accent-pale hover:border-accent hover:text-accent transition-colors shrink-0">
                👤
            </a>
        );
    }

    if (user.role === 'admin') return null; // للأدمن زر لوحة التحكم بديل عنه

    return (
        <div className="relative">
            <button onClick={() => setOpen(o => !o)} title={user.name}
                className="w-9 h-9 rounded-xl bg-cream-2 dark:bg-ink-2 border border-cream-3 dark:border-white/10 flex items-center justify-center text-sm font-black text-ink dark:text-cream hover:bg-accent-pale hover:border-accent hover:text-accent transition-colors shrink-0">
                {user.name?.[0] || '👤'}
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute top-full mt-1.5 end-0 bg-white dark:bg-ink-2 border border-cream-3 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden min-w-[170px]">
                        <div className="px-3.5 py-2.5 border-b border-cream-3 dark:border-white/10">
                            <p className="text-sm font-bold text-ink dark:text-cream truncate">{user.name}</p>
                        </div>
                        <Link href="/logout" method="post" as="button"
                            className="w-full text-right px-3.5 py-2.5 text-sm font-bold text-red-500 hover:bg-cream-2 dark:hover:bg-ink transition-colors">
                            {t('logout')}
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

const LANGS = [
    { code: 'ar', label: 'ع',  full: 'العربية' },
    { code: 'he', label: 'ע',  full: 'עברית'   },
    { code: 'en', label: 'EN', full: 'English'  },
];

function LangPicker() {
    const { locale, setLocale } = useLocale();
    const [open, setOpen] = useState(false);
    const current = LANGS.find(l => l.code === locale) ?? LANGS[0];

    return (
        <div className="relative">
            <button onClick={() => setOpen(o => !o)}
                className="w-9 h-9 rounded-xl bg-cream-2 dark:bg-ink-2 border border-cream-3 dark:border-white/10 flex items-center justify-center text-sm font-bold text-ink dark:text-cream hover:bg-accent-pale hover:border-accent hover:text-accent transition-colors shrink-0">
                {current.label}
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute top-full mt-1.5 end-0 bg-white dark:bg-ink-2 border border-cream-3 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden min-w-[130px]">
                        {LANGS.map(l => (
                            <button key={l.code} onClick={() => { setLocale(l.code); setOpen(false); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold transition-colors ${locale === l.code ? 'bg-accent-pale text-accent' : 'text-ink dark:text-cream hover:bg-cream-2 dark:hover:bg-ink'}`}>
                                <span className="font-mono w-6 text-center shrink-0">{l.label}</span>
                                <span>{l.full}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ── Hero Slider ──
// Warm, bright, family-friendly base (not dark/moody) with soft pastel blurred orbs layered
// on top for depth — keeps the premium "layered" technique but in colors that actually read
// as toys/kids/family rather than a tech or luxury brand.
const HERO_BASES = [
    'from-orange-100 via-rose-100 to-amber-50',
    'from-pink-100 via-fuchsia-50 to-orange-50',
    'from-amber-50 via-yellow-50 to-rose-50',
];
const HERO_ORBS = [
    ['bg-accent/25', 'bg-yellow-300/40'],
    ['bg-pink-400/25', 'bg-orange-300/35'],
    ['bg-rose-300/30', 'bg-accent/20'],
];

function HeroSlider({ slides }) {
    const { locale, dict } = useLocale();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (slides.length < 2) return;
        const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (slides.length === 0) return null;

    function prev() { setCurrent(c => (c - 1 + slides.length) % slides.length); }
    function next() { setCurrent(c => (c + 1) % slides.length); }

    return (
        <div className="relative overflow-hidden">
            <div dir="ltr" className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                {slides.map((s, i) => {
                    const title = localField(s, 'title', locale);
                    const subtitle = localField(s, 'subtitle', locale);
                    const ctaText = localField(s, 'cta_text', locale);
                    const [orb1, orb2] = HERO_ORBS[i % HERO_ORBS.length];
                    return (
                        <div key={s.id} dir={dict.dir}
                            style={s.image ? { backgroundImage: `linear-gradient(to bottom right, rgba(32,36,46,.6), rgba(32,36,46,.35)), url(/storage/${s.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                            className={`relative w-full shrink-0 px-6 py-20 sm:py-28 text-center overflow-hidden ${s.image ? '' : `bg-gradient-to-br ${HERO_BASES[i % HERO_BASES.length]}`}`}>
                            {!s.image && (
                                <>
                                    <div className={`absolute -top-16 -end-16 w-72 h-72 rounded-full ${orb1} blur-3xl`} />
                                    <div className={`absolute -bottom-20 -start-10 w-80 h-80 rounded-full ${orb2} blur-3xl`} />
                                </>
                            )}
                            <div className="relative">
                                <span className={`inline-block text-[11px] font-black tracking-[0.2em] uppercase rounded-full px-3 py-1 mb-4 ${s.image ? 'text-white bg-white/15 border border-white/20' : 'text-accent-dark bg-white/60 border border-white/70'}`}>
                                    TOYS 141
                                </span>
                                <h2 className={`font-display text-4xl sm:text-6xl font-bold mb-3 leading-tight ${s.image ? 'text-white' : 'text-ink'}`}>{title}</h2>
                                {subtitle && <p className={`text-sm sm:text-base max-w-md mx-auto mb-7 leading-relaxed ${s.image ? 'text-white/80' : 'text-ink/60'}`}>{subtitle}</p>}
                                {ctaText && (
                                    s.cta_link
                                        ? <a href={s.cta_link} className="inline-block bg-accent text-white font-black px-7 py-3 rounded-2xl shadow-lg shadow-accent/30 hover:bg-ink hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">{ctaText}</a>
                                        : <span className="inline-block bg-accent text-white font-black px-7 py-3 rounded-2xl shadow-lg shadow-accent/30">{ctaText}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {slides.length > 1 && (
                <>
                    <button onClick={prev} aria-label="prev"
                        className="absolute top-1/2 -translate-y-1/2 end-3 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-ink flex items-center justify-center backdrop-blur-md border border-white shadow-sm transition-colors">›</button>
                    <button onClick={next} aria-label="next"
                        className="absolute top-1/2 -translate-y-1/2 start-3 w-10 h-10 rounded-full bg-white/70 hover:bg-white text-ink flex items-center justify-center backdrop-blur-md border border-white shadow-sm transition-colors">‹</button>
                    <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
                        {slides.map((_, i) => (
                            <button key={i} onClick={() => setCurrent(i)} aria-label={`slide ${i+1}`}
                                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-accent w-7' : 'bg-ink/20 w-2'}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function StoreContent({ heroSlides, categories, brands, products }) {
    const { count, setOpen: setCartOpen } = useCart();
    const { count: wishCount, setOpen: setWishOpen } = useWishlist();
    const { locale, t, dict } = useLocale();
    const { siteSettings } = usePage().props;
    const [activeCat, setActiveCat] = useState('all');
    const [expandedParent, setExpandedParent] = useState(null);
    const [activeBrand, setActiveBrand] = useState(null);
    const [search, setSearch] = useState('');
    const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false);
    const catsRef = useRef(null);

    const topLevelCats = useMemo(() => categories.filter(c => !c.parent_id), [categories]);
    const childCatsOf = (parentId) => categories.filter(c => c.parent_id === parentId);

    // صنف رئيسي محدد → يشمل منتجاته + منتجات أصنافه الفرعية كلها
    const activeCategoryIds = useMemo(() => {
        if (activeCat === 'all') return null;
        const cat = categories.find(c => c.key === activeCat);
        if (!cat) return null;
        if (cat.parent_id) return [cat.id];
        return [cat.id, ...childCatsOf(cat.id).map(c => c.id)];
    }, [activeCat, categories]);

    function selectCategory(cat) {
        const kids = childCatsOf(cat.id);
        setActiveCat(cat.key);
        setExpandedParent(kids.length ? cat.id : null);
    }

    const filtered = useMemo(() => products.filter(p => {
        const catOk = activeCat === 'all' || activeCategoryIds?.includes(p.category_id);
        const brandOk = !activeBrand || p.brand?.id === activeBrand;
        const q = search.trim();
        const name = localField(p, 'name', locale);
        const desc = localField(p, 'description', locale);
        const searchOk = !q || name.includes(q) || desc.includes(q) || (p.brand?.name || '').toLowerCase().includes(q.toLowerCase());
        return catOk && brandOk && searchOk;
    }), [products, activeCat, activeCategoryIds, activeBrand, search, locale]);

    const catTitle = activeCat === 'all' ? t('allProducts') : (localField(categories.find(c => c.key === activeCat), 'name', locale) || t('allProducts'));
    const fontClass = locale === 'ar' ? 'font-cairo' : '';

    return (
        <div className={`min-h-screen bg-cream dark:bg-ink transition-colors ${fontClass}`}>
            <Head title={t('storeTitle')} />
            {/* Top bar */}
            <div className="bg-ink text-center text-xs py-2 text-white/50 tracking-wide">
                🚚 {t('topBanner')}
            </div>

            <nav className="sticky top-0 z-30 bg-white/90 dark:bg-ink/90 backdrop-blur-xl border-b border-cream-3 dark:border-white/10 h-16 flex items-center justify-between px-4 sm:px-6 gap-4">
                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setWishOpen(true)}
                        className="relative bg-cream-2 dark:bg-ink-2 border border-cream-3 dark:border-white/10 text-ink dark:text-cream w-9 h-9 rounded-xl flex items-center justify-center hover:bg-accent-pale hover:border-accent hover:text-accent transition-colors">
                        ♡
                        {wishCount > 0 && (
                            <span className="absolute -top-1 -end-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishCount}</span>
                        )}
                    </button>
                    <LangPicker />
                    <ThemeToggle />
                    <AdminLink />
                    <AccountLink />
                    <button onClick={() => setCartOpen(true)}
                        className="relative bg-ink text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-accent transition-colors shadow-sm">
                        🛒
                        {count > 0 && (
                            <span className="absolute -top-1 -end-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{count}</span>
                        )}
                    </button>
                </div>

                <div className="hidden sm:flex flex-1 items-center gap-2.5 bg-cream-2 dark:bg-ink-2 rounded-full px-4 py-2.5 max-w-md border border-transparent focus-within:border-accent focus-within:bg-white dark:focus-within:bg-ink transition-colors">
                    <span className="text-muted text-sm shrink-0">🔍</span>
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder={t('searchPlaceholder')}
                        className="bg-transparent outline-none border-0 appearance-none text-sm text-ink dark:text-cream w-full" />
                </div>

                <a href="/" className="flex items-center gap-2 shrink-0">
                    <span className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white text-sm font-black shadow-sm shadow-accent/30">🧸</span>
                    <span className="font-display text-xl font-bold text-ink dark:text-cream">
                        TOYS<span className="text-accent">.141</span>
                    </span>
                </a>
            </nav>

            {/* Mobile search bar (own row — was squeezed into the nav row before) */}
            <div className="sm:hidden sticky top-16 z-20 bg-white dark:bg-ink border-b border-cream-3 dark:border-white/10 h-14 flex items-center px-4">
                <div className="w-full flex items-center gap-2.5 bg-cream-2 dark:bg-ink-2 rounded-full px-4 py-2 transition-colors">
                    <span className="text-muted text-sm shrink-0">🔍</span>
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder={t('searchPlaceholder')}
                        className="bg-transparent outline-none border-0 appearance-none text-sm text-ink dark:text-cream w-full" />
                </div>
            </div>

            {/* Mobile category pills */}
            <div className="sm:hidden sticky top-[120px] z-20 bg-white dark:bg-ink border-b border-cream-3 dark:border-white/10">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-2.5">
                    <button onClick={() => { setActiveCat('all'); setExpandedParent(null); }}
                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-bold border-[1.5px] transition-colors ${activeCat === 'all' ? 'bg-ink text-white border-ink' : 'bg-cream dark:bg-ink-2 border-cream-3 dark:border-white/10 text-muted'}`}>
                        {t('allProducts')}
                    </button>
                    {topLevelCats.map(cat => (
                        <button key={cat.id} onClick={() => selectCategory(cat)}
                            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold border-[1.5px] whitespace-nowrap transition-colors ${activeCat === cat.key ? 'bg-ink text-white border-ink' : 'bg-cream dark:bg-ink-2 border-cream-3 dark:border-white/10 text-muted'}`}>
                            <span>{cat.icon}</span>{localField(cat, 'name', locale)}
                        </button>
                    ))}
                    <button onClick={() => setMobileBrandsOpen(true)}
                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-bold border-[1.5px] transition-colors ${activeBrand ? 'bg-accent text-white border-accent' : 'bg-cream dark:bg-ink-2 border-cream-3 dark:border-white/10 text-muted'}`}>
                        {t('brandsLabel')} {activeBrand ? '●' : ''}
                    </button>
                </div>
            </div>

            {/* Hero slider */}
            <HeroSlider slides={heroSlides} />

            {/* Playful wave divider */}
            <svg viewBox="0 0 1440 48" className="w-full h-6 sm:h-10 block text-white dark:text-ink-2" preserveAspectRatio="none">
                <path fill="currentColor" d="M0,24 C240,48 480,0 720,12 C960,24 1200,48 1440,24 L1440,48 L0,48 Z" />
            </svg>

            {/* Trust badges */}
            <div className="bg-white dark:bg-ink-2 border-b border-cream-3 dark:border-white/10 relative">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-7 px-4 py-8 max-w-6xl mx-auto">
                    {dict.trustBadges.map((b, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-pale to-accent/10 dark:from-accent/15 dark:to-accent/5 flex items-center justify-center text-xl shrink-0 shadow-sm">{b.icon}</div>
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-black text-ink dark:text-cream mb-0.5">{b.title}</p>
                                <p className="text-[11px] sm:text-xs text-muted leading-relaxed">{b.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories showcase — carousel */}
            <div className="py-14 px-4 bg-cream-2/60 dark:bg-transparent">
                <p className="text-center text-accent text-xs font-black tracking-[0.2em] uppercase mb-2">{t('browseByType')}</p>
                <h2 className="font-display text-3xl font-bold text-ink dark:text-cream text-center mb-8">{t('categoriesLabel')}</h2>
                <div className="relative max-w-6xl mx-auto">
                    <button onClick={() => scrollCats(catsRef, dict.dir, 1)}
                        className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -end-4 z-10 w-9 h-9 rounded-full bg-white dark:bg-ink-2 border border-cream-3 dark:border-white/10 shadow-md items-center justify-center text-ink dark:text-cream hover:bg-accent hover:text-white hover:border-accent transition-colors">›</button>
                    <button onClick={() => scrollCats(catsRef, dict.dir, -1)}
                        className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -start-4 z-10 w-9 h-9 rounded-full bg-white dark:bg-ink-2 border border-cream-3 dark:border-white/10 shadow-md items-center justify-center text-ink dark:text-cream hover:bg-accent hover:text-white hover:border-accent transition-colors">‹</button>

                    <div ref={catsRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-1 pb-2">
                        <button onClick={() => { setActiveCat('all'); setExpandedParent(null); }}
                            className="shrink-0 flex flex-col items-center gap-2 w-24 group snap-start">
                            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-3xl bg-ink transition-all duration-300 border-2 ${activeCat==='all' ? 'border-accent shadow-lg shadow-accent/20 scale-105' : 'border-transparent group-hover:border-accent-light'}`}>
                                🛍️
                            </div>
                            <span className={`text-xs font-bold text-center leading-tight ${activeCat==='all' ? 'text-accent' : 'text-muted'}`}>{t('allProducts')}</span>
                        </button>
                        {topLevelCats.map(cat => {
                            const active = activeCat === cat.key;
                            const name = localField(cat, 'name', locale);
                            const kidsCount = childCatsOf(cat.id).length;
                            return (
                                <button key={cat.id} onClick={() => selectCategory(cat)}
                                    className="shrink-0 flex flex-col items-center gap-2 w-24 group snap-start">
                                    <div className={`relative w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center text-3xl transition-all duration-300 border-2 ${active ? 'border-accent shadow-lg shadow-accent/20 scale-105' : 'border-cream-3 dark:border-white/10 group-hover:border-accent-light'} ${cat.image ? '' : 'bg-gradient-to-br from-cream-2 to-cream-3 dark:from-ink-2 dark:to-ink'}`}>
                                        {cat.image
                                            ? <img src={`/storage/${cat.image}`} alt={name} className="w-full h-full object-cover" />
                                            : (cat.icon || '📦')
                                        }
                                        {kidsCount > 0 && (
                                            <span className="absolute bottom-1 end-1 bg-white/90 text-accent text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">{kidsCount}</span>
                                        )}
                                    </div>
                                    <span className={`text-xs font-bold text-center leading-tight ${active ? 'text-accent' : 'text-muted'}`}>{name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Sub-categories row — تظهر لما تختار صنف رئيسي عنده أصناف فرعية */}
                    {expandedParent && childCatsOf(expandedParent).length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                            {childCatsOf(expandedParent).map(child => {
                                const activeChild = activeCat === child.key;
                                return (
                                    <button key={child.id} onClick={() => setActiveCat(child.key)}
                                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border-[1.5px] transition-colors ${activeChild ? 'bg-accent text-white border-accent' : 'bg-cream dark:bg-ink-2 border-cream-3 dark:border-white/10 text-muted hover:border-accent hover:text-accent'}`}>
                                        {child.icon} {localField(child, 'name', locale)}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex">
                {/* Main content */}
                <main className="flex-1 min-w-0">
                    <div className="flex items-center justify-between px-4 mt-4 mb-3 gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                            <h2 className="font-black text-ink dark:text-cream truncate">{catTitle}</h2>
                            {activeCat !== 'all' && (
                                <button onClick={() => { setActiveCat('all'); setExpandedParent(null); }} className="text-xs text-accent font-bold hover:underline shrink-0">✕ {t('allProducts')}</button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => setMobileBrandsOpen(true)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border-[1.5px] transition-colors ${activeBrand ? 'bg-accent text-white border-accent' : 'bg-cream dark:bg-ink-2 border-cream-3 dark:border-white/10 text-muted hover:border-accent hover:text-accent'}`}>
                                🏷️ {t('brandsLabel')} {activeBrand ? '●' : ''}
                            </button>
                            <span className="text-xs text-muted">{dict.productsCount(filtered.length)}</span>
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-muted">
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="text-sm">{t('noResults')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-3 pb-10">
                            {filtered.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}

                    <FAQ />
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-ink pt-14 pb-8 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10 text-center sm:text-start">
                    {/* Brand */}
                    <div className="col-span-2 sm:col-span-1">
                        <p className="font-black text-white text-xl mb-2">
                            TOYS<span className="text-accent">.141</span>
                        </p>
                        <p className="text-white/40 text-xs leading-relaxed max-w-[220px] mx-auto sm:mx-0">{t('footerDesc')}</p>
                    </div>

                    {/* Categories */}
                    <div>
                        <p className="text-white text-xs font-black tracking-widest uppercase mb-3">{t('categoriesLabel')}</p>
                        <ul className="space-y-2">
                            {topLevelCats.slice(0, 5).map(cat => (
                                <li key={cat.id}>
                                    <button onClick={() => { setActiveCat(cat.key); setExpandedParent(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="text-white/40 hover:text-accent text-xs transition-colors">
                                        {localField(cat, 'name', locale)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <p className="text-white text-xs font-black tracking-widest uppercase mb-3">{t('linksHeading')}</p>
                        <ul className="space-y-2">
                            <li><a href="/privacy" className="text-white/40 hover:text-accent text-xs transition-colors">{t('privacyPolicy')}</a></li>
                            <li><a href="/terms" className="text-white/40 hover:text-accent text-xs transition-colors">{t('termsOfUse')}</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="text-white text-xs font-black tracking-widest uppercase mb-3">{t('contactUsHeading')}</p>
                        <div className="flex flex-col items-center sm:items-start gap-2">
                            {siteSettings?.whatsapp_number && (
                                <a href={`https://wa.me/${siteSettings.whatsapp_number}`} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-2 rounded-xl hover:bg-green-500 hover:text-white transition-colors">
                                    {t('footerWA')}
                                </a>
                            )}
                            {siteSettings?.instagram_url && (
                                <a href={siteSettings.instagram_url} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 bg-white/5 text-white/40 border border-white/10 text-xs font-bold px-3 py-2 rounded-xl hover:bg-accent hover:text-white hover:border-accent transition-colors">
                                    {t('footerInsta')}
                                </a>
                            )}
                            {siteSettings?.tiktok_url && (
                                <a href={siteSettings.tiktok_url} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 bg-white/5 text-white/40 border border-white/10 text-xs font-bold px-3 py-2 rounded-xl hover:bg-accent hover:text-white hover:border-accent transition-colors">
                                    {t('footerTikTok')}
                                </a>
                            )}
                            {siteSettings?.facebook_url && (
                                <a href={siteSettings.facebook_url} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 bg-white/5 text-white/40 border border-white/10 text-xs font-bold px-3 py-2 rounded-xl hover:bg-accent hover:text-white hover:border-accent transition-colors">
                                    {t('footerFacebook')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto border-t border-white/10 pt-6 text-center">
                    <p className="text-white/20 text-xs">{dict.footerCopy(new Date().getFullYear())}</p>
                </div>
            </footer>

            {/* Brands sheet — bottom sheet on mobile, centered modal on desktop */}
            {mobileBrandsOpen && (
                <div className="fixed inset-0 z-40 bg-ink/50 flex items-end sm:items-center sm:justify-center" onClick={() => setMobileBrandsOpen(false)}>
                    <div className="bg-white dark:bg-ink-2 w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <p className="font-black text-ink dark:text-cream mb-3">{t('brandsLabel')}</p>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => { setActiveBrand(null); setMobileBrandsOpen(false); }}
                                className={`px-3 py-1.5 rounded-full text-sm font-bold border-[1.5px] ${!activeBrand ? 'bg-ink text-white border-ink' : 'border-cream-3 dark:border-white/10 text-muted'}`}>
                                {t('allBrandsLabel')}
                            </button>
                            {brands.map(b => (
                                <button key={b.id} onClick={() => { setActiveBrand(b.id); setMobileBrandsOpen(false); }}
                                    className={`px-3 py-1.5 rounded-full text-sm font-bold border-[1.5px] ${activeBrand === b.id ? 'bg-ink text-white border-ink' : 'border-cream-3 dark:border-white/10 text-muted'}`}>
                                    {b.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Overlays */}
            <CartDrawer />
            <WishlistDrawer onOpenProduct={p => router.visit(`/product/${p.id}`)} />
            <WhatsAppButton />
        </div>
    );
}

function FAQ() {
    const { t, dict } = useLocale();
    const [open, setOpen] = useState(null);

    return (
        <section className="bg-cream dark:bg-ink py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <p className="text-accent text-xs font-black tracking-[0.2em] uppercase text-center mb-2">{t('faqEyebrow')}</p>
                <h2 className="font-display text-3xl font-bold text-ink dark:text-cream text-center mb-8">{t('faqTitle')}</h2>
                <div className="space-y-2">
                    {dict.faqs.map((f, i) => (
                        <div key={i} className="bg-white dark:bg-ink-2 rounded-2xl border border-cream-3 dark:border-white/10 overflow-hidden">
                            <button onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-center justify-between px-5 py-4 text-start font-bold text-sm text-ink dark:text-cream hover:text-accent transition-colors">
                                <span>{f.q}</span>
                                <span className={`text-accent transition-transform duration-200 shrink-0 ms-3 ${open === i ? 'rotate-45' : ''}`}>+</span>
                            </button>
                            {open === i && (
                                <div className="px-5 pb-4 text-sm text-muted leading-relaxed border-t border-cream-3 dark:border-white/10 pt-3">
                                    {f.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Index({ heroSlides, categories, brands, products }) {
    return (
        <ThemeProvider>
            <LocaleProvider>
                <WishlistProvider>
                    <CartProvider>
                        <StoreContent heroSlides={heroSlides} categories={categories} brands={brands} products={products} />
                        <InstallBanner />
                    </CartProvider>
                </WishlistProvider>
            </LocaleProvider>
        </ThemeProvider>
    );
}
