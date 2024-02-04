import { Layout } from "@/components/layout";
import { SpinnerIcon } from "@/components/ui/Spinner";
import Banner from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Ribbon from "@/components/ui/card/ribbon";
import ContainerInput from "@/components/ui/container/ContainerInput";
import { Input } from "@/components/ui/form/input";
import SrcFileManager from "@/components/ui/form/input/SrcFileManager";
import ToggleSwitch from "@/components/ui/switch/toggle";
import { updateSetting } from "@/lib/api/setting";
import { RIBBON_LIST } from "@/lib/constant";
import { useDialogStore } from "@/lib/hookStore";
import { Setting } from "@/models/setting";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import cn from "classnames";
import Image from "next/image";
import { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";
import { IoEyeOutline, IoRibbonOutline } from "react-icons/io5";
import { LiaCitySolid } from "react-icons/lia";
import { MdOutlineCampaign } from "react-icons/md";
import { TbClick } from "react-icons/tb";

export async function getServerSideProps() {
  const setting = new Setting();
  const resultSetting = await setting.get();
  const parsedSetting = JSON.parse(JSON.stringify(resultSetting));

  return {
    props: {
      setting: parsedSetting || {}
    }
  }
}

const initPopup = Object.freeze({
  srcImg: "",
  url: "",
  show: false
});

export default function Settings({ setting }) {
  const [popup, setPopup] = useState(setting?.popup || initPopup);
  const [formSetting, setFormSetting] = useState(setting);
  const showToast = useDialogStore(state => state.showToast);

  const { mutate: mutateUpdateSetting, isLoading } = useMutation({
    mutationFn: updateSetting,
    onSuccess: () => showToast("success-update-setting"),
    onError: () => showToast("error-update-setting")
  });

  const onSaveSetting = () => {
    const clone = structuredClone(popup);
    delete clone.show;
    const payload = {
      ...formSetting,
      popup: JSON.stringify(clone),
    }
    mutateUpdateSetting(payload);
  };

  if (!Object.keys(setting).length) {
    return <Layout title="Pengaturan">

    </Layout>
  }

  const onClickRibbonBasic = (selectedVariant) => {
    setFormSetting(form => ({ ...form, ribbon:`basic.${selectedVariant}`}))
  }

  return (<>
    {popup?.show && <Banner
      src={popup.srcImg}
      redirectTo={popup.url}
      onClose={() => setPopup(popup => ({ ...popup, show: false }))}
    />
    }
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
            {/* INFO COMPANY */}
            <CardHeader className="pl-0 font-semibold pb-3">Informasi Perusahaan</CardHeader>
              <div className="rounded-lg bg-gray-100 p-5 flex flex-col gap-y-4">
                <ContainerInput direction="row" className="gap-x-5">
                  <Label>
                    <LiaCitySolid size={26} />
                  </Label>
                  <Input
                    name="logo_title"
                    placeholder="Nama Perusahaan"
                    className="!h-11"
                    value={formSetting?.logo_title || ""}
                    onChange={(e) => setFormSetting(state => ({ ...state, logo_title: e.target.value }))}
                  />
                </ContainerInput>

                <div className="flex gap-x-5 justify-center">
                  <ContainerInput className="gap-x-5 items-center">
                    <div className="text-gray-500 mt-5 ">Logo</div>
                    <div className="w-52 h-52 bg-gray-200 rounded-lg flex mb-5 justify-center items-center">
                      {formSetting?.logo ? <Image className="rounded-lg" src={formSetting.logo} width={208} height={208} alt="" /> : <CiImageOn size={50} color="gray" />}
                    </div>
                    <div className="w-[500px]">
                      <SrcFileManager
                        single
                        placeholder="Media Manager"
                        onSave={(src) => {
                          setFormSetting(form => ({ ...form, logo: src }))
                        }}
                        values={formSetting?.logo}
                        onRemoveFile={() => {
                          setFormSetting(form => ({ ...form, logo: "" }))
                        }}
                      />
                    </div>
                  </ContainerInput>
                  
                  <ContainerInput className="gap-x-5 items-center">
                    <div className="text-gray-500 mt-5 ">Favicon (.ico)</div>
                    <div className="w-52 h-52 bg-gray-200 rounded-lg flex mb-5 justify-center items-center">
                      {formSetting?.favicon ? <Image className="rounded-lg" src={formSetting.favicon} width={50} height={50} alt="" /> : <CiImageOn size={50} color="gray" />}
                    </div>
                    <div className="w-[500px]">
                      <SrcFileManager
                        accept={["ico"]}
                        single
                        placeholder="Media Manager"
                        onSave={(src) => {
                          setFormSetting(form => ({ ...form, favicon: src }))
                        }}
                        values={formSetting?.favicon}
                        onRemoveFile={() => {
                          setFormSetting(form => ({ ...form, favicon: "" }))
                        }}
                      />
                    </div>
                    </ContainerInput>
                </div>

            </div>

            {/* CONTACT */}
            <CardHeader className="pl-0 font-semibold pb-3">Kontak</CardHeader>
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

              {/* RIBBON DISCOUNT PRODUCT */}
              <CardHeader className="pl-0 font-semibold pb-3">Design Pita Diskon</CardHeader>
              <div className="rounded-lg bg-gray-100 p-5">
                <ContainerInput direction="row" className="w-full gap-x-5">
                  <Label className="uppercase">
                    <IoRibbonOutline size={26} />
                  </Label>
                  <div className="flex gap-x-3 flex-wrap gap-y-5">
                    {RIBBON_LIST.basic.map((ribbon, key) => <RibbonCard
                      key={key}
                      active={formSetting.ribbon?.includes(ribbon)}
                      variant={ribbon}
                      onClick={onClickRibbonBasic}
                    />)}
                  </div>

                </ContainerInput>
              </div>

              {/* POPUP */}
              <div className="flex justify-between items-center">
                <CardHeader className="pl-0 font-semibold pb-3">Popup</CardHeader>
                {
                  popup.srcImg?.length > 0 &&
                  <Button
                    size="sm"
                    className="flex gap-x-1.5 mt-2"
                    onClick={() => setPopup(popup => ({ ...popup, show:true }))}
                  >
                    <IoEyeOutline size={15}/>
                    <span>Lihat Popup</span>
                  </Button>
                }
              </div>
              <div className="rounded-lg bg-gray-100 p-5">
                <ContainerInput direction="row" className="w-full gap-x-5">
                  <Label className="uppercase">
                    <MdOutlineCampaign size={26} />
                  </Label>
                  <SrcFileManager
                    single
                    placeholder="Media Manager"
                    onSave={(src) => setPopup(popup => ({ ...popup, srcImg:src }))}
                    values={popup.srcImg}
                    onRemoveFile={() => {
                      setPopup(popup => ({ ...popup, srcImg: "" }))
                    }}
                  />
                </ContainerInput>
                {popup.srcImg?.length > 0 &&
                  <ContainerInput className="!gap-x-5 mt-4" direction="row">
                    <Label><TbClick size={26} /></Label>
                    <Input placeholder="URL Popup" value={popup.url} onChange={e => setPopup(popup => ({ ...popup, url:e.target.value }))} />
                  </ContainerInput>
                }
              </div>

              {/* MAINTENANCE */}
              <CardHeader className="!pl-0 font-semibold">Maintenance</CardHeader>
              <ToggleSwitch
                checked={formSetting?.is_maintenance === "Y"}
                text={formSetting?.is_maintenance === "Y" ? "Aktif" : "Tidak Aktif"}
                onChange={(checked) => {
                  setFormSetting(state => ({ ...state, is_maintenance: checked ? "Y" : "N" }))
                }}
              />

              {/* SHOW PRICE */}
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
  </>
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
      <Ribbon text="DISKON 70%" variant={variant} />
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