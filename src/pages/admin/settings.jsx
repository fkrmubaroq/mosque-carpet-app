import { Layout } from "@/components/layout";
import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Ribbon from "@/components/ui/card/ribbon";
import ContainerInput from "@/components/ui/container/ContainerInput";
import { Input } from "@/components/ui/form/input";
import ToggleSwitch from "@/components/ui/switch/toggle";
import { updateSetting } from "@/lib/api/setting";
import { useDialogStore } from "@/lib/hookStore";
import { prismaClient } from "@/lib/prisma";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import cn from "classnames";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoRibbonOutline } from "react-icons/io5";
export async function getServerSideProps() {
  const response = await prismaClient.setting.findFirst();
  console.log("response setting", response);
  return {
    props: {
      setting: response || {}
    }
  }
}

const ribbonList = {
  basic: ["primary", "secondary","gray", "blue", "red"]
};
export default function Settings({ setting }) {
  const [formSetting, setFormSetting] = useState(setting);
  const showToast = useDialogStore(state => state.showToast);

  const { mutate: mutateUpdateSetting, isLoading } = useMutation({
    mutationFn: updateSetting,
    onSuccess: () => showToast("success-update-setting"),
    onError: () => showToast("error-update-setting")
  });

  const onSaveSetting = () => {
    mutateUpdateSetting(formSetting);
  };

  if (!Object.keys(setting).length) {
    return <Layout title="Pengaturan">

    </Layout>
  }

  const onClickRibbonBasic = (selectedVariant) => {
    setFormSetting(form => ({ ...form, ribbon:`basic-${selectedVariant}`}))
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

              <CardHeader className="pl-0 font-semibold pb-5">Design Pita Diskon</CardHeader>
              <div className="rounded-lg bg-gray-100 p-5">
                <ContainerInput direction="row" className="w-full gap-x-5">
                  <Label className="uppercase">
                    <IoRibbonOutline size={26} />
                  </Label>
                  <div className="flex gap-x-3 flex-wrap">
                    {ribbonList.basic.map((ribbon, key) => <RibbonCard
                      key={key}
                      active={formSetting.ribbon?.includes(ribbon)}
                      variant={ribbon}
                      onClick={onClickRibbonBasic}
                    />)}
                  </div>

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
const hoverCard = {
  primary: "hover:border-primary",
  secondary: "hover:border-secondary",
  gray: "hover:border-gray-500",
  blue: "hover:border-blue-500",
  red: "hover:border-red-500",
}

const activeRibbon = {
  primary: "border-primary",
  secondary: "border-secondary",
  gray: "border-gray-500",
  blue: "border-blue-500",
  red: "border-red-500",
}
function RibbonCard({ variant, onClick, active }) {
  return <div className="relative flex flex-col gap-y-3">
    <div
      onClick={() => onClick(variant)}
      className={cn("relative bg-white border w-56 h-56  cursor-pointer", hoverCard[variant], {
        [activeRibbon[variant]]: active
      })}>
      <Ribbon text="70% OFF" variant={variant} />
      <div className="bg-gray-200 w-full h-[130px]"></div>
      <div className="flex mt-3 px-4 flex-col gap-y-4">
        <div className="bg-gray-200 w-[90px] h-2 rounded-full"></div>
        <div className="bg-gray-200 w-full h-2 rounded-full"></div>
        <div className="bg-gray-200 w-full h-2 rounded-full"></div>
      </div>
    </div>
    <div className="text-center first-letter:uppercase text-gray-600">{variant}</div>
  </div>
}