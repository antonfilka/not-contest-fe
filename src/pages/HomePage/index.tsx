import type { FC } from "react";

import { Page } from "@/components/Page.tsx";

export const HomePage: FC = () => {
  return (
    <Page back={false}>
      <div className="w-full h-full flex flex-col">
        <section className="h-[60px] w-full flex items-center justify-between">
          <h1 className="text-title">Not Store</h1>
          <div className="flex items-center gap-[8px]">
            <button>1</button>
            <button>2</button>
          </div>
        </section>

        <section className="flex-1 flex flex-wrap gap-[12px]">
          <div className="w-[48%] bg-white"></div>
          <div className="w-[48%] bg-white"></div>
          <div className="w-[48%] bg-white"></div>
          <div className="w-[48%] bg-white"></div>
          <div className="w-[48%] bg-white"></div>
        </section>
      </div>
    </Page>
  );
};
