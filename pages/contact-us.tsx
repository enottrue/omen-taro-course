import React from 'react';
import { GetServerSideProps } from 'next';
import { MainContextProvider } from '@/contexts/MainContext';
import ContactUsTextBlock from '@/components/text-block/contactUsTextBlock';
import Footer from '@/components/footer/Footer';
import Modal from '@/components/modal/Modal';
import { useMetrica } from 'next-yandex-metrica';
import { useEffect } from 'react';

interface ContactUsPageProps {
  userData: any;
}

export default function ContactUsPage({ userData }: ContactUsPageProps) {
  const { reachGoal } = useMetrica();

  useEffect(() => {
    // Send Yandex Metrica event for contact us page view
    reachGoal('contact_us_page_viewed');
  }, [reachGoal]);

  return (
    <MainContextProvider>
      <div>
        <main>
          <ContactUsTextBlock />
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