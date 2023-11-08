import { Layout } from "@/components/layout";
import ButtonAdd from "@/components/ui/button/ButtonAdd";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchInput from "@/components/ui/form/input/SearchInput";
import Table, { Td, Th, Thead, Tr } from "@/components/ui/table";
import { PrismaClient } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { TResponseDataProduct } from "../../../types/api/product";
import { useState } from "react";
import ButtonEdit from "@/components/ui/button/ButtonEdit";
import ButtonDelete from "@/components/ui/button/ButtonDelete";
import Checkbox from "@/components/ui/form/Checkbox";
import ModalForm, { TProductForm } from "@/components/features/products/ModalForm";
import { SchemaModal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";
import { prismaClient } from "@/lib/prisma";
import { Confirmation } from "@/components/ui/modal/Confirmation";

type ProductProps = {
  data?: TResponseDataProduct[];
};

type TModalType = "add";

const initModal = {
  show: false,
  type: "add" as TModalType,
}

const initForm = {
  id: 0,
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category_id: 0
}

export default function Index({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [modal, setModal] = useState<SchemaModal<TProductForm, TModalType>>(initModal);
  const [products, setProducts] = useState<TResponseDataProduct[]>(data);
  console.log("index admin")
  return (
    <>
      {modal.show &&
        <ModalForm
          type="add"
          show={modal.show}
          data={modal?.data ? modal.data : initForm}
          onHide={() => setModal(initModal)}
        />
      }

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
                        <ButtonDelete />
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

export const getServerSideProps: GetServerSideProps<ProductProps> = async (
  context
) => {
  const response = await prismaClient.product.findMany({
    include: {
      category: true,
    },
  });
  console.log("response ", response);
  return {
    props: {
      data: response,
    },
  };
};
