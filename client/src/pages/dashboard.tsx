import PrimaryButton from "@/components/buttons/PrimaryButton";
import FileCard from "@/components/cards/FIleCard";
import FolderCard from "@/components/cards/FolderCard";
import MainLayout from "@/layouts";
import { NextPageWithLayout } from "@/types/Layout";
import Head from "next/head";

const Dashboard: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Vetra | Dashboard</title>
      </Head>
      <section>
        <div className="container px-6 py-3 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl">
              My Files
            </h1>
            <PrimaryButton
              text={"Refresh Files / Folders"}
              isWidthFull={false}
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 capitalize mb-4">
            Folders
          </h1>
          <div className="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <FolderCard
                key={i}
                title={"Folder Name"}
                hrefPath={"/dashboard/folder"}
              />
            ))}
          </div>
          <h2 className="text-sm font-semibold text-gray-800 capitalize lg:text-xl mt-8 mb-4">
            All Files
          </h2>
          <div className="grid grid-cols-1 gap-8 xl:gap-12 md:grid-cols-4 mb-4">
            {[...Array(9)].map((_, i) => (
              <FileCard key={i} file={"File Name"} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

Dashboard.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Dashboard;
