'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

// Định nghĩa thuật ngữ chuyên môn
export const GLOSSARY: Record<string, { vi: string; en: string; explanation: string }> = {
    'Canthal Tilt': {
        vi: 'Độ nghiêng đuôi mắt',
        en: 'Canthal Tilt',
        explanation: 'Góc nghiêng từ khóe mắt trong đến khóe mắt ngoài. Nghiêng dương (+) tạo "hunter eyes" (mắt săn mồi) hấp dẫn. Lý tưởng: +4° đến +8°.'
    },
    'canthal tilt': {
        vi: 'Độ nghiêng đuôi mắt',
        en: 'Canthal Tilt',
        explanation: 'Góc nghiêng từ khóe mắt trong đến khóe mắt ngoài. Nghiêng dương (+) tạo "hunter eyes" (mắt săn mồi) hấp dẫn. Lý tưởng: +4° đến +8°.'
    },
    'Gonial Angle': {
        vi: 'Góc hàm',
        en: 'Gonial Angle',
        explanation: 'Góc tạo bởi xương hàm dưới tại điểm góc hàm. Góc nhỏ hơn (125-130°) cho hàm vuông, mạnh mẽ hơn.'
    },
    'gonial angle': {
        vi: 'Góc hàm',
        en: 'Gonial Angle',
        explanation: 'Góc tạo bởi xương hàm dưới tại điểm góc hàm. Góc nhỏ hơn (125-130°) cho hàm vuông, mạnh mẽ hơn.'
    },
    'Bigonial': {
        vi: 'Chiều rộng hàm',
        en: 'Bigonial Width',
        explanation: 'Khoảng cách giữa hai góc hàm. Tỷ lệ với gò má (75-80%) tạo khuôn mặt cân đối.'
    },
    'Bizygomatic': {
        vi: 'Chiều rộng gò má',
        en: 'Bizygomatic Width',
        explanation: 'Khoảng cách giữa hai gò má. Gò má cao và rộng là dấu hiệu của khuôn mặt hấp dẫn.'
    },
    'Midface Ratio': {
        vi: 'Tỷ lệ giữa mặt',
        en: 'Midface Ratio',
        explanation: 'Tỷ lệ phần giữa mặt (từ mắt đến môi) so với tổng chiều cao mặt. Lý tưởng: 43-44%.'
    },
    'midface ratio': {
        vi: 'Tỷ lệ giữa mặt',
        en: 'Midface Ratio',
        explanation: 'Tỷ lệ phần giữa mặt (từ mắt đến môi) so với tổng chiều cao mặt. Lý tưởng: 43-44%.'
    },
    'hunter eyes': {
        vi: 'Mắt săn mồi',
        en: 'Hunter Eyes',
        explanation: 'Kiểu mắt hấp dẫn với đuôi mắt nghiêng lên, tạo ánh nhìn sắc bén, mạnh mẽ. Ngược với "prey eyes" (mắt con mồi).'
    },
    'mewing': {
        vi: 'Mewing',
        en: 'Mewing',
        explanation: 'Kỹ thuật đặt lưỡi đúng tư thế (ép sát vòm miệng) để cải thiện cấu trúc hàm và khuôn mặt theo thời gian.'
    },
    'failo': {
        vi: 'Failo (Điểm yếu)',
        en: 'Failo',
        explanation: 'Đặc điểm tiêu cực ảnh hưởng đến ngoại hình tổng thể. Ngược với "halo".'
    },
    'halo': {
        vi: 'Halo (Điểm mạnh)',
        en: 'Halo',
        explanation: 'Đặc điểm tích cực nổi bật, "che phủ" các điểm yếu khác. Ngược với "failo".'
    },
    'softmaxxing': {
        vi: 'Softmaxxing',
        en: 'Softmaxxing',
        explanation: 'Các phương pháp cải thiện ngoại hình không phẫu thuật: skincare, tóc, fitness, thời trang, grooming.'
    },
    'hardmaxxing': {
        vi: 'Hardmaxxing',
        en: 'Hardmaxxing',
        explanation: 'Các phương pháp phẫu thuật/thủ thuật y tế: rhinoplasty, filler, botox, phẫu thuật hàm.'
    },
    'Sub3': {
        vi: 'Sub 3',
        en: 'Sub 3',
        explanation: 'Điểm 1.0-2.9. Kém phát triển khuôn mặt nghiêm trọng, nhiều failo đáng kể.'
    },
    'Sub5': {
        vi: 'Sub 5',
        en: 'Sub 5',
        explanation: 'Điểm 3.0-4.9. Dưới trung bình, có failo ảnh hưởng đến ngoại hình.'
    },
    'LTN': {
        vi: 'Low-Tier Normie',
        en: 'LTN',
        explanation: 'Điểm 5.0-5.4. Trung bình thấp, không nổi bật.'
    },
    'MTN': {
        vi: 'Mid-Tier Normie',
        en: 'MTN',
        explanation: 'Điểm 5.5-5.9. Trung bình, bình thường.'
    },
    'HTN': {
        vi: 'High-Tier Normie',
        en: 'HTN',
        explanation: 'Điểm 6.0-6.9. Trung bình cao, một số nét hấp dẫn.'
    },
    'Chadlite': {
        vi: 'Chadlite',
        en: 'Chadlite',
        explanation: 'Điểm 7.0-7.9. Hấp dẫn, phần lớn là nét tích cực.'
    },
    'Chad': {
        vi: 'Chad',
        en: 'Chad',
        explanation: 'Điểm 8.0-8.9. Rất hấp dẫn, hài hòa xuất sắc.'
    },
    'Adam': {
        vi: 'Adam',
        en: 'Adam',
        explanation: 'Điểm 9.0-10.0. Thẩm mỹ gần hoàn hảo, đỉnh cao nhan sắc.'
    },
    'Nasofrontal Angle': {
        vi: 'Góc mũi-trán',
        en: 'Nasofrontal Angle',
        explanation: 'Góc giữa trán và sống mũi tại điểm nasion. Lý tưởng: 130-135°.'
    },
    'Facial Thirds': {
        vi: 'Ba phần mặt',
        en: 'Facial Thirds',
        explanation: 'Chia khuôn mặt thành 3 phần bằng nhau: trán, giữa mặt, phần dưới. Lý tưởng: mỗi phần 33.3%.'
    },
    'IPD': {
        vi: 'Khoảng cách 2 mắt',
        en: 'Inter-Pupillary Distance',
        explanation: 'Khoảng cách giữa hai đồng tử. Ảnh hưởng đến sự cân đối tổng thể.'
    }
};

