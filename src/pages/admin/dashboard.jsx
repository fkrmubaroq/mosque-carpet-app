import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import Table, { Td, Th, Thead, Tr } from "@/components/ui/table";
import { TRACK_PAGE } from "@/lib/enum";
import { formatNumberToPrice } from "@/lib/utils";
import ButtonClick from "@/models/button-click";
import Product from "@/models/product";
import Visitor from "@/models/visitor";
import { CiBoxes } from "react-icons/ci";
import { IoNewspaperOutline } from "react-icons/io5";
import { LuMousePointerClick } from "react-icons/lu";
import { TbUsersGroup } from "react-icons/tb";

export async function getServerSideProps() {
  const visitor = new Visitor();
  const product = new Product();
  const buttonClick = new ButtonClick();
  
  const allVisitorLp = await visitor.getAllVisitor(TRACK_PAGE.LandingPage);
  const allVisitorArticle = await visitor.getAllVisitor(TRACK_PAGE.Article);

  const visitorLpToday = await visitor.getVisitorToday(TRACK_PAGE.LandingPage);
  const visitorArticleToday = await visitor.getVisitorToday(TRACK_PAGE.Article);

  const totalAllProduct = await product.totalAllProduct();
  const totalProductActive = await product.totalProductActive();

  const totalAllClick = await buttonClick.getAllVisitorClick();
  const totalClickToday = await buttonClick.getClickToday();

  const summary = {
    product: {
      all: totalAllProduct,
      active: totalProductActive,
    },
    visitor: {
      lp: {
        all: allVisitorLp,
        today: visitorLpToday
      },
      article: {
        all: allVisitorArticle,
        today: visitorArticleToday
      }
    },
    buttonClick: {
      all: totalAllClick,
      today: totalClickToday
    }
  }

  return {
    props: {
      summary
    }
  }
}
export default function Dashboard({ summary }) {
  const summaryArticle = summary.visitor.article;
  const summaryLp = summary.visitor.lp;
  const summaryProduct = summary.product;
  const summaryButtonClick = summary.buttonClick;

  return <Layout title="Dashboard">
    <div className="grid grid-cols-4 gap-5">
      <SummaryCard
        title="Produk Aktif"
        total={summaryProduct.active}
        icon={<CiBoxes color="#777" size={50} />}
        subTitle={<><span className="font-semibold">{formatNumberToPrice(summaryProduct.all)}</span> Semua Produk</>}       
      />
      <SummaryCard
        title="Pengunjung Hari ini"
        total={formatNumberToPrice(summaryLp.today)}
        subTitle={<><span className="font-semibold">{formatNumberToPrice(summaryLp.all)}</span> Pengunjung</>} 
        icon={<TbUsersGroup color="#777" size={50} />}
      />
      <SummaryCard
        title="Pengunjung Artikel Hari ini"
        total={formatNumberToPrice(summaryArticle.today)}
        subTitle={<><span className="font-semibold">{formatNumberToPrice(summaryArticle.all)}</span> Pengunjung</>} 
        icon={<IoNewspaperOutline color="#777" size={50}
        />}
      />
      <SummaryCard
        title="CTA Click Hari ini"
        total={summaryButtonClick.all}
        subTitle={<><span className="font-semibold">{formatNumberToPrice(summaryButtonClick.today)}</span> Total Clicks</>} 
        icon={<LuMousePointerClick color="#777" size={50} />}
      />
    </div>

    <div className="mt-6">
      <div className="text-lg mb-4 font-medium">Pengunjung Artikel</div>
      <Table>
        <Thead >
          <Tr className="!border-none">
            <Th className="!bg-gray-200 rounded-tl-lg w-1/2">Title</Th>
            <Th className="!bg-gray-200">Penulis</Th>
            <Th className="!bg-gray-200 rounded-tr-lg">Total Pengunjung</Th>
          </Tr>
        </Thead>
        <tbody>
          <Tr>
            <Td>Lorem ipsum dolor sit amet.</Td>
            <Td>Titiek wardifah</Td>
            <Td>19</Td>
          </Tr>
        </tbody>
        </Table>
    </div>
  </Layout>
}


function SummaryCard({ title, total, icon, subTitle }) {
  return <Card>
    <CardContent className="pt-5">
      <div className="flex gap-x-5 items-end">
        {icon}
        <div className="flex flex-col gap-y-2">
          <div className="text-base font-jasans tracking-wide text-gray-600 font-medium">{title}</div>
          <div className="text-2xl font-bold tracking-wider text-gray-600">{total}</div>
        </div>
      </div>
      <div className="text-sm mt-5 text-gray-400">{subTitle}</div>
    </CardContent>
  </Card>
}
