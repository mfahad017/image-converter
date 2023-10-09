import { Footer } from '@/layout/Footer';
import { Navbar } from '@/layout/Navbar';
import { PropsWithChildren, ReactNode } from 'react';

type IMainProps = PropsWithChildren<{
  meta?: ReactNode;
}>;

export const Main = ({ children, meta }: IMainProps) => {
  return (
    <>
      {meta}
      <div className="flex flex-col min-h-screen container mx-auto">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
};
