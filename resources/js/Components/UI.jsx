// ── Shared UI Components ──

export function Button({ children, variant = 'dark', className = '', ...props }) {
    const variants = {
        dark:    'bg-ink text-white hover:bg-accent',
        accent:    'bg-accent text-white hover:bg-accent-light',
        outline: 'bg-transparent text-ink border-2 border-cream-3 hover:border-accent hover:text-accent',
        ghost:   'bg-cream-2 text-ink hover:bg-cream-3',
        danger:  'bg-transparent text-gray-400 border border-cream-3 hover:text-red-500 hover:border-red-400',
        wa:      'bg-green-500 text-white hover:bg-green-600 flex items-center justify-center gap-2',
    };
    return (
        <button
            className={`px-4 py-2.5 rounded-xl font-cairo font-bold text-sm transition-all duration-200 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function Badge({ children, className = '' }) {
    return (
        <span className={`inline-block bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full ${className}`}>
            {children}
        </span>
    );
}

export function Input({ label, error, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-xs font-bold tracking-widest uppercase text-muted">{label}</label>}
            <input
                className={`w-full px-3 py-2 border-2 rounded-lg font-cairo text-sm text-ink bg-cream outline-none transition-colors
                    ${error ? 'border-red-400' : 'border-cream-3 focus:border-accent'}`}
                {...props}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}

export function Select({ label, error, children, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-xs font-bold tracking-widest uppercase text-muted">{label}</label>}
            <select
                className={`w-full px-3 py-2 border-2 rounded-lg font-cairo text-sm text-ink bg-cream outline-none transition-colors cursor-pointer
                    ${error ? 'border-red-400' : 'border-cream-3 focus:border-accent'}`}
                {...props}
            >
                {children}
            </select>
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}

export function Textarea({ label, error, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-xs font-bold tracking-widest uppercase text-muted">{label}</label>}
            <textarea
                className={`w-full px-3 py-2 border-2 rounded-lg font-cairo text-sm text-ink bg-cream outline-none transition-colors resize-y min-h-[72px]
                    ${error ? 'border-red-400' : 'border-cream-3 focus:border-accent'}`}
                {...props}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={`bg-white rounded-2xl w-full ${maxWidth} max-h-[88vh] overflow-y-auto shadow-2xl`}>
                <div className="flex items-center justify-between p-5 pb-0">
                    <h3 className="font-bold text-base text-ink">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-cream-2 text-ink flex items-center justify-center hover:bg-cream-3 transition-colors"
                    >✕</button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}

export function Toast({ message, show }) {
    return (
        <div className={`fixed bottom-5 right-5 z-50 bg-ink text-white rounded-xl px-4 py-3 flex items-center gap-2 text-sm shadow-xl transition-all duration-300 max-w-xs
            ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-14 pointer-events-none'}`}>
            <span>✅</span>
            <span>{message}</span>
        </div>
    );
}

export function StatusBadge({ status }) {
    const config = {
        pending:     { label: 'جديد',       color: 'bg-yellow-100 text-yellow-700' },
        confirmed:   { label: 'مؤكد',       color: 'bg-blue-100 text-blue-700' },
        in_progress: { label: 'قيد التنفيذ', color: 'bg-purple-100 text-purple-700' },
        ready:       { label: 'جاهز',        color: 'bg-green-100 text-green-700' },
        delivered:   { label: 'مسلّم',       color: 'bg-gray-100 text-gray-600' },
        cancelled:   { label: 'ملغي',        color: 'bg-red-100 text-red-600' },
    };
    const c = config[status] || config.pending;
    return (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.color}`}>{c.label}</span>
    );
}
