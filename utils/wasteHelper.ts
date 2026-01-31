export const getWasteCategoryStyle = (category: string) => {
    const normalized = category?.trim();

    if (normalized === "Chất thải rắn có khả năng tái sử dụng, tái chế") {
        return {
            label: "Rác tái chế",
            color: "#16a34a",
            bgColor: "#dcfce7",
            borderColor: "#bbf7d0"
        };
    }

    if (normalized === "Chất thải thực phẩm") {
        return {
            label: "Rác thực phẩm",
            color: "#ea580c",
            bgColor: "#ffedd5",
            borderColor: "#fed7aa"
        };
    }

    if (normalized === "Chất thải rắn sinh hoạt khác") {
        return {
            label: "Rác khác",
            color: "#dc2626",
            bgColor: "#fee2e2",
            borderColor: "#fecaca"
        };
    }

    return {
        label: "Chưa phân loại",
        color: "#64748b",
        bgColor: "#f1f5f9",
        borderColor: "#e2e8f0"
    };
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};