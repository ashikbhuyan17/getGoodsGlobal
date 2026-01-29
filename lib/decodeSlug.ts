export function decodeSlug(slug: string) {
  let decoded = slug;

  try {
    decoded = decodeURIComponent(slug);
  } catch {}

  const words = decoded
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => {
      if (/\p{Script=Bengali}/u.test(word)) return word;

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

  return words.join(" ");
}
