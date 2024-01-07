import ModalForm from "@/components/features/products/ModalForm";
import { Layout } from "@/components/layout";
import ButtonAdd from "@/components/ui/button/ButtonAdd";
import ButtonDelete from "@/components/ui/button/ButtonDelete";
import ButtonEdit from "@/components/ui/button/ButtonEdit";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Checkbox from "@/components/ui/form/Checkbox";
import SearchInput from "@/components/ui/form/input/SearchInput";
import Table, { Td, Th, Thead, Tr } from "@/components/ui/table";
import { useDialogStore } from "@/lib/hookStore";
import { prismaClient } from "@/lib/prisma";
import { useState } from "react";


const initModal = {
  show: false,
  type: "add",
};

const initForm = {
  id: 0,
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category_id: 0,
};

export default function Index({ data }) {
  const [modal, setModal] = useState(initModal);
  const [products, setProducts] = useState(data);

  const [showConfirmation, showToast] = useDialogStore((state) => [
    state.showConfirmation,
    state.showToast,
  ]);
  // const { mutate } = useMutation({
  //   mutationFn:(payload) =>
  // })
  return (
    <>
      {modal.show && (
        <ModalForm
          type="add"
          show={modal.show}
          data={modal?.data ? modal.data : initForm}
          onHide={() => setModal(initModal)}
        />
      )}

      <Layout title="Products">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <SearchInput placeholder="Search Product" />
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
                  <Th className="w-4">
                    <Checkbox />
                  </Th>
                  <Th>PRODUCT NAME</Th>
                  <Th>CATEGORY</Th>
                  <Th>PRICE</Th>
                  <Th>STOCK</Th>
                  <Th className="text-center">ACTION</Th>
                </tr>
              </Thead>
              <tbody>
                {products.map((product, key) => (
                  <Tr key={key}>
                    <Td>
                      <Checkbox />
                    </Td>
                    <Td>{product.name}</Td>
                    <Td>{product.category.category_name}</Td>
                    <Td>{product.price}</Td>
                    <Td>{product.stock}</Td>
                    <Td>
                      <div className="flex justify-center gap-x-1">
                        <ButtonEdit />
                        <ButtonDelete
                          onClick={() =>
                            showConfirmation("confirm-delete-product", {
                              onConfirm: () => {
                                showToast("success-delete-product");
                              },
                            })
                          }
                        />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (
  context
) => {
  const response = await prismaClient.product.findMany({
    include: {
      category: true,
    },
  });

  return {
    props: {
      data: response,
    },
  };
};
