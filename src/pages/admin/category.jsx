import ModalForm from "@/components/features/category/ModalForm";
import { Layout } from "@/components/layout";
import ButtonAdd from "@/components/ui/button/ButtonAdd";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Checkbox from "@/components/ui/form/Checkbox";
import SearchInput from "@/components/ui/form/input/SearchInput";
import Table, { Th, Thead } from "@/components/ui/table";
import { useState } from "react";

const initModal = {
  show: false,
  type: "add" ,
};

const initForm = {
  id: 0,
  category_name: ""
};

export default function Category() {
  const [modal, setModal] = useState(initModal);

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
      <Layout title="Kategori Produk">
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
              <tbody></tbody>
            </Table>
          </CardContent>
        </Card>
      </Layout>
    </>
  );
}