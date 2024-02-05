import { Button } from "@/components/ui/button";
import ContainerInput from "@/components/ui/container/ContainerInput";
import Editor from "@/components/ui/editor/Editor";
import { Input } from "@/components/ui/form/input";
import SrcFileManager from "@/components/ui/form/input/SrcFileManager";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { useMobile } from "@/lib/hooks";
import { slugString } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import parser from "html-react-parser";
import Router from "next/router";
import React, { useState } from "react";
import { GoGear } from "react-icons/go";
import { IoIosArrowRoundForward } from "react-icons/io";
import 'swiper/css';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";

const initModal = Object.freeze({ show: false, type: "" });
const initProject = Object.freeze({ title:"", image:[], description:"" })
export default function SectionProjects({ edit, section, onUpdateContent }) {
  const { mobileSm } = useMobile();
  const [modal, setModal] = useState(initModal);
  const content = section?.content;
  const projects = content?.projects;

  const onApply = (projects) => {
    onUpdateContent({
      ...section,
      content: {
        projects
      }
    });

    setModal(initModal);
  }
  
  return <>
    {edit && modal.show && <ModalManageProject onApply={onApply} data={modal?.data} show={modal.show} onHide={() => setModal(initModal)} />}
    <section className="relative mb-24" id="section_projects">
    {edit && <Setting onClick={() => setModal({ show: true, type: "projects", data: content?.projects || [] })} />}
      <Swiper
       effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
      >
        {projects?.map((project, key) => {
          const backgroundImage = project?.images?.length ? {
            backgroundImage: `url('${project.images?.[0]}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `100% ${mobileSm ? "100%" : ""}`,
          } : {};

          const firstWord = project.title.split(" ")?.[0] || "";
          return (
          <SwiperSlide key={key}>
              <div className="h-[700px] sm:h-[500px] lg:px-4 px-5 lg:h-[700px] relative object-cover" style={backgroundImage}>
                <div className="absolute z-10 bg-black opacity-60 inset-0 "></div>
                <div className="flex lg:flex-row lg:justify-start justify-center flex-col  max-w-[1200px] text-white z-50 relative items-center h-full mx-auto">       
                  <div className="flex flex-col gap-y-3  max-w-[500px] shrink-0">
                    <div className="font-cinzel tracking-wide text-lg">Projek Kami</div>  
                    <span data-first-word={firstWord} className="text-xl sm:text-2xl lg:text-4xl pr-5 font-jasans tracking-wide">{project.title}</span>
                    <div className="max-w-[600px] lg:hidden">
                      <span className="font-jasans lg:text-base text-sm tracking-wider leading-7 line-clamp-[10]">{parser(project?.description || "")}</span>
                    </div>

                    <Button
                      onClick={() => {
                        if (edit) return;
                        Router.push(`/project/${slugString(project.title)}`);
                      }}
                      className="max-w-[200px] hover:opacity-75 hover:!bg-transparent !py-6 gap-x-2 tracking-wider flex !justify-start items-center pl-0" variant="ghost"
                    >
                      <span className="font-jasans" >Selengkapnya</span>
                      <IoIosArrowRoundForward size={27}/>
                    </Button>
                  </div>
                  <div className="max-w-[600px] lg:block hidden">
                    <span className="font-jasans tracking-wider lg:text-base text-sm leading-7 line-clamp-[10]">{parser(project?.description || "")}</span>                    
                  </div>
                </div>
            </div>
            </SwiperSlide>
          )
        }
      )}
      </Swiper>
    </section>
  </>
}

function Setting({ onClick }) {
  return <div className="absolute -top-10">
    <Button variant="gray" className="shadow-md flex gap-x-2" onClick={onClick} >
      <span>Kelola</span>
      <GoGear size={20}/>
    </Button>
  </div>
}

function ModalManageProject({ data, show, onHide, onApply }) {
  const [projects, setProjects] = useState(data);
  const onChangeContent = (name, value, index) => {
    setProjects(projects => {
      return projects.map((project, key) => {
        if (index === key) return { ...project, [name]: value };
        return project;
     })       
    })
  }

  const onAdd = () => {
    setProjects(projects => [...projects, initProject])
  }

  return <Modal size="lg" show={show} onHide={onHide}>
    <ModalHeader onHide={onHide}>Kelola Projek</ModalHeader>
    <ModalBody >
      {projects?.map((item, key) => <React.Fragment key={key}>
        <ProjectItem data={item} number={key + 1} index={key} onChangeContent={onChangeContent} />
        {projects?.length > 1 && <hr className="my-8"/>}
      </React.Fragment>)}
      <Button onClick={onAdd} variant="ghost" className="border !py-6 !border-dashed w-full !border-gray-300 tracking-wide text-gray-500">TAMBAH</Button>
    </ModalBody>
    <ModalFooter>
      <Button className="w-full !py-5" onClick={() => onApply(projects)}>Terapkan</Button>
    </ModalFooter>
  </Modal>
}

function ProjectItem({ data, number, onChangeContent, index }) {
  return <div className="flex flex-col gap-y-5 relative">
    <div className="absolute right-0 -top-2 bg-red-500 text-white rounded-lg w-7 h-7  flex justify-center items-center">{number}</div>
    <ContainerInput>
      <Label className="font-medium">Title</Label>
      <Input placeholder="Title" name="title" value={data?.title || ""} onChange={(e) => onChangeContent(e.target.name, e.target.value, index)} />
    </ContainerInput>
    <ContainerInput>
      <Label className="font-medium">Gambar</Label>
      <SrcFileManager
        onSave={(src) => {
          onChangeContent("images", src, index)
        }}
        values={data?.images}
        onRemoveFile={(index) => {
          const clone = [...selectedFiles];
          clone.splice(index, 1);
          
        }}
      />
    </ContainerInput>
    <ContainerInput>
      <Label className="font-medium">Deskripsi</Label>
      <Editor value={data?.description} onChange={(content) => onChangeContent("description", content, index)} />
    </ContainerInput>
  </div>
}