import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostcards } from "../../../redux/Slices/PostcardSlice";
import { getAllCategories } from "../../../redux/Slices/CategorySlice";
import { filterCards } from "./filterCards";

export const usePostcards = (PAGE_SIZE = 50, filters = {}) => {
  const dispatch = useDispatch();
  const { paginatedCategories = [] } = useSelector((s) => s.category);
  const { favorites = {} } = useSelector((s) => s.favorite);

  const categoryF = paginatedCategories.filter((c) => !c.isDisabled);

  const [allCards, setAllCards] = useState([]); // ✅ Chứa toàn bộ dữ liệu
  const [displayCards, setDisplayCards] = useState([]); // ✅ Chỉ dùng để render slice/infinite scroll
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [internalCategoryF, setInternalCategoryF] = useState(
    filters.categoryF || null
  );

  // ✅ Load categories 1 lần
  useEffect(() => {
    dispatch(getAllCategories({ pageSize: 100 }));
  }, [dispatch]);

  // ✅ Load tất cả postcards (KHÔNG phân trang API)
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const result = await dispatch(
          getAllPostcards({ pageSize: 9999 }) // ✅ Lấy hết luôn
        ).unwrap();

        setAllCards(result?.postcards || []);
        setPage(1); // Reset trang
      } catch (err) {
        console.error("[usePostcards] Failed to load postcards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [dispatch]);

  // ✅ Reset internalCategoryF nếu categoryFilter bật
  useEffect(() => {
    if (filters.categoryFilter && internalCategoryF) {
      setInternalCategoryF(null);
    }
  }, [filters.categoryFilter]);

  const filteredCards = useMemo(() => {
    return filterCards(
      allCards,
      paginatedCategories,
      favorites,
      filters,
      internalCategoryF
    );
  }, [allCards, paginatedCategories, favorites, filters, internalCategoryF]);

  // ✅ Slice theo PAGE_SIZE để render infinite scroll
  useEffect(() => {
    setDisplayCards(filteredCards.slice(0, page * PAGE_SIZE));
  }, [filteredCards, page, PAGE_SIZE]);

  const loadMore = () => {
    if (!loading && displayCards.length < filteredCards.length) {
      setPage((p) => p + 1);
    }
  };

  return {
    cards: displayCards,
    loadMore,
    loading,
    setInternalCategoryF,
    paginatedCategories: categoryF,
    favorites,
  };
};