interface TooltipTermProps {
    term: string;
    children?: React.ReactNode;
}

export function TooltipTerm({ term, children }: TooltipTermProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const glossaryItem = GLOSSARY[term] || GLOSSARY[term.toLowerCase()];

    if (!glossaryItem) {
        return <span>{children || term}</span>;
    }

    return (
        <span
            className="relative inline-flex items-center gap-1 cursor-help border-b border-dashed border-primary/50 text-primary"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={() => setIsOpen(!isOpen)}
        >
            {children || term}
            <Info className="w-3 h-3 opacity-60" />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-xl"
                    >
                        <div className="text-xs">
                            <div className="font-semibold text-foreground mb-1">
                                {glossaryItem.vi}
                            </div>
                            <div className="text-[10px] text-muted-foreground mb-2">
                                {glossaryItem.en}
                            </div>
                            <div className="text-muted-foreground leading-relaxed">
                                {glossaryItem.explanation}
                            </div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                            <div className="border-8 border-transparent border-t-border" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}

// Helper function to highlight terms in text
export function highlightTerms(text: string): React.ReactNode[] {
    const terms = Object.keys(GLOSSARY);
    const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');

    const parts = text.split(regex);

    return parts.map((part, index) => {
        const matchedTerm = terms.find(t => t.toLowerCase() === part.toLowerCase());
        if (matchedTerm) {
            return <TooltipTerm key={index} term={matchedTerm}>{part}</TooltipTerm>;
        }
        return <span key={index}>{part}</span>;
    });
}
