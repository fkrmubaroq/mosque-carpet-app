import { Layout } from "@/components/layout";
import ButtonAdd from "@/components/ui/button/ButtonAdd";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Checkbox from "@/components/ui/form/Checkbox";
import SearchInput from "@/components/ui/form/input/SearchInput";
import { SchemaModal } from "@/components/ui/modal";
import Table, { Th, Thead } from "@/components/ui/table";
import { useState } from "react";

export default function Articles() {
  return (
    <Layout title="Artikel">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <SearchInput placeholder="Cari Artikel" />
            <ButtonAdd
              text="Artikel"
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
                <Th></Th>
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
  );
}