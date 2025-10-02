export const filterCards = (
  cards,
  paginatedCategories,
  favorites,
  filters,
  internalCategoryF
) => {
  const {
    categoryFilter = "",
    favoriteFilter = false,
    searchText = "",
  } = filters;

  console.log("======== 🔍 FILTER DEBUG START ========");
  console.log("Total cards received:", cards.length);
  console.log("Filters => Category:", categoryFilter || "ALL");
  console.log("Filters => Favorite only?:", favoriteFilter);
  console.log("Filters => Search text:", searchText || "EMPTY");
  console.log(
    "Internal Category (fallback):",
    internalCategoryF?.name || "NONE"
  );

  const filtered = cards.filter((card) => {
    const category = paginatedCategories.find(
      (c) => c.id === card.categoryId && !c.isDisabled
    );

    // ✅ FIXED HERE
    const isAll = !categoryFilter || categoryFilter.toLowerCase() === "all";
    const matchCategory = isAll
      ? true
      : category?.name?.trim().toLowerCase() ===
        categoryFilter.trim().toLowerCase();

    const matchFavorite =
      !favoriteFilter || favorites[card.id]?.isFavorite === true;

    const matchSearch = card.music?.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    console.log(
      `🎵 Card: ${card.music?.name}`,
      "| 📂 Category:",
      category?.name || "UNKNOWN",
      "| ✅ Match Category:",
      matchCategory,
      "| ⭐ Match Favorite:",
      matchFavorite,
      "| 🔤 Match Search:",
      matchSearch
    );

    return matchCategory && matchFavorite && matchSearch;
  });

  console.log("✅ Total after filter:", filtered.length);
  console.log("======== 🔍 FILTER DEBUG END ========");

  return filtered;
};
