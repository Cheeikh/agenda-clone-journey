
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Calendar } from '@/components/calendar/Calendar';

const Index = () => {
  return (
    <Layout>
      <div className="flex-1 overflow-hidden">
        <Calendar />
      </div>
    </Layout>
  );
};

export default Index;
