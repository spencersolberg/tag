type Tag = {
    id: number;
    title: string;
    key?: Key;
    tonality?: Tonality
    arranger?: string;
    type?: string;
    parts?: number;
    rating?: number;
    ratingCount?: number;
}

enum Tonality {
    "Major",
    "Minor"
}

enum Key {
    "Cb",
    "C",
    "C#",
    "Db",
    "D",
    "D#",
    "Eb",
    "E",
    "E#",
    "Fb",
    "F",
    "F#",
    "Gb",
    "G",
    "G#",
    "Ab",
    "A",
    "A#",
    "Bb",
    "B",
    "B#"
}

export const fetchTags = async (searchTerm: string): Promise<Tag[]> => {
    const url = `https://tags-api.deno.dev/search/${encodeURIComponent(searchTerm)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data?.tags?.tag?.length) {
        let tags = data.tags.tag.map((t) => new Object({

            id: t.id,
            title: t.Title,
            key: t.WritKey?.split(":")[1] ?? undefined,
            tonality: t.WritKey?.split(":")[0] ?? undefined,
            arranger: t.Arranger ?? t.SungBy ?? t.Quartet ?? t.Teacher ?? t.Provider ?? undefined,
            type: t.Type ?? undefined,
            parts: t.Parts ?? undefined,
            rating: t.Rating ?? undefined,
            ratingCount: t.RatingCount ?? undefined
        }));
        return tags;
    } else if (data?.tags?.tag) {
        let t = data.tags.tag;
        return [ {
            id: t.id,
            title: t.Title,
            key: t.WritKey?.split(":")[1] ?? undefined,
            tonality: t.WritKey?.split(":")[0] ?? undefined,
            arranger: t.Arranger ?? t.SungBy ?? t.Quartet ?? t.Teacher ?? t.Provider ?? undefined,
            type: t.Type ?? undefined,
            parts: t.Parts ?? undefined,
            rating: t.Rating ?? undefined,
            ratingCount: t.RatingCount ?? undefined
        }];
        
    }
    // console.log(tags);
    return null;
};
