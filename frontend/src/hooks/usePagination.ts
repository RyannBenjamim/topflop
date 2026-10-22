import { useSearchParams } from "react-router-dom";
import { scrollToTop } from "../utils/scrollToTop";

export function usePagination<T>(items: T[] | null, pageSize: number) {
  const [searchParams, setSearchParams] = useSearchParams();

  const total = items?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const requested = Math.trunc(Number(searchParams.get('pagina'))) || 1;
  const page = Math.min(Math.max(1, requested), totalPages);
  const pageItems = (items ?? []).slice((page - 1) * pageSize, page * pageSize);

  const goTo = (next: number) => {
    setSearchParams(current => {
      const params = new URLSearchParams(current);
      if (next <= 1) params.delete('pagina');
      else params.set('pagina', String(next));
      return params;
    });
    scrollToTop();
  };

  return { page, totalPages, total, pageItems, goTo };
}
