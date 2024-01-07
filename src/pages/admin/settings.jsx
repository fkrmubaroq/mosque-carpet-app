import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ContainerInput from "@/components/ui/container/ContainerInput";
import Textarea from "@/components/ui/form/Textarea";
import UploadFile from "@/components/ui/form/UploadFile";
import { Input } from "@/components/ui/form/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { FaFacebook, FaInstagram, FaRegTrashAlt, FaWhatsapp } from "react-icons/fa";

const listCompanyLocation = [
  {
    address: "address 1",
    link_google_map: ""
  },
  {
    address: "adsress 2",
    link_google_map: ""
  }
];

const initSocialMedia = {
  facebook: "",
  instagram: ""
}

const iconSocialMedia = {
  facebook: <FaFacebook size={26}/>,
  instagram: <FaInstagram size={26}/>,
};
export default function Settings() {
  const [companyLocations, setCompanyLocations] = useState(listCompanyLocation);
  const [socialMedia, setSocialMedia] = useState(initSocialMedia);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  return (
    <Layout title="Pengaturan">
      <div className="flex gap-x-5">
        <span className="w-[400px] shrink-0">
          <Card>
            <CardHeader className="font-semibold">Logo</CardHeader>
            <CardContent>
              <UploadFile />
            </CardContent>
          </Card>
        </span>

        <div className="flex w-full flex-col gap-y-4">
          <Card>
            <CardHeader className="font-semibold">Social Media</CardHeader>
            <CardContent>
              <FormSocialMedia
                data={socialMedia}
                setSocialMedia={setSocialMedia}
              />

            <CardHeader className="pl-0 font-semibold mt-5 pb-5">Kontak</CardHeader>
              <div className="rounded-lg bg-gray-100 p-5">
                <ContainerInput direction="row" className="w-full gap-x-5">
                  <Label className="uppercase">
                    <FaWhatsapp size={26} />
                  </Label>
                  <Input
                    name="whatsapp"
                    placeholder="Nomor Whatsapp"
                    className="!h-11"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                </ContainerInput>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="font-semibold">Lokasi Kantor</CardHeader>
            <CardContent className="flex flex-col gap-y-5">
              {/* <ContainerInput direction="row">
              <Label className="w-80 text-right text-gray-500 text-sm">Nomor Whatsapp</Label>
              <Input placeholder="628883293003" />
            </ContainerInput> */}

              <FormCompanyLocation
                data={companyLocations}
                setCompanyLocation={setCompanyLocations}
              />

              {/* <ContainerInput direction="row">
              <Label className="w-80 text-right text-gray-500 text-sm">Sosial Media</Label>
              <Input placeholder="628883293003" />
            </ContainerInput> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function FormCompanyLocation({
  data,
  setCompanyLocation,
}) {
  return (
    <div className="flex flex-col gap-y-5">
      {data.map((item, key) => (
        <CompanyLocationItem
          key={key}
          data={item}
          number={key + 1}
          setCompanyLocation={setCompanyLocation}
        />
      ))}

      <div>
        <Button
          className="flex h-[9.188rem] w-full items-center justify-center gap-x-2 text-sm font-semibold text-gray-500 hover:border hover:border-dashed hover:border-gray-300 hover:bg-gray-50"
          variant="ghost"
          onClick={() =>
            setCompanyLocation((state) => [
              ...state,
              {
                address: "",
                link_google_map: "",
              },
            ])
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
  setCompanyLocation,
}) {
  
  const onChange = (e) => {
    setCompanyLocation(state => { 
      return state.map((item, key) => {
        if (key === number - 1) return { ...item, [e.target.name]: e.target.value }
        
        return { ...item }
      })
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
            <Textarea name="address" placeholder="Masukkan alamat" value={data.address} onChange={onChange}/>
          </ContainerInput>

          <ContainerInput direction="row">
            <Label className="w-52 text-right text-sm text-gray-600">
              Link Google map
            </Label>
            <Textarea
              name="link_google_map"
              placeholder="Masukkan Link"
              value={data.link_google_map}
              onChange={onChange}
            />
          </ContainerInput>
        </div>
        <div className="flex w-40 cursor-pointer items-center justify-center">
          <Button
            variant="danger"
            className="rounded-md py-4 !px-2.5 text-white"
            onClick={() => setCompanyLocation((state) => state.filter((_,key) => key !== number - 1))}
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

