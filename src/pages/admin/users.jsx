import ModalForm from "@/components/features/users/ModalForm";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import ButtonDelete from "@/components/ui/button/ButtonDelete";
import ButtonEdit from "@/components/ui/button/ButtonEdit";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Ribbon from "@/components/ui/card/ribbon";
import SearchInput from "@/components/ui/form/input/SearchInput";
import { Confirmation } from "@/components/ui/modal/Confirmation";
import ShimmerCard from "@/components/ui/shimmer/ShimmerCard";
import Pagination from "@/components/ui/table/PaginationTable";
import { deleteUser, getUsers, insertUser, updateUser } from "@/lib/api/users";
import { USER_TYPE_ENUM } from "@/lib/enum";
import { useDialogStore } from "@/lib/hookStore";
import { ERROR_MESSAGE } from "@/lib/message";
import { adminUsersQuery } from "@/lib/queryKeys";
import { debounce } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cn from "classnames";
import { useRef, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FiUserPlus } from "react-icons/fi";

const initConfirmation = Object.freeze({ show: false, type: "" });

const initForm = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category_id: 0,
  active: "N"
}

const initModal = Object.freeze({ show: false, type: "" });
export default function Index() {
  const [modal, setModal] = useState(initModal);
  const wrapperRef = useRef();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [confirmation, setConfirmation] = useState(initConfirmation);
  const queryClient = useQueryClient();
  const showToast = useDialogStore(state => state.showToast);

  const { mutate: mutateDeleteUser, isLoading: isLoadingDeleteArticle } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      showToast("success-delete-user")
      setConfirmation(initConfirmation);
      queryClient.invalidateQueries(adminUsersQuery.getAll);
    },
    onError: () => showToast("error-delete-user"),
  });
  const { mutate: mutateUpdateUser, isLoading: isLoadingUpdate } = useMutation({
    mutationFn: ({ username, ...payload }) => {
      return updateUser(username, payload);
    },
    onSuccess: () => {
      showToast("success-update-user")
      setModal(initModal);
      queryClient.invalidateQueries(adminUsersQuery.getAll);
    },
    onError: () => showToast("error-update-user"),
  });

  const { mutate: mutateInsertUser, isLoading: isLoadingAdd } = useMutation({
    mutationFn: insertUser,
    onSuccess: () => {
      showToast("success-insert-user")
      setModal(initModal);
      queryClient.invalidateQueries(adminUsersQuery.getAll);
    },
    onError: (response) => {
      if (response.response?.data?.code === ERROR_MESSAGE.UserIsAlreadyExists.code) {
        showToast("error-user-is-already-exists")
        return;
      }
      showToast("error-insert-user");
    }
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: adminUsersQuery.getAll(page, keyword),
    queryFn: async () => {
      const params = {
        q: keyword,
        page,
      };
      const response = await getUsers(params);
      return response.data || []
    }
  });

  const onEdit = (data) => setModal({ show: true, type: "edit", data });
  const onDelete = (data) => setConfirmation({ show: true, type: "delete", data })

  const onConfirmDelete = () => {
    if (!confirmation.data?.username) return;
    mutateDeleteUser(confirmation.data.username);
  }

  const debounceSearch = debounce(setKeyword);
  const onNextPrev = (current) => setPage(page => page + current);

  const onSave = (payload) => {
    if (modal.type === "edit") {
      mutateUpdateUser(payload);
      return;
    }

    mutateInsertUser(payload);
  }
  
  return (
    <>
      {
        modal.show &&
        <ModalForm
          show={modal.show}
          type={modal.type}
          data={modal.data}
          onHide={() => setModal(initModal)}
          onSave={onSave}
          isLoading={isLoadingAdd}
        />
      }
      <Confirmation
        show={confirmation.show}
        onHide={() => setConfirmation(initConfirmation)}
        onConfirm={onConfirmDelete}
        isLoading={isLoadingDeleteArticle}
      >
        <div className="text-center">
          Apakah anda yakin ingin menghapus username <br /> <span className="font-semibold text-gray-900">{confirmation?.data?.username}</span> ?
        </div>
      </Confirmation>
      <Layout title="Users">
        <div className="flex justify-between mb-5">
          <SearchInput placeholder="Cari User" className="!w-[300px]" onChange={e => debounceSearch(e.target.value)} />
          <Button className="flex gap-x-2 w-[150px]" onClick={() => setModal({ show:true, type:"add" })}>
            <FiUserPlus size={20} />
            <span>Buat Akun</span>
          </Button>
        </div>
        <div className={cn("flex flex-wrap gap-5")} ref={wrapperRef} >
          {
            isLoading || isFetching ?
              <ShimmerCard total={8} />
              :
              data?.data?.map((item, key) =>
                <CardItem
                  key={key}
                  data={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />)
          }
        </div>
        {data?.paging && (
          <Pagination
            currentPage={page}
            pagination={data.paging}
            onNext={onNextPrev}
            onPrev={onNextPrev}
          />
        )}
      </Layout>
    </>
  );
}


function CardItem({ data, onDelete, onEdit }) {
  return <Card className="flex flex-col w-[380px] pt-6 pb-3 relative">
    {data.role === "SUPER_ADMIN" && <Ribbon text="All Access" />}
    <CardContent className="!pt-3 flex gap-x-5">
      <div className="shrink-0">
        <AiOutlineUser size={70} color="gray" />
      </div>
      <table className="border-spacing-0">
        <tbody>
          <Info title="Nama" text={data.name}/>
          <Info title="Username" text={data.username}/>
          <Info title="Role" text={<span className="text-xs  rounded-md bg-gray-100 py-1 px-2 first-letter:uppercase font-bold">{data.role}</span>} />
        </tbody>
      </table>
    </CardContent>
    <CardFooter className="!pb-0 gap-x-3 justify-center">
      {data?.role !== USER_TYPE_ENUM.SuperAdmin && 
        <>
        <ButtonEdit variant="secondary" onClick={() => onEdit(data) }/>
        <ButtonDelete variant="danger" onClick={() => onDelete(data)}/>
        </>
      }
    </CardFooter>

  </Card>
}

function Info({ title, text}) {
  return <tr>
    <td className="font-semibold ">{title}</td>
    <td className="px-2">:</td>
    <td title={text} className="text-gray-600 break-all line-clamp-1">{text}</td>
  </tr>
}