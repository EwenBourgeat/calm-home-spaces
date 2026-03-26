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

function getHeroRuleForSlug(slug: string): MatchRule | null {
    const explicit = SLUG_RULES[slug];
    if (explicit) return explicit;

    // Fallback heuristic to ensure new articles still get hero images.
    // We only rely on the slug text so we can keep the function signature unchanged.
    const lower = slug.toLowerCase();

    if (lower.includes("bath")) {
        return { categories: ["Salle de bain"] };
    }

    if (lower.includes("bed")) {
        return { categories: ["Chambre"] };
    }

    if (lower.includes("office")) {
        return { categories: ["Bureau"] };
    }

    if (lower.includes("lamp") || lower.includes("lighting")) {
        return { categories: ["Salon"], subCategories: ["Lighting"] };
    }

    // Kitchen / entryway / living room / seasonal / decor-ish → default to Salon.
    return { categories: ["Salon"] };
}

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
        const rule = getHeroRuleForSlug(slug);
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
            // Sort to make selection deterministic, and heavily prefer AI lifestyle images!
            availableMatches.sort((a, b) => {
                const aAi = (a as any).hasAiImage ? 1 : 0;
                const bAi = (b as any).hasAiImage ? 1 : 0;
                if (aAi !== bAi) {
                    return bAi - aAi; // 1 (has AI) comes before 0
                }
                return getTitle(a).localeCompare(getTitle(b));
            });
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
