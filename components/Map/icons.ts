import L from "leaflet";

export const createDotIcon = () => L.divIcon({
    className: "custom-island-pin",
    html: `<div class="island-dot"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

export const createLabelIcon = (name: string) => L.divIcon({
    className: "custom-island-label",
    html: `<div class="island-label">${name}</div>`,
    iconSize: [200, 24],
    iconAnchor: [100, 12],
});

export const userIcon = L.divIcon({
    className: "custom-user-pin",
    html: `
        <div class="user-marker">
            <div class="user-marker-inner"></div>
        </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

export const wasteIcon = L.divIcon({
    className: "custom-waste-pin",
    html: `
        <div class="waste-marker">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15.3 3 14l1.3-4"/><path d="M14 3h4v4"/><path d="M11 21H7v-4"/><path d="m3 14 6-4"/><path d="m14 3 4 6"/><path d="m17 21-6-4"/><path d="M14 9.5a4 4 0 0 0-5 0"/><path d="M6 14.5a4 4 0 0 0 5 0"/><path d="M13 18.5a4 4 0 0 0 5 0"/></svg>
        </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});