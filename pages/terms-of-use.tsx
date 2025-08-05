import React from 'react';
import { GetServerSideProps } from 'next';
import { MainContextProvider } from '@/contexts/MainContext';
import TermsOfUseTextBlock from '@/components/text-block/termsOfUseTextBlock';
import Footer from '@/components/footer/Footer';
import Modal from '@/components/modal/Modal';
import { useMetrica } from 'next-yandex-metrica';
import { useEffect } from 'react';

interface TermsOfUsePageProps {
  userData: any;
}

export default function TermsOfUsePage({ userData }: TermsOfUsePageProps) {
  const { reachGoal } = useMetrica();

  useEffect(() => {
    // Send Yandex Metrica event for terms of use page view
    reachGoal('terms_of_use_page_viewed');
  }, [reachGoal]);

  return (
    <MainContextProvider>
      <div>
        <main>
          <TermsOfUseTextBlock />
          <Modal />
          <Footer />
        </main>
      </div>
    </MainContextProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const userData = req.headers['user-data'] ? JSON.parse(req.headers['user-data'] as string) : null;

  return {
    props: {
      userData,
    },
  };
}; 