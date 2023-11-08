import { useState } from "react";
import { Selection, SelectionDataItem } from "../ui/form/Select";
import { debounce } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { selectionQuery } from "@/lib/queryKeys";
import { getCategory } from "@/lib/api/category";
import { TSelection } from "@/types/selection";


export function SelectionCategory({
  value,
  onReset,
  required,
  placeholder,
  invalid,
  onClickOption,
}: TSelection & {
    onClickOption: (selected: SelectionDataItem) => void;
}) {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectionSearch, setSelectionSearch] = useState<string>("");
  const debounceSearch = debounce(setSelectionSearch);
  const { data: dataBuyers, isFetching } = useQuery<SelectionDataItem[]>({
    retry: false,
    enabled: enabled,
    staleTime: 20000,
    queryKey: selectionQuery.category,
    queryFn: async () => {
      const params = {
        name: selectionSearch
      }
      const response = await getCategory(params);
      if (response.status >= 299 || response.data.code) throw new Error();
      const data = response.data.data;
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
