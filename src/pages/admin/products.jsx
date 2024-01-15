import ModalForm from "@/components/features/products/ModalForm";
import { Layout } from "@/components/layout";
import ButtonAdd from "@/components/ui/button/ButtonAdd";
import ButtonDelete from "@/components/ui/button/ButtonDelete";
import ButtonEdit from "@/components/ui/button/ButtonEdit";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchInput from "@/components/ui/form/input/SearchInput";
import { ShimmerTableRow } from "@/components/ui/shimmer";
import ToggleSwitch from "@/components/ui/switch/toggle";
import Table, { Td, Th, Thead, Tr } from "@/components/ui/table";
import PaginationTable from "@/components/ui/table/PaginationTable";
import { deleteProduct, getAllProduct, insertProduct, updateProduct, updateToggleStatus } from "@/lib/api/product";
import { placeholderImage } from "@/lib/constant";
import { useDialogStore } from "@/lib/hookStore";
import { adminProductQuery } from "@/lib/queryKeys";
import { debounce, formatNumberToPrice } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cn from "classnames";
import Image from "next/image";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

const initModal = Object.freeze({
  show: false,
  type: "add",
});

const initForm = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category_id: 0,
  active: "N"
}

export default function Index() {
  const [modal, setModal] = useState(initModal);
  const [keyword, setKeyword] = useState("");
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: adminProductQuery.getAll(page, keyword),
    keepPreviousData: true,
    queryFn: async () => {
      const params = {
        name: keyword,
        page
      }
      const response = await getAllProduct(params);
      if (response.status !== 200) throw new Error();
      return response.data || [];
    }
  })

  const [showConfirmation, showToast, hideConfirmation] = useDialogStore(useShallow(state => [state.showConfirmation, state.showToast, state.hideConfirmation]));

  const { mutate: mutateDeleteProduct } = useMutation({
    mutationFn: (productId) => deleteProduct(productId),
    onError: () => showToast("error-delete-product"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminProductQuery.getAll(page, keyword),
      });
      showToast("success-delete-product");
    },
    onSettled: hideConfirmation
  });


  const debounceSearch = debounce((e) => {
    setKeyword(e.target.value);
    setPage(1);
  })
  const { mutate: mutateInsertProduct, isLoading: isLoadingSaveForm } = useMutation({
    mutationFn: insertProduct,
    onSuccess: () => {
      showToast("success-insert-product");
      queryClient.invalidateQueries({ queryKey: adminProductQuery.getAll(page, keyword) });

    },
    onError: () => showToast("error-insert-product"),
    onSettled: () => setModal(initModal),
  });
  const { mutate: mutateUpdateProduct, isLoading: isLoadingUpdateForm } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      showToast("success-update-product");
      queryClient.invalidateQueries({ queryKey: adminProductQuery.getAll(page, keyword) });
    },
    onError: () => showToast("error-update-product"),
    onSettled: () => setModal(initModal),
  });

  const onEditForm = (payload) => {
    const { category_name, image, ...restPayload } = payload;
    if (typeof image === "object") {
      restPayload.image = image;
    }
    mutateUpdateProduct(restPayload);
  };

  const { mutate: updateStatus } = useMutation({
    mutationFn: (productId) => updateToggleStatus(productId),
    onSuccess: (response) => {
      showToast("custom-message", `Produk telah ${response.data.data?.active === "Y" ? "Aktif" : "Non-Aktif"}`);
      queryClient.invalidateQueries({ queryKey: adminProductQuery.getAll(page, keyword) });
    }
      
    });

  const onNextPrev = (current) => setPage(page => page + current);

  return (
    <>
      {modal.show && (
        <ModalForm
          type={modal.type || "add"}
          show={modal.show}
          data={modal?.data ? modal.data : initForm}
          onHide={() => setModal(initModal)}
          onSave={mutateInsertProduct}
          onEdit={onEditForm}
          isLoading={isLoadingSaveForm || isLoadingUpdateForm}
        />
      )}

      <Layout title="Products">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <SearchInput
                className="!w-80"
                placeholder="Cari Produk"
                onChange={debounceSearch}
              />
              <ButtonAdd
                text="Product"
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
                  <Td className="w-[60px] font-semibold">GAMBAR</Td>
                  <Th>PRODUCT NAME</Th>
                  <Th>CATEGORY</Th>
                  <Th>PRICE</Th>
                  <Th>STOCK</Th>
                  <Th>ACTIVE</Th>
                  <Th className="text-center">ACTION</Th>
                </tr>
              </Thead>
              <tbody>
                {isLoading
                  ? Array(20)
                      .fill(1)
                      .map((_, key) => (
                        <ShimmerTableRow colspan={8} key={key} />
                      ))
                  : data?.data?.map((product, key) => (
                      <Tr
                        key={key}
                        className={cn({
                          "text-gray-300": product.active === "N",
                        })}
                      >
                        <Td>
                          <Image
                            src={
                              product.image
                                ? `/api/files/products/${product.image}`
                                : placeholderImage
                            }
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                        </Td>
                        <Td>{product.name}</Td>
                        <Td>{product.category_name}</Td>
                        <Td>Rp{formatNumberToPrice(product.price)}</Td>
                        <Td>{product.stock}</Td>
                        <Td>
                          <ToggleSwitch
                            text={
                              product.active === "Y" ? "Aktif" : "Non-Aktif"
                            }
                            checked={product.active === "Y"}
                            onChange={() => updateStatus(product.id)}
                          />
                        </Td>
                        <Td>
                          <div className="flex justify-center gap-x-1">
                            <ButtonEdit
                              onClick={() => {
                                setModal({
                                  show: true,
                                  type: "edit",
                                  data: product,
                                });
                              }}
                            />
                            <ButtonDelete
                              onClick={() =>
                                showConfirmation("confirm-delete-product", {
                                  onConfirm: () =>
                                    mutateDeleteProduct(product.id),
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