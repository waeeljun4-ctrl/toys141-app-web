// ── رسالة الواتساب الافتراضية
export const waMsg = (productName, size, price) => {
    const sizeStr = size ? `\n- المقاس: ${size}` : '';
    const priceStr = price ? `\n- السعر: ${price}₪` : '';
    return `مرحباً TOYS 141 👋\nأريد الاستفسار عن:\n- المنتج: ${productName}${sizeStr}${priceStr}\n\nبانتظار ردّكم 🙏`;
};

// ── رقم الواتساب يُقرأ الآن من إعدادات الإدارة (siteSettings.whatsapp_number) ويُمرَّر هنا كمعامل
export const WA_LINK = (msg, number) => `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;

// ── تحويل رقم الهاتف لرقم واتساب صحيح ──
// يرجع: { waNumber: '970xxxxxxxx' | '972xxxxxxxx' | null, error: string | null }
export function parsePhone(raw) {
    if (!raw) return { waNumber: null, error: 'أدخل رقم الواتساب' };

    // نظّف الرقم من المسافات والشرطات والأقواس
    const cleaned = raw.replace(/[\s\-().]/g, '');
    const digits  = cleaned.replace(/\D/g, '');

    if (digits.length < 10) {
        return { waNumber: null, error: 'الرقم قصير جداً — الحد الأدنى ١٠ أرقام' };
    }

    // مقدمة دولية موجودة مسبقاً
    if (/^(\+|00)?970/.test(cleaned)) {
        const local = digits.replace(/^00970|^970/, '');
        return { waNumber: '970' + local, error: null };
    }
    if (/^(\+|00)?972/.test(cleaned)) {
        const local = digits.replace(/^00972|^972/, '');
        return { waNumber: '972' + local, error: null };
    }

    // شبكات فلسطينية — جوال 059 / أوريدو 056
    if (/^0(59|56)/.test(cleaned)) {
        return { waNumber: '970' + digits.slice(1), error: null };
    }

    // شبكات إسرائيلية — 050 / 052 / 053 / 054 / 055 / 057 / 058
    if (/^0(50|52|53|54|55|57|58)/.test(cleaned)) {
        return { waNumber: '972' + digits.slice(1), error: null };
    }

    // رقم غير معروف المقدمة — نستخدمه كما هو
    return { waNumber: digits, error: null };
}
