import React from 'react';
import Head from 'next/head';
import Bitrix24Test from '@/components/Bitrix24Test';

const Bitrix24TestPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Тест интеграции с Битрикс24</title>
        <meta name="description" content="Тестовая страница для проверки интеграции с Битрикс24" />
      </Head>
      
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5',
        padding: '20px 0'
      }}>
        <Bitrix24Test />
      </div>
    </>
  );
};

export default Bitrix24TestPage; 