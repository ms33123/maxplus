import { computed, ref, toValue, watch, type MaybeRefOrGetter } from "vue";

interface UseTablePaginationOptions {
  initialPageSize?: number;
  pageSizes?: number[];
}

export function useTablePagination<T>(
  source: MaybeRefOrGetter<T[]>,
  options: UseTablePaginationOptions = {}
) {
  const currentPage = ref(1);
  const pageSize = ref(options.initialPageSize ?? 10);
  const pageSizes = options.pageSizes ?? [10, 20, 50, 100];

  const total = computed(() => toValue(source).length);
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / Math.max(pageSize.value, 1)))
  );
  const pagedItems = computed(() => {
    const items = toValue(source);
    const start = (currentPage.value - 1) * pageSize.value;

    return items.slice(start, start + pageSize.value);
  });

  const resetPagination = () => {
    currentPage.value = 1;
  };

  watch([total, pageSize], () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }

    if (currentPage.value < 1) {
      currentPage.value = 1;
    }
  });

  return {
    currentPage,
    pageSize,
    pageSizes,
    total,
    pagedItems,
    resetPagination
  };
}
