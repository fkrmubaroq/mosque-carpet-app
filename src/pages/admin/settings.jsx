import { Layout } from "@/components/layout";
import { SpinnerIcon } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ContainerInput from "@/components/ui/container/ContainerInput";
import Textarea from "@/components/ui/form/Textarea";
import { Input } from "@/components/ui/form/input";
import ToggleSwitch from "@/components/ui/switch/toggle";
import { insertSetting } from "@/lib/api/setting";
import { useDialogStore } from "@/lib/hookStore";
import { prismaClient } from "@/lib/prisma";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { FaFacebook, FaInstagram, FaRegTrashAlt, FaWhatsapp } from "react-icons/fa";

const iconSocialMedia = {
  facebook: <FaFacebook size={26}/>,
  instagram: <FaInstagram size={26}/>,
};

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
    const payload = {
      ...formSetting,
      branch: JSON.stringify(formSetting.branch || "[]")
    }
    mutateInsertSetting(payload);
  };

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

          <Card className="w-full">
            <CardHeader className="font-semibold">Lokasi Kantor</CardHeader>
            <CardContent className="flex flex-col gap-y-5">

              <FormCompanyLocation
                data={formSetting?.branch}
                setFormSetting={setFormSetting}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function FormCompanyLocation({
  data,
  setFormSetting,
}) {
  return (
    <div className="flex flex-col gap-y-5">
      {data.map((item, key) => (
        <CompanyLocationItem
          key={key}
          data={item}
          number={key + 1}
          setFormSetting={setFormSetting}
        />
      ))}

      <div>
        <Button
          className="flex h-[9.188rem] w-full items-center justify-center gap-x-2 text-sm font-semibold text-gray-500 hover:border hover:border-dashed hover:border-gray-300 hover:bg-gray-50"
          variant="ghost"
          onClick={() =>
            setFormSetting((state) => ({
              ...state,
              branch: [
                ...state.branch,
                {
                  text: "",
                  link: "",
                },
              ]
            }))
          }
        >
          <CiSquarePlus size={20} color="black" />
          Tambah Lokasi
        </Button>
      </div>
    </div>
  );
}
function CompanyLocationItem({
  data,
  number,
  setFormSetting,
}) {
  
  const onChange = (e) => {
    setFormSetting(state => { 
      const branch = state.branch.map((item, key) => {
        if (key === number - 1) return { ...item, [e.target.name]: e.target.value }
        
        return { ...item }
      });

      return {
        ...state,
        branch
      }
    })
  }
  return (
    <>
      <div className="flex items-center gap-y-6 rounded-lg bg-gray-100 p-5">
        <NumberLocation number={number} />
        <div className="flex w-full flex-col gap-y-6">
          <ContainerInput direction="row">
            <Label className="w-52 text-right text-sm text-gray-600">
              Alamat
            </Label>
            <Textarea name="text" placeholder="Masukkan alamat" value={data.text} onChange={onChange}/>
          </ContainerInput>

          <ContainerInput direction="row">
            <Label className="w-52 text-right text-sm text-gray-600">
              Link Google map
            </Label>
            <Textarea
              name="link"
              placeholder="Masukkan Link"
              value={data.link}
              onChange={onChange}
            />
          </ContainerInput>
        </div>
        <div className="flex w-40 cursor-pointer items-center justify-center">
          <Button
            variant="danger"
            className="rounded-md py-4 !px-2.5 text-white"
            onClick={() => setFormSetting((state) => {
              const branch = state.branch.filter((_, key) => key !== number - 1);
              return {
                ...state,
                branch
              }
            })}
          >
            <FaRegTrashAlt size={20} />
          </Button>
        </div>
      </div>
    </>
  );
}

function NumberLocation({ number }) {
  return <div className="font-semibold w-44 text-4xl text-gray-600 rounded-full flex justify-center items-center">{number}</div>;
}

function FormSocialMedia({ data, setSocialMedia }) {
  
  const onChange = (e) => {
    setSocialMedia((state) => ({
      ...state,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="flex flex-col gap-y-4">
      {Object.keys(data).map((item, key) => (
        <div key={key} className="rounded-lg bg-gray-100 p-5">
          <ContainerInput direction="row" className="w-full gap-x-5">
            <Label className="uppercase">{iconSocialMedia[item]}</Label>
            <Input
              name={item}
              placeholder="Link"
              className="!h-11"
              value={data[item]}
              onChange={onChange}
            />       
          </ContainerInput>
        </div>
      ))}
    </div>
  );
}

