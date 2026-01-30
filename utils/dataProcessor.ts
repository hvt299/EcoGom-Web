import { Schedule } from "../types/schedule";

export const processScheduleData = (allSchedules: Schedule[]) => {
    const groups: Record<string, string[]> = {};
    const wardSet = new Set<string>();

    allSchedules.forEach(s => {
        const wardName = s.ward ? s.ward.trim() : "";
        const villageName = s.village_name ? s.village_name.trim() : "";

        if (!wardName || !villageName) return;

        wardSet.add(wardName);

        if (!groups[wardName]) {
            groups[wardName] = [];
        }

        if (!groups[wardName].includes(villageName)) {
            groups[wardName].push(villageName);
        }
    });

    const wardList = Array.from(wardSet);

    let defaultWard = "";
    let defaultVillage = "";

    if (wardList.length > 0) {
        defaultWard = wardList[0];
        const villagesInFirstWard = groups[defaultWard];
        if (villagesInFirstWard && villagesInFirstWard.length > 0) {
            defaultVillage = villagesInFirstWard[0];
        }
    }

    return {
        groupedVillages: groups,
        wards: wardList,
        defaultWard,
        defaultVillage
    };
};