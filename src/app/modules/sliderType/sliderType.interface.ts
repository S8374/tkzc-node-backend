export interface ISliderType {
    name: string;          // e.g., "hero", "banner"
    description?: string;  // optional description
    isActive?: boolean;
    iconUrl?:string;
    gameType?: string; // e.g., "action", "adventure"
    providerCode?: string; // e.g., "providerA", "providerB"
    providerName?: string; // e.g., "Provider A", "Provider B"
    createdAt?: Date;
    updatedAt?: Date;
}
