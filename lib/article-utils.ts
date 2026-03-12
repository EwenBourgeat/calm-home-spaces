export type MatchRule = {
    categories?: string[];
    subCategories?: string[];
};

// Slug → product matching rules for hero images
export const SLUG_RULES: Record<string, MatchRule> = {
    "japandi-living-room": { categories: ["Salon"], subCategories: ["Lighting"] },
    "cozy-reading-nook": { subCategories: ["Lighting"] },
    "minimalist-bedroom": { categories: ["Chambre"] },
    "hygge-evening-lighting": { subCategories: ["Lighting"] },
    "scandinavian-spring-refresh": { categories: ["Salon"] },
    "japandi-shelf-styling": { categories: ["Salon"] },
    "wabi-sabi-home": { categories: ["Salon"] },
    "minimalist-bathroom": { categories: ["Salle de bain"] },
};

/**
 * Assigns unique hero images to a list of article slugs.
 * Prevents the same product image from being used as a hero for multiple articles.
 */
export function getUniqueHeroImages<T>(
    slugs: string[],
    products: T[],
    getCategory: (p: T) => string,
    getSubCategory: (p: T) => string | undefined,
    getImageUrl: (p: T) => string | null,
    getTitle: (p: T) => string
): Record<string, string | null> {
    const heroImages: Record<string, string | null> = {};
    const usedImages = new Set<string>();

    for (const slug of slugs) {
        const rule = SLUG_RULES[slug];
        if (!rule) {
            heroImages[slug] = null;
            continue;
        }

        const matched = products.filter((p) => {
            if (rule.subCategories?.some((sc) => getSubCategory(p) === sc)) return true;
            if (rule.categories?.some((c) => getCategory(p) === c)) return true;
            return false;
        });

        // Retain only images that haven't been used yet
        const availableMatches = matched.filter((p) => {
            const img = getImageUrl(p);
            return img ? !usedImages.has(img) : false;
        });

        if (availableMatches.length > 0) {
            // Sort to make selection deterministic
            availableMatches.sort((a, b) => getTitle(a).localeCompare(getTitle(b)));
            const chosenImage = getImageUrl(availableMatches[0]);
            
            if (chosenImage) {
                usedImages.add(chosenImage);
                heroImages[slug] = chosenImage;
            } else {
                heroImages[slug] = null;
            }
        } else {
            heroImages[slug] = null;
        }
    }

    return heroImages;
}
