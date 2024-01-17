import { Layout } from "@/components/layout";
import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ContainerInput from "@/components/ui/container/ContainerInput";
import { Input } from "@/components/ui/form/input";
import ToggleSwitch from "@/components/ui/switch/toggle";
import { insertSetting } from "@/lib/api/setting";
import { useDialogStore } from "@/lib/hookStore";
import { prismaClient } from "@/lib/prisma";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export async function getServerSideProps() {
  const response = await prismaClient.setting.findFirst();
  return {
    props: {
      setting: response || {}
    }
  }
}

export default function Settings({ setting }) {
  const [formSetting, setFormSetting] = useState(setting);
  const showToast = useDialogStore(state => state.showToast);

  const { mutate: mutateInsertSetting, isLoading } = useMutation({
    mutationFn: insertSetting,
    onSuccess: () => showToast("success-update-setting"),
    onError: () => showToast("error-update-setting")
  });

  const onSaveSetting = () => {
    mutateInsertSetting(formSetting);
  };

  if (!Object.keys(setting).length) {
    return <Layout title="Pengaturan">

    </Layout>
  }
  return (
    <Layout title="Pengaturan">

      <div className="flex gap-x-5">
        <div className="fixed left-1/2 top-4 z-[99999]">
          <Button
            disabled={isLoading}
            className="!rounded-full"
            size="lg"
            onClick={() => onSaveSetting()}
          >
            {isLoading ? (
              <SpinnerIcon width="w-4" height="h-4" />
            ) : (
              "Simpan"
            )}
          </Button>
        </div>
        <div className="flex w-full flex-col gap-y-4">
          <Card>
            <CardContent>
            <CardHeader className="pl-0 font-semibold pb-5">Kontak</CardHeader>
              <div className="rounded-lg bg-gray-100 p-5">
                <ContainerInput direction="row" className="w-full gap-x-5">
                  <Label className="uppercase">
                    <FaWhatsapp size={26} />
                  </Label>
                  <Input
                    name="whatsapp"
                    placeholder="Nomor Whatsapp"
                    className="!h-11"
                    value={formSetting?.no_wa || ""}
                    onChange={(e) => setFormSetting(state => ({ ...state, no_wa: e.target.value }))}
                  />
                </ContainerInput>
              </div>

              <CardHeader className="!pl-0 font-semibold">Maintenance</CardHeader>
              <ToggleSwitch
                checked={formSetting?.is_maintenance === "Y"}
                text={formSetting?.is_maintenance === "Y" ? "Aktif" : "Tidak Aktif"}
                onChange={(checked) => {
                  setFormSetting(state => ({ ...state, is_maintenance: checked ? "Y" : "N" }))
                }}
              />
              <span></span>

              <CardHeader className="!pl-0 font-semibold">Tampilkan Harga Produk</CardHeader>
              <ToggleSwitch
                checked={formSetting?.show_price === "Y"}
                text={formSetting?.show_price === "Y" ? "Aktif" : "Tidak Aktif"}
                onChange={(checked) => setFormSetting(state => ({ ...state, show_price: checked ? "Y" : "N" }))}
              />
              <span></span>

            </CardContent>
          </Card>

        
        </div>
      </div>
    </Layout>
  );
}