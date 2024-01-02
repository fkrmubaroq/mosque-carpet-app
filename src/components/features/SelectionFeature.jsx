import { getCategory } from "@/lib/api/category";
import { selectionQuery } from "@/lib/queryKeys";
import { debounce } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Selection } from "../ui/form/Select";

export function SelectionCategory({
  value,
  onReset,
  required,
  placeholder,
  invalid,
  onClickOption,
}) {
  const [enabled, setEnabled] = useState(false);
  const [selectionSearch, setSelectionSearch] = useState("");
  const debounceSearch = debounce(setSelectionSearch);
  const { data: dataBuyers, isFetching } = useQuery({
    retry: false,
    enabled: enabled,
    staleTime: 20000,
    queryKey: selectionQuery.category,
    queryFn: async () => {
      const params = {
        name: selectionSearch
      }
      const response = await getCategory(params);
      if (response.status >= 299) throw new Error();
      const data = response.data.data;
      response.data
      return (
        data?.map((item) => ({
          id: item.id,
          text: item.category_name,
        })) || []
      );
    },
  });
  return (
    <div className="w-full">
      <Selection
        onListOpened={() => setEnabled(true)}
        required={required}
        placeholder={placeholder}
        invalid={invalid}
        options={dataBuyers || []}
        onFetchDataFromFilter={debounceSearch}
        onClickOption={onClickOption}
        value={value || ""}
        onReset={onReset}
        isLoading={isFetching}
      />
    </div>
  );
}
