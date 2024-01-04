import ModalForm from "@/components/features/category/ModalForm";
import { Layout } from "@/components/layout";
import ButtonAdd from "@/components/ui/button/ButtonAdd";
import ButtonDelete from "@/components/ui/button/ButtonDelete";
import ButtonEdit from "@/components/ui/button/ButtonEdit";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchInput from "@/components/ui/form/input/SearchInput";
import { ShimmerTableRow } from "@/components/ui/shimmer";
import Table, { Td, Th, Thead, Tr } from "@/components/ui/table";
import PaginationTable from "@/components/ui/table/PaginationTable";
import { deleteCategory, getCategory, insertCategory, updateCategory } from "@/lib/api/category";
import { placeholderImage } from "@/lib/constant";
import { useDialogStore } from "@/lib/hookStore";
import { adminCategoryQuery } from "@/lib/queryKeys";
import { debounce, mediaPath } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

const initModal = {
  show: false,
  type: "" ,
};

const initForm = {
  category_name: ""
};

export default function Category() {
  const [modal, setModal] = useState(initModal);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [showToast, showConfirmation, hideConfirmation] = useDialogStore(state => [state.showToast, state.showConfirmation, state.hideConfirmation]);

  const { data, isLoading } = useQuery({
    queryKey: adminCategoryQuery.getAll(page, keyword),
    keepPreviousData: true,
    queryFn: async () => {
      const params = {
        name: keyword,
        page
      }
      const response = await getCategory(params);
      if (response.status !== 200) throw new Error();
      return response.data || [];
    }
  });

  const { mutate: mutateInsertCategory, isLoading:isLoadingInsert } = useMutation({
    mutationFn: (payload) => insertCategory(payload),
    onError: () => showToast("error-insert-category"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryQuery.getAll(page, keyword),
      });
      showToast("success-insert-category");
    },
    onSettled: () => setModal(initModal)
  });
 
  const { mutate: mutateUpdateCategory, isLoading: isLoadingUpdate } = useMutation({
    mutationFn: (payload) => updateCategory(payload),
    onError: () => showToast("error-update-category"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryQuery.getAll(page, keyword),
      });
      showToast("success-update-category");
    },
    onSettled: () => setModal(initModal)
  });

  const { mutate: mutateDeleteCategory } = useMutation({
    mutationFn: (payload) => deleteCategory(payload),
    onError: () => showToast("error-delete-category"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminCategoryQuery.getAll(page, keyword),
      });
      showToast("success-delete-category");
    },
    onSettled: hideConfirmation
  });

  const onSave = (payload) => {
    modal.type === "add" ? mutateInsertCategory(payload) : mutateUpdateCategory(payload);
  }

  const onNextPrev = (current) => setPage(page => page + current);
  const debounceSearch = debounce((e) => {
    setKeyword(e.target.value);
    setPage(1);
  })
  return (
    <>
      {modal.show && (
        <ModalForm
          type={modal.type}
          show={modal.show}
          data={modal?.data ? modal.data : initForm}
          onHide={() => setModal(initModal)}
          isLoading={isLoadingInsert || isLoadingUpdate }
          onSave={onSave}
        />
      )}
      <Layout title="Kategori Produk">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <SearchInput
                className="!w-80"
                placeholder="Cari Kategori"
                onChange={debounceSearch}
              />
              <ButtonAdd
                text="Kategori"
                onClick={() =>
                  setModal({
                    show: true,
                    type: "add",
                  })
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <Thead>
                <tr>
                  <Th className="w-[60px] font-semibold">GAMBAR</Th>
                  <Th>CATEGORY</Th>
                  <Th className="text-center">ACTION</Th>
                </tr>
              </Thead>
              <tbody>
                {isLoading
                  ? Array(20)
                    .fill(1)
                    .map((_, key) => (
                      <ShimmerTableRow colspan={3} key={key} />
                    ))
                  : data?.data?.map((item, key) => (
                    <Tr key={key}>
                      <Td>
                        <Image
                          src={
                            item.image
                              ? mediaPath("categories",item.image)
                              : placeholderImage
                          }
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      </Td>
                      <Td>{item.category_name}</Td>                     
                      <Td>
                        <div className="flex justify-center gap-x-1">
                          <ButtonEdit
                            onClick={() => {
                              setModal({
                                show: true,
                                type: "edit",
                                data: item,
                              });
                            }}
                          />
                          <ButtonDelete
                            onClick={() =>
                              showConfirmation("confirm-delete-category", {
                                onConfirm: () =>
                                  mutateDeleteCategory(item.id),
                              })
                            }
                          />
                        </div>
                      </Td>
                    </Tr>
                  ))}
              </tbody>
            </Table>
            {data?.paging && (
              <PaginationTable
                currentPage={page}
                pagination={data.paging}
                onNext={onNextPrev}
                onPrev={onNextPrev}
              />
            )}
          </CardContent>
        </Card>
      </Layout>
    </>
  );
}